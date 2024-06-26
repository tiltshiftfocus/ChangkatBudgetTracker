import json
import boto3
import datetime
dynamoTableName="UPDATE THIS"
table = boto3.resource("dynamodb").Table(dynamoTableName)

def update_to_dynamo(data):
    """
    This function takes a dictionary and sends the data across to dynamoDB
    
    Args:
      data: Dictionary that can contain expenseID (Mandatory), date (mandatory) to change category or amount
      They should all be in string
    
    Returns:
      A success or error code if the dynamoDB Update passed/failed
    """
    
    try:
        update_key = {"expenseID":data["expenseID"], "date":data["date"]}
    except ValueError as e:
        return ("expenseID and date is a required key value pair")
        
    ##Do a get item to check if expenseID+date combo exists, if not, stop the update    
    update_expression = "SET "
    expression_values = {}
    counter = 0
    
    #Filter to only keep category, amount, or date
    filtered_data = {}
    for d in data:
        if d in ["category","amount"]:
            filtered_data.update({d:data[d]})
    
    print(f"Filtered Data is {filtered_data}")
    
    if len(filtered_data) == 0:
        return "Warning: we can only update category, or amount"
    
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
        #Create Dynamic Update Expression
        for k, v in filtered_data.items():
            if counter >0:
                update_expression += ", "
            update_expression += f"{k} =:val{counter}"
            expression_values[f":val{counter}"] = v
            counter += 1
        
        try:
            print(f"Performaing Update Action with {[update_key,update_expression,expression_values]}")
            response = table.update_item(
                Key=update_key,
                UpdateExpression=update_expression,
                ExpressionAttributeValues=expression_values
            )
        
        except Exception as e:
            return (f"Failure to update {[update_key,update_expression,expression_values]} with error:{e}")
            
    
    return response

def lambda_handler(event, context):
    
    try:
        data = event.get('body')
        try:
            body = json.loads(data)
            body = update_to_dynamo(body)
        except ValueError as e:
            raise ValueError(f"Unable to parse post request body with error:{e}")
    except Exception as e: 
        body = f"An error has occurred: {e}"
    
    return {
    'statusCode': 200,
    'headers': {'Content-Type': 'application/json'},
    'body': json.dumps(body)
    }
    
    
    