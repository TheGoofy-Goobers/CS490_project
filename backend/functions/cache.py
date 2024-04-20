import datetime
from typing import List

EXPIRY_HOURS = 24

class User:
    def __init__(self, token, id, login_time=datetime.datetime.now()):
        login_time = login_time.replace(microsecond=0)
        self.token = token
        self.id = id
        self.expiry = login_time + datetime.timedelta(hours=EXPIRY_HOURS)
    
    def __str__(self):
        return "{" + f"Session Token: {self.token}, User ID: {self.id}, Expiry date: {self.expiry}" + "}"
    
    def __repr__(self):
        return self.__str__()
    
class Translations:
    def __init__(self, history: List[dict]):
        self.history = history
        self.updated = True

    def __str__(self):
        return "{" + f"Up-To-Date: {self.updated}, Translations: {self.history}" + "}" 
    
    def __repr__(self):
        return self.__str__()

translation_cache = {}
id_cache = {}