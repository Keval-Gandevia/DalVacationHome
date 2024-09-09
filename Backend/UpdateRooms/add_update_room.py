import json
import boto3
from boto3.dynamodb.conditions import Key
import uuid

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Rooms')

def lambda_handler(event, context):
    try:
        event = json.loads(event['body'])
    except (TypeError, json.JSONDecodeError):
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Invalid JSON in request body'})
        }
        
    try:
        room_id = event.get('room_id', str(uuid.uuid4()))
        agent_id = event['agent_id']
        room_name = event['room_name']
        room_type = event['room_type']
        capacity = event['capacity']
        price = event['price']
        location = event['location']
        amenities = event['amenities']
        description = event['description']

        response = table.get_item(Key={'room_id': room_id})

        if 'Item' in response:
            # Room exists, update it
            table.update_item(
                Key={'room_id': room_id},
                UpdateExpression="""
                    SET agent_id = :agent_id,
                        room_name = :room_name,
                        room_type = :room_type,
                        #c = :c,
                        #p = :p,
                        #l = :l,
                        amenities = :amenities,
                        description = :description
                """,
                ExpressionAttributeNames={
                    '#c': 'capacity',
                    '#p': 'price',
                    '#l': 'location'
                },
                ExpressionAttributeValues={
                    ':agent_id': agent_id,
                    ':room_name': room_name,
                    ':room_type': room_type,
                    ':c': capacity,
                    ':p': price,
                    ':l': location,
                    ':amenities': amenities,
                    ':description': description
                }
            )
            return {
                'statusCode': 200,
                'body': json.dumps('Room details updated successfully')
            }
        else:
            # Room does not exist, create it
            table.put_item(
                Item={
                    'room_id': room_id,
                    'agent_id': agent_id,
                    'room_name': room_name,
                    'room_type': room_type,
                    'capacity': capacity,
                    'price': price,
                    'location': location,
                    'amenities': amenities,
                    'description': description
                }
            )
            return {
                'statusCode': 200,
                'body': json.dumps('Room added successfully')
            }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
