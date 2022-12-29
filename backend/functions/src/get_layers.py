import json
import sys 
import os
import shutil
import boto3
from subprocess import run
import urllib.request
from zipfile import ZipFile
from lambda_decorators import json_http_resp, cors_headers

@cors_headers
@json_http_resp
def lambda_handler(event, context):
    
    # Declare boto3 resouces 
    Lambda = boto3.client('lambda')
    S3 = boto3.client('s3')
    # Test access to lambda resources
    # list all layers 
    try:
        layers = Lambda.list_layers()["Layers"]
        
    except Exception as e:
        print(e)
        return "This function has no access to Lambda resources, please validate"
    try:
        response = S3.list_objects_v2(
            Bucket='easy-layers',
            # ContinuationToken='string',
        )
        
        trim_contents = []
        contents = response['Contents']
        for content in contents:
            obj = {'Key':content['Key'],'LastModified':content['LastModified']}
            trim_contents.append(obj)
            for layer in layers:
                if layer['LayerName']==content['Key'].replace('.zip','').replace('.','-'):
                    layer['Key']=content['Key']
                    layer['LastModified']=str(content['LastModified'])
        
    
    except Exception as e:
        raise e
    
    
    return layers
    
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
    
