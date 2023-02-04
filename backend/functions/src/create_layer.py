import json
import sys 
import os
import shutil
import boto3
from subprocess import run,CalledProcessError
import urllib.request
from zipfile import ZipFile
from lambda_decorators import json_http_resp, load_json_body,json_schema_validator,cors_headers
from request_schema import request_schema
import requests
import platform

try:
    from packaging.version import parse
except ImportError:
    from pip._vendor.packaging.version import parse
    
S3 = boto3.resource('s3')
Lambda = boto3.client('lambda')

@cors_headers
@json_http_resp
@json_schema_validator(request_schema)
def lambda_handler(event, context):
    
    print(event)
    # Test Access permision to S3

    region = '-'.join(event.get('requestContext').get('domainPrefix').split('-')[1:])
    Bucket = S3.Bucket(f'easy-layers-dev-{region}')
    try:
        Bucket.objects.limit(count=1)
    except Exception:
        return "This function has no access to this bucker or its not exists, please validate"
    # Test access to lambda resources
    try:
        Lambda.list_functions()
    except Exception:
        return "This function has no access to Lambda resources, please validate"
    # Create a new layer 
    result = create_new(event , region, Bucket, Lambda)
    
    print(result)
    
    return result

def create_new(event, region, Bucket, Lambda):
    # Extract parameters from API
    body =  event["body"]
    library = body["library"]
    library_version = body.get("version")
    

    machine = 'arm64' if platform.machine() == 'aarch64' else platform.machine()
    run_time = 'python' + '.'.join(sys.version.split(' ')[0].split('.')[0:2])
    run_time_dash = 'py' + ''.join(sys.version.split(' ')[0].split('.')[0:2]) 

    
    # get the library name and if it has versions make it like such requests==2.28.1
    library_install = library if library_version is None else library + "==" + library_version
    # Check if the package  exists 
    max_version = check_if_package_exists(library,library_version,library_install)
    max_version_and_lib = library + "==" + str(max_version)

    # make the layer name readable and consistent of an ARN and for S3
    library_and_version=None
    if library_version is None:
        library_and_version=max_version_and_lib.replace('==','-')
    else:
        library_and_version=library_install.replace('==','-')
    
    layer_name =  (library_and_version + '-' + run_time_dash + '-' + machine[0:3]).replace('.','-')

    # Then check if Layer exists in the account already
    layer_exists = check_if_layer_exists(layer_name)
    # if layer exists return the Layer ARN
    if layer_exists:
        return {"Layer_ARN": layer_exists}
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
                                                        'S3Bucket': 'easy-layers-dev-'+ region,
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
    


def check_if_package_exists(package,package_version,package_install):
    
    # check the latest version using pip api
    URL_PATTERN = 'https://pypi.python.org/pypi/{package}/json'
    
    def get_version(package, url_pattern=URL_PATTERN):
        """Return version of package on pypi.python.org using json."""
        req = requests.get(url_pattern.format(package=package))
        version = parse('0')
        if req.status_code == 200:
            j = json.loads(req.text.encode(req.encoding))
            releases = j.get('releases', [])
            check_version_requested = False
            for release in releases:
                ver = parse(release)
                if str(package_version)==str(ver):
                    check_version_requested = True   
                if not ver.is_prerelease:
                    version = max(version, ver)
        else:
            raise ValueError(f'Package {package} Does Not Exist')
        if not check_version_requested and package_version is not None: 
            raise ValueError(f'Package {package_install} Does Not Exist')
        return version
    
    max_version = get_version(package)
    
    
    return max_version
    
    

def check_if_layer_exists(layer_name):
    try:
        list_layer_version = Lambda.list_layer_versions(LayerName=layer_name)["LayerVersions"][0]["LayerVersionArn"]
        return list_layer_version
    except Exception:
        pass
    
    

def zip_directory(folder_path, zip_path):
    with ZipFile(zip_path, mode='w') as zipf:
        len_dir_path = len(folder_path)
        for root, _, files in os.walk(folder_path):
            for file in files:
                file_path = os.path.join(root, file)
                zipf.write(file_path, 'python/'+file_path[len_dir_path:])

# def update(event, Bucket, Lambda):
#     # Getting the layer version
#     list_layer_version = Lambda.list_layer_versions(LayerName=event["library"])
#     layer_version = list_layer_version["LayerVersions"][0]["Version"]
#     # getting the layer version details
#     get_layer_details = Lambda.get_layer_version(LayerName=event["layer_name"],VersionNumber=layer_version)
#     layer_s3_link = get_layer_details["Content"]["Location"]
#     # Download nad unzip the layer content
#     urllib.request.urlretrieve(layer_s3_link, '/tmp/python.zip')
#     shutil.unpack_archive("/tmp/python.zip", "/tmp", "zip")
#     # Update the current libraries
#     library=event["library"]
#     run(["python" , "-m" , "pip" , "install" , library , "-t", "/tmp/python"])
#     # Calculate layer limit
#     dir_size = run(["du" , "-sh", "/tmp/python"], capture_output=True, text=True)
#     dir_size = dir_size.stdout.split()[0]
#     dir_size = dir_size.split("M")[0]
#     if int(float(dir_size)) >= 250:
#         return "Layer size is over limit, please consider removing unnecessary libraries"
#     # Zip the installed libraries
#     zip_directory("/tmp/python/" , "/tmp/python.zip")
#     # Upload the library into S3
#     try:
#         Bucket.upload_file("/tmp/python.zip", "python.zip")
#     except Exception as e:
#         return {"ERROR: ":e}
#     # Create a new layer
#     try:
#         new_layer = Lambda.publish_layer_version(LayerName= event["layer_name"],
#                                                      Content= {
#                                                         'S3Bucket': event["s3_bucket"],
#                                                         'S3Key': 'python.zip'},
#                                                      CompatibleRuntimes=['python'+ '.'.join(sys.version.split(' ')[0].split('.')[0:2])],
#                                                      CompatibleArchitectures=["x86_64", "arm64"])
#     except Exception as e:
#         print (e)
#     # Return layer version ARN
#     return new_layer["LayerVersionArn"]
    
# def read_only(event, Bucket, Lambda):
#     # Prepare the dict
#     libraries_json = {}
#     # Getting the layer version
#     list_layer_version = Lambda.list_layer_versions(LayerName=event["library"])
#     layer_version = list_layer_version["LayerVersions"][0]["Version"]
#     # getting the layer version details
#     get_layer_details = Lambda.get_layer_version(LayerName=event["library"],VersionNumber=layer_version)
#     layer_s3_link = get_layer_details["Content"]["Location"]
#     # Download nad unzip the layer content
#     urllib.request.urlretrieve(layer_s3_link, '/tmp/python.zip')
#     shutil.unpack_archive("/tmp/python.zip", "/tmp", "zip")
#     # Get the libraries details
#     libraries_list = run(["pip", "list", "--path", "/tmp/python"], capture_output=True, text=True)
#     libraries_list = libraries_list.stdout.split()[4:]
#     # Looping over the return and convert it into dict
#     count = 0
#     while(count != len(libraries_list)):
#         count_val = count + 1
#         libraries_json[libraries_list[count]] = libraries_list[count_val]
#         count = count_val + 1
#     # Return libraries versions
#     return libraries_json
    

    
    
    
    
