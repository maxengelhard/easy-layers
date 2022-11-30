import json
import sys 
import os
import shutil
import boto3
from subprocess import run,CalledProcessError
from zipfile import ZipFile
import platform
    
S3 = boto3.resource('s3')
Lambda = boto3.client('lambda')
ddb = boto3.client('dynamodb')
region = os.environ.get('AWS_REGION')
websocket_table = os.environ['WEBSOCKET_CONNECTIONS_TABLE']
errors_table = os.environ['ERROR_LAYERS_TABLE']
s3_bucket = os.environ['S3_BUCKET']

def lambda_handler(event, context):
    print(event)
    message = json.loads(event['Records'][0]['body'])
    print(message)
    # Test Access permision to S3

    region = event['Records'][0]['awsRegion']
    print(region)
    Bucket = S3.Bucket(s3_bucket)
    
    # Extract parameters from API
    body =  message["body"]
    print(body)
    library = body["library"]
    library_version = body.get("version")
    

    machine = 'arm64' if platform.machine() == 'aarch64' else platform.machine()
    run_time = 'python' + '.'.join(sys.version.split(' ')[0].split('.')[0:2])
    run_time_dash = 'py' + ''.join(sys.version.split(' ')[0].split('.')[0:2]) 

    
    # get the library name and if it has versions make it like such requests==2.28.1
    library_install = library if library_version is None else library + "==" + library_version
    # Check if the package  exists 
    max_version = message['max_version'] 
    max_version_and_lib = library + "==" + str(max_version)

    # make the layer name readable and consistent of an ARN and for S3
    library_and_version=None
    if library_version is None:
        library_and_version=max_version_and_lib.replace('==','-')
    else:
        library_and_version=library_install.replace('==','-')
    
    layer_name =  (library_and_version + '-' + run_time_dash + '-' + machine[0:3]).replace('.','-')
    
    # Create a new layer 
    result = create_new(library_install, layer_name, region, Bucket, Lambda,run_time,machine)
    
    print(result)

    send_message_to_all_connections(result)
    
    return result

def create_new(library_install, layer_name, region, Bucket, Lambda,run_time,machine):
    # if layer doesn't exist the run the process of making a new layer
    # Make sure the dir is empty
    run(["rm" , "-rf", "/tmp/*"])
    # Prepare the dir 
    run(["mkdir" ,"/tmp/python" ])
    # Install the new libraries
    outcome = run(["python" , "-m" , "pip" , "install" , library_install  , "-t", "/tmp/python"], check=False, capture_output=True,text=True)
    # print logs
    print(f"returncode = {outcome.returncode}")
    print(f"output: \n {outcome.stdout}")
    
    # Calculate layer limit
    dir_size = run(["du" , "-sh", "/tmp/python"], capture_output=True, text=True)
    dir_size = dir_size.stdout.split()[0]
    dir_size = dir_size.split("M")[0]
    dir_size = dir_size if len(dir_size.split("K"))<2 else float(dir_size.split("K")[0])/1000
    
    if int(float(dir_size)) >= 250:
        raise ValueError( "Couldn't run. Layer size is over limit.") 

    # Zip the installed libraries
    zip_directory("/tmp/python/" , "/tmp/python.zip")
    

    # Upload the library into S3
    try:
        Bucket.upload_file("/tmp/python.zip", "layers_repository/" + layer_name + ".zip")
    except Exception as e:
        raise e
    # Create a new layer
    try:
        new_layer = Lambda.publish_layer_version(LayerName= layer_name,
                                                     Content= {
                                                        'S3Bucket': s3_bucket,
                                                        'S3Key':  "layers_repository/" + layer_name + ".zip"},
                                                     CompatibleRuntimes=[run_time],
                                                     CompatibleArchitectures=[machine])
        
        give_permission_to_all = Lambda.add_layer_version_permission(
                                                    LayerName=layer_name,
                                                    VersionNumber=new_layer['Version'],
                                                    StatementId='ShareToAll',
                                                    Action='lambda:GetLayerVersion',
                                                    Principal='*'
                                                )
    except Exception as e:
        raise e
    # Return layer version ARN
    return {"Layer_ARN": new_layer["LayerVersionArn"]}
        

def zip_directory(folder_path, zip_path):
    with ZipFile(zip_path, mode='w') as zipf:
        len_dir_path = len(folder_path)
        for root, _, files in os.walk(folder_path):
            for file in files:
                file_path = os.path.join(root, file)
                zipf.write(file_path, 'python/'+file_path[len_dir_path:])


def send_message_to_all_connections(message):

    connection_ids = ddb.scan(
        TableName=websocket_table,
        ProjectionExpression='connectionId'
    )['Items']
    for item in connection_ids:
        connection_id = item['connectionId']['S']
        send_message(connection_id,message)
    return {
        'statusCode': 200
    }

def send_message(connection_id, message):
    gatewayapi = boto3.client('apigatewaymanagementapi', endpoint_url=f'https://wss-{region}.easylayers.dev')
    gatewayapi.post_to_connection(ConnectionId=connection_id, Data=json.dumps(message))
    return
    

    
    
    
    


    
    
    
    
