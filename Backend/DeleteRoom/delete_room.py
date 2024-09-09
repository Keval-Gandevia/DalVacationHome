import json
import boto3
from boto3.dynamodb.conditions import Key

# Initialize the DynamoDB resource
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Rooms') 

def lambda_handler(event, context):
    try:
        body = json.loads(event['body'])
    except (TypeError, json.JSONDecodeError):
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Invalid JSON in request body'})
        }

    # Extract elements from the parsed JSON
    room_id = body.get('room_id')


    if not room_id:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'room_id is required'})
        }

    try:
        response = table.delete_item(
            Key={
                'room_id': room_id
            }
        )

        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'Room deleted successfully'})
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
