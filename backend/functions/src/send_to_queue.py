import json
import boto3
import platform
import sys
import os

sqs = boto3.client('sqs')

def lambda_handler(event, context):
    
    machine = 'arm' if platform.machine() == 'aarch64' else 'x86'
    run_time = ''.join(sys.version.split(' ')[0].split('.')[0:2])
    queue_name = f'py-{run_time}-{machine}-sqs-queue' 
    aws_account_id = context.invoked_function_arn.split(":")[4]
    region = os.environ.get('AWS_REGION')
    queue_url = f'https://sqs.{region}.amazonaws.com/{aws_account_id}/{queue_name}'
    
    
    message = json.dumps(event)
    response = sqs.send_message(QueueUrl=queue_url, MessageBody=message)
    return {
        'statusCode': 200,
        'body': json.dumps('Message sent successfully')
    }
