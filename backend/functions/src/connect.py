import boto3

ddb = boto3.client('dynamodb')
table_name = 'easy-layer-websocket-connections'

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
