import json
import boto3
import platform
import sys
import os
from lambda_decorators import json_http_resp,json_schema_validator,cors_headers
from request_schema import request_schema
import requests
import platform


Lambda = boto3.client('lambda')

try:
    from packaging.version import parse
except ImportError:
    from pip._vendor.packaging.version import parse

sqs = boto3.client('sqs')

@cors_headers
@json_http_resp
@json_schema_validator(request_schema)
def lambda_handler(event, context):
    print(event)
    machine = 'arm' if platform.machine() == 'aarch64' else 'x86'
    run_time = ''.join(sys.version.split(' ')[0].split('.')[0:2])
    queue_name = f'py-{run_time}-{machine}-sqs-queue' 
    aws_account_id = context.invoked_function_arn.split(":")[4]
    region = os.environ.get('AWS_REGION')
    queue_url = f'https://sqs.{region}.amazonaws.com/{aws_account_id}/{queue_name}'
    
    
    # Extract parameters from API
    body = event["body"]
    print(body)
    library = body["library"]
    library_version = body.get("version")
    

    machine = 'arm64' if platform.machine() == 'aarch64' else platform.machine()
    run_time = 'python' + '.'.join(sys.version.split(' ')[0].split('.')[0:2])
    run_time_dash = 'py' + ''.join(sys.version.split(' ')[0].split('.')[0:2]) 

    
    # get the library name and if it has versions make it like such requests==2.28.1
    library_install = library if library_version is None else library + "==" + library_version
    # Check if the package  exists 
    max_version = str(check_if_package_exists(library,library_version,library_install)) 

    max_version_and_lib = library + "==" + max_version

    # make the layer name readable and consistent of an ARN and for S3
    library_and_version=None
    if library_version is None:
        library_and_version=max_version_and_lib.replace('==','-')
    else:
        library_and_version=library_install.replace('==','-')
    
    layer_name =  (library_and_version + '-' + run_time_dash + '-' + machine[0:3]).replace('.','-')

    # Check if Layer exists in the account already
    layer_exists = check_if_layer_exists(layer_name)
    # if layer exists return the Layer ARN
    if layer_exists:
        return {"Layer_ARN": layer_exists}  

    message = event
    message['max_version'] = max_version
    message['machine'] = machine
    message['run_time'] = run_time

    response = sqs.send_message(QueueUrl=queue_url, MessageBody=json.dumps(message))
    return 'Message sent successfully'



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
