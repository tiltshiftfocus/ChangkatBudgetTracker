import json
import boto3
import datetime
dynamoTableName="UPDATE THIS"
table = boto3.resource("dynamodb").Table(dynamoTableName)

def post_to_dynamo(data):
    """
    This function takes a dictionary and sends the data across to dynamoDB
    Technically, we can validate if the header and userID are the same to prevent hijack inputs
    
    Args:
      data: Dictionary that can contain userID (Mandatory), to change amount
      They should all be in string
    
    Returns:
      A success or error code if the dynamoDB Update passed/failed
    """
    
    try:
        update_key = {"userID":data["userID"]}
    except ValueError as e:
        return ("userID is a required key value pair")
    
    #Filter to only keep category, amount, or date
    filtered_data = {}
    for d in data:
        if d in ["amount"]:
            filtered_data.update({d:data[d]})
    
    print(f"Filtered Data is {filtered_data}")
    
    if len(filtered_data) == 0:
        return "Warning: we can only update amount"
    
    #Remove Transaction instead of update
    if "amount" in filtered_data.keys() and int(filtered_data["amount"]) == 0:
        try:
            print(f"Performing Delete Action")
            response = table.delete_item(
                Key=update_key
            )
        except ValueError as e:
            return (f"Failure delete {update_key} with error:{e}")
        
    else:    
        
        try:
            response = table.put_item(
                Item = {"userID": data['userID'], 
                        "amount": data['amount']
                       }
            )
            
        except Exception as e:
            return (f"Failure to update/add limit with error:{e}")
            
    
    return response

def lambda_handler(event, context):
    
    try:
        data = event.get('body')
        try:
            body = json.loads(data)
            body = post_to_dynamo(body)
        except ValueError as e:
            raise ValueError(f"Unable to parse post request body with error:{e}")
    except Exception as e: 
        body = f"An error has occurred: {e}"
    
    return {
    'statusCode': 200,
    'headers': {'Content-Type': 'application/json'},
    'body': json.dumps(body)
    }
    
    
    