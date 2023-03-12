import json
import boto3

sqs = boto3.client('sqs')

def lambda_handler(event, context):
    queue_url = 'https://sqs.us-east-1.amazonaws.com/737802338670/my-queue'
    print(event)
    message = json.dumps(event)
    response = sqs.send_message(QueueUrl=queue_url, MessageBody=message)
    return {
        'statusCode': 200,
        'body': json.dumps('Message sent successfully')
    }