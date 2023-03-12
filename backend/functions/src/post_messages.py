import json
import boto3
import os

ddb = boto3.client('dynamodb')
region = os.environ.get('AWS_REGION')
table_name = f'easy-layers-dev-{region}-websocket-connections'

def lambda_handler(event, context):
    print(event)
    message = {
        'message': 'Hello from Lambda!'
    }
    connection_ids = ddb.scan(
        TableName=table_name,
        ProjectionExpression='connectionId'
    )['Items']
    for item in connection_ids:
        connection_id = item['connectionId']['S']
        send_message(connection_id, message)
    return {
        'statusCode': 200
    }

def send_message(connection_id, message):
    gatewayapi = boto3.client('apigatewaymanagementapi', endpoint_url=f'https://wss-{region}.easylayers.dev')
    gatewayapi.post_to_connection(ConnectionId=connection_id, Data=json.dumps(message))
