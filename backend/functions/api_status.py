import requests

#TODO: Unit testing for this if we have time
def get_status(api_key):
    headers = {
        'Authorization': f'Bearer {api_key}',
    }

    endpoint = 'https://api.openai.com/v1/engines/gpt-3.5-turbo-0125'
    response = None
    try:
        status = requests.get(endpoint, headers=headers)
    
        response = {"code": status.status_code, "reason": status.reason}
    except Exception as e:
        response = {"code": 500, "reason": str(e)}
    
    return response