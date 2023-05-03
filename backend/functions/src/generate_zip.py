import json
import boto3
import platform
import sys
import os
from lambda_decorators import json_http_resp,cors_headers,load_json_body


Lambda = boto3.client('lambda')
s3 = boto3.client('s3')
s3_bucket = os.environ['S3_BUCKET']

@cors_headers
@load_json_body
@json_http_resp
def lambda_handler(event, context):
    """
    Generate a pre-signed URL for an S3 object.

    Args:
        bucket_name (str): The name of the S3 bucket.
        object_key (str): The key of the S3 object.
        expiration (int, optional): The expiration time of the pre-signed URL in seconds. Defaults to 3600.

    Returns:
        str: The pre-signed URL.
    """
    print(event)
    print(event['body'])
    object_key = event['body']['key']
    response = s3.generate_presigned_url(
        'get_object',
        Params={
            'Bucket': s3_bucket,
            'Key': object_key
        },
        ExpiresIn=3600
    )

    return response







