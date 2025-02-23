import boto3
from botocore.exceptions import NoCredentialsError

import uuid

s3_client = boto3.client('s3')
bucket_name = "handslow"

def upload_image_to_s3(image_file):
    # Generate a unique file name for S3
    file_name = f"uploads/{uuid.uuid4().hex}"
    
    try:
        # Upload the file to S3
        s3_client.upload_fileobj(image_file, bucket_name, file_name)

        # Generate a presigned URL for temporary access
        presigned_url = s3_client.generate_presigned_url('get_object',
                                                        Params={'Bucket': bucket_name, 'Key': file_name},
                                                        ExpiresIn=432000)  # 5 days

        return presigned_url
    except NoCredentialsError:
        print("Credentials not available")
        return None

