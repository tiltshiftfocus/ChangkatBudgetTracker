import json
import boto3
import datetime
from boto3.dynamodb.conditions import Key
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
    
def floor_to_start_of_year(date_time):
    """
    This function takes a datetime object as input and rounds it to the start of the year.
    
    Args:
      date_time: The datetime object to be rounded.
    
    Returns:
      A datetime object rounded to the start of the year.
    """
    date_time = date_time.replace(day=1)
    date_time = date_time.replace(month=1)
    return date_time

def floor_to_start_of_month(date_time):
    """
    This function takes a datetime object as input and rounds it to the start of the month.
    
    Args:
      date_time: The datetime object to be rounded.
    
    Returns:
      A datetime object rounded to the start of the month.
    """
    date_time = date_time.replace(day=1)
    return date_time

def convert_and_round_date(date_string, sort_type):
    """
    This function takes a date string as input, converts it to a datetime object, 
    and rounds it to the start of month or year depending on the sort_type.
    
    Args:
      date_string: The date string to be converted and rounded.
      sort_type: month/year - Month will round date to start of month
    
    Returns:
      A datetime object representing the nearest month.
    """
    date_time = convert_date_to_datetime(date_string) 
    if sort_type == "month":
        rounded_date = floor_to_start_of_month(date_time)
    elif sort_type == "year":
        rounded_date = floor_to_start_of_year(date_time)
    else:
        rounded_date = date_time
    return rounded_date

def lambda_handler(event, context):
    
    try:
        # Pull Sort Date from query string <api link>?date=YYYY-MM-DD&userID=test_user_1&sort_type=month/year/day
        try:
            sort_type = event["queryStringParameters"]["sort_type"]
        except:
            sort_type = "month" # ensure that sort type remains as optional
        try:
            userID = event["queryStringParameters"]["userID"]
        except KeyError:
            raise KeyError("userID is a Mandatory Input")
        sort_date = event["queryStringParameters"]["date"]
        sort_date = convert_and_round_date(sort_date, sort_type)
        
        # Perform the query using Scan operation  
        response = table.scan()
        
        # Access the queried items
        items = response.get('Items', [])
        
        # Filter items based on date
        body = [item for item in items if convert_and_round_date(item['date'], sort_type) == sort_date]
        # Filter items based on userID
        body = [item for item in body if item['userID'] == str(userID)]
    except Exception as e:
        body = f"An error has occurred: {e}"
        
    return {
    'statusCode': 200,
    'headers': {'Content-Type': 'application/json'},
    'body': json.dumps(body)
    }