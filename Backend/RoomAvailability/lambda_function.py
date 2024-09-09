import json
import boto3

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Rooms')

def lambda_handler(event, context):
    try:
        response = table.scan()
        if 'Items' in response:
            return buildResponse(200, response['Items'])
        else:
            return buildResponse(404, {'message': 'Room not found'})
    except Exception as e:
        print(e)
        return buildResponse(500, {'message': 'Error fetching room availability'})

def buildResponse(statusCode, body=None):
    response = {
        'statusCode': statusCode,
        'headers': {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PATCH"
        }
    }
    if body is not None:
        response['body'] = json.dumps(body)
    return response
