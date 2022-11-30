import boto3
import os

ddb = boto3.client('dynamodb')
region = os.environ.get('AWS_REGION')
websocket_table = os.environ['WEBSOCKET_CONNECTIONS_TABLE']
errors_table = os.environ['ERROR_LAYERS_TABLE']
s3_bucket = os.environ['S3_BUCKET']

def lambda_handler(event, context):
    print(event)
    connection_id = event['requestContext']['connectionId']
    ddb.put_item(
        TableName=websocket_table,
        Item={
            'connectionId': {'S': connection_id}
        }
    )
    return {
        'statusCode': 200
    }
