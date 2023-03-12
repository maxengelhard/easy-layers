import boto3
import os

ddb = boto3.client('dynamodb')
region = os.environ.get('AWS_REGION')
table_name = f'easy-layers-dev-{region}-websocket-connections'

def lambda_handler(event, context):
    print(event)
    connection_id = event['requestContext']['connectionId']
    ddb.put_item(
        TableName=table_name,
        Item={
            'connectionId': {'S': connection_id}
        }
    )
    return {
        'statusCode': 200
    }
