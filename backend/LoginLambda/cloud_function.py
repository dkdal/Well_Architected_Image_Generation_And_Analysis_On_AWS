import json
import boto3

def lambda_handler(event, context):
    client = boto3.client('cognito-idp')
    user_pool_id = 'us-east-1_xnw6H0JvZ'
    client_id = '4ahn5g3q1ug5nthd2rvtlrldsi'
    
    username = event['username']
    password = event['password']
    
    try:
        response = client.initiate_auth(
            ClientId=client_id,
            AuthFlow='USER_PASSWORD_AUTH',
            AuthParameters={
                'USERNAME': username,
                'PASSWORD': password,
            }
        )
        return {
            'statusCode': 200,
            'body': json.dumps({
                'id_token': response['AuthenticationResult']['IdToken'],
                'access_token': response['AuthenticationResult']['AccessToken'],
                'refresh_token': response['AuthenticationResult']['RefreshToken']
            })
        }
    except client.exceptions.NotAuthorizedException:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Incorrect username or password'})
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
