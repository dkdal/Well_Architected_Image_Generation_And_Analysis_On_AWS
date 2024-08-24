import json
import urllib3
import boto3
import time

def lambda_handler(event, context):
    try:
        prompt = event['prompt']
        api_key = 'lmwr_sk_yIC1q0Bk0O_57n8sy7UcZhmWKnoCWFyoqsSOrBM5LM1J3iJx'
        base_url = 'https://api.limewire.com/api'
        request_url = f'{base_url}/image/generation'
        check_status_url = f'{base_url}/request'
        
        http = urllib3.PoolManager()
        
        # Submit image generation request
        headers = {
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json',
            'X-Api-Version': 'v1',
        }
        
        data = {
            'prompt': prompt,
            'aspect_ratio': '1:1',
        }
        
        encoded_data = json.dumps(data).encode('utf-8')
        response = http.request('POST', request_url, body=encoded_data, headers=headers)
        
        if response.status != 200:
            return {
                'statusCode': response.status,
                'body': json.dumps({'error': 'Failed to get a valid response from Lime Wire API', 'response': response.data.decode('utf-8')}),
            }
        
        response_data = response.data.decode('utf-8')
        response_json = json.loads(response_data)
        
        # Check the status of the request
        request_id = response_json.get('id')
        if not request_id:
            return {
                'statusCode': 500,
                'body': json.dumps({'error': 'No request ID found in response', 'response': response_json}),
            }
        
        status_url = f'{check_status_url}/{request_id}'
        
        # Poll the status until it's completed
        start_time = time.time()
        max_wait_time = 30  # Maximum wait time in seconds (e.g., 5 minutes)
        
        while time.time() - start_time < max_wait_time:
            status_response = http.request('GET', status_url, headers=headers)
            status_data = status_response.data.decode('utf-8')
            status_json = json.loads(status_data)
            
            if status_json['status'] == 'COMPLETED':
                image_url = status_json['data'][0]['asset_url']
                
                # Download the image
                image_response = http.request('GET', image_url)
                if image_response.status != 200:
                    return {
                        'statusCode': image_response.status,
                        'body': json.dumps({'error': 'Failed to download image', 'response': image_response.data.decode('utf-8')}),
                    }
                
                image_data = image_response.data
                
                # Upload image to S3
                s3 = boto3.client('s3')
                bucket_name = 'ca-store-images'
                timestamp = int(time.time())
                sanitized_prompt = ''.join(e for e in prompt if e.isalnum())
                object_name = f'generated-images/{sanitized_prompt}_{timestamp}.png'
                
                s3.put_object(Bucket=bucket_name, Key=object_name, Body=image_data, ContentType='image/png')
                
                s3_url = f'https://{bucket_name}.s3.amazonaws.com/{object_name}'
                
                return {
                    'statusCode': 200,
                    'body': json.dumps({'image_url': s3_url}),
                }
            
            elif status_json['status'] == 'FAILED':
                return {
                    'statusCode': 500,
                    'body': json.dumps({'error': 'Image generation failed', 'response': status_json}),
                }
            
            time.sleep(10)  # Wait for 10 seconds before polling again
        
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Timed out waiting for image generation'}),
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)}),
        }
