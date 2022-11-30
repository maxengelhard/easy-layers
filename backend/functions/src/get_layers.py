import json
import sys 
import os
import shutil
import boto3
from subprocess import run
import urllib.request
from lambda_decorators import json_http_resp, cors_headers

websocket_table = os.environ['WEBSOCKET_CONNECTIONS_TABLE']
errors_table = os.environ['ERROR_LAYERS_TABLE']
s3_bucket = os.environ['S3_BUCKET']


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

        print(event)
        
        response = S3.list_objects_v2(
            Bucket=s3_bucket,
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
                    
        usable_layers = [layer for layer in layers if not (len(layer['LayerName'].split('-')) > 1 and layer['LayerName'].split('-')[1] =='x')]
    
    except Exception as e:
        raise e
    
    print(usable_layers)
    
    return usable_layers
    
    

