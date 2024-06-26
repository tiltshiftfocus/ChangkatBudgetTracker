import json
import boto3
import datetime
from boto3.dynamodb.conditions import Key

dynamoTableName="UPDATE THIS"
table = boto3.resource("dynamodb").Table(dynamoTableName)

def lambda_handler(event, context):
    
    try:
        userID = event["queryStringParameters"]["userID"]
        
        response = table.get_item(
            Key={
                'userID': userID
                }
            )
        item = response.get('Item')
        
        # Filter items based on date
        body = item
    except Exception as e:
        body = f"An error has occurred: {e}"
        
    return {
    'statusCode': 200,
    'headers': {'Content-Type': 'application/json'},
    'body': json.dumps(body)
    }