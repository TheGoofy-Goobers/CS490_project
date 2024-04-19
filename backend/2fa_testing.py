import pyotp
from cryptography.fernet import Fernet

key = Fernet.generate_key()
f = Fernet(key)
secret = "my deep dark secret".encode()
token = f.encrypt(secret)
print(token)

print(f.decrypt(token).decode('utf-8'))