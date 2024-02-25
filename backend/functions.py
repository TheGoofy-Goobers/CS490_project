from requests.structures import CaseInsensitiveDict
import requests

def is_valid(email: str):
    url = f"https://api.emailvalidation.io/v1/info?email={email}"

    headers = CaseInsensitiveDict()
    headers["apikey"] = "your-api-key-here"

    response = requests.get(url, headers=headers)

    return response.json()

    
print(is_valid("support@emailvalidation.io"))
print(is_valid("venip42579@jdsdhak.com"))