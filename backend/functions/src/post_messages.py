import json
import boto3

ddb = boto3.client('dynamodb')
table_name = 'easy-layer-websocket-connections'

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
    gatewayapi = boto3.client('apigatewaymanagementapi', endpoint_url=f'https://hp76daqm5g.execute-api.us-east-1.amazonaws.com/prod')
    gatewayapi.post_to_connection(ConnectionId=connection_id, Data=json.dumps(message))
