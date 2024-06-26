import json
import boto3
import datetime
dynamoTableName="UPDATE THIS"
table = boto3.resource("dynamodb").Table(dynamoTableName)

def convert_date_to_datetime(date_string):
    """
    This function takes a date string as input and converts it into a datetime object.
    
    Args:
      date_string: The date string to be converted.
    
    Returns:
      A datetime object representing the date string.
    """
    try:
        date_time = datetime.datetime.strptime(date_string, "%Y-%m-%d")
        return date_time
    except ValueError:
        raise ValueError("Invalid Date Format Please use YYYY-MM-DD")

def post_to_dynamo(data):
    """
    This function takes a dictionary and sends the data across to dynamoDB
    
    Args:
      data: Object that must contain transactionID, date, userID, category, and amount
      They should all be in string
    
    Returns:
      A success or error code if the dynamoDB Update passed/failed
    """
    
    #Validation Check on Date
    convert_date_to_datetime(data["date"])
    if type(data['userID']) != str:
        data['userID'] = str(data['userID'])
    response = table.put_item(
                Item = {"expenseID": data['expenseID'], 
                        "date": data['date'],
                        "userID": data['userID'],
                        "category":data['category'],
                        "amount":data['amount']
                       }
            )
    return response

def lambda_handler(event, context):
    
    try:
        data = event.get('body')
        try:
            body = json.loads(data)
            #Validate that all keys are available
            missing_keys = set(["expenseID","date","userID","category","amount"]) - set(body.keys())
            if len(missing_keys) > 0:
                raise  ValueError(f"You are missing keys: {missing_keys}, please retry")
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
    
    
    