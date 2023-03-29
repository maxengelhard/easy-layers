import boto3
import os
import json

ddb = boto3.client('dynamodb')
region = os.environ.get('AWS_REGION')
table_name = f'easy-layers-dev-{region}-error-layers'

def lambda_handler(event, context):
    print(event)
    message = json.loads(event['Records'][0]['body'])
    print(message)
    max_version = message['max_version'] 

    body =  message["body"]
    print(body)
    library = body["library"]
    library_version = body.get("version")

    machine = message['machine']
    run_time = message['run_time']

    version = library_version if library_version else max_version


    ddb.put_item(
        TableName=table_name,
        Item={
            'runtime': {'S': run_time},
            'machine': {'S': machine},
            'library': {'S': library},
            'version': {'S': version} 
        }
    )
    return {
        'statusCode': 200
    }