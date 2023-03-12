import boto3

ddb = boto3.client('dynamodb')
table_name = 'easy-layer-websocket-connections'

def lambda_handler(event, context):
    print(event)
    connection_id = event['requestContext']['connectionId']
    ddb.delete_item(
        TableName=table_name,
        Key={
            'connectionId': {'S': connection_id}
        }
    )
    return {
        'statusCode': 200
    }
