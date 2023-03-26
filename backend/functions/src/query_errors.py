import os
import boto3
from lambda_decorators import json_http_resp, cors_headers

region = os.environ.get('AWS_REGION')
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(f'easy-layers-dev-${region}-error-layers')

@cors_headers
@json_http_resp
def lambda_handler(event, context):
    response = table.scan()
    items = response['Items']
    while 'LastEvaluatedKey' in response:
        response = table.scan(ExclusiveStartKey=response['LastEvaluatedKey'])
        items.extend(response['Items'])
    return items