import os
import boto3
from lambda_decorators import json_http_resp, cors_headers

region = os.environ.get('AWS_REGION')
dynamodb = boto3.resource('dynamodb')
websocket_table = os.environ['WEBSOCKET_CONNECTIONS_TABLE']
errors_table = os.environ['ERROR_LAYERS_TABLE']
s3_bucket = os.environ['S3_BUCKET']
table = dynamodb.Table(errors_table)

@cors_headers
@json_http_resp
def lambda_handler(event, context):
    response = table.scan()
    items = response['Items']
    while 'LastEvaluatedKey' in response:
        response = table.scan(ExclusiveStartKey=response['LastEvaluatedKey'])
        items.extend(response['Items'])
    return items
