import re

def validate_email(email: str) -> bool:
    emailRE = "^[a-zA-Z0-9+_.-]+@[a-zA-Z][a-zA-Z0-9-]*\.([a-zA-Z0-9][a-zA-Z0-9-]*\.)*[a-zA-Z0-9-]+$"
    errorMessage = []
    valid = True
    if len(email) > 64:
        valid = False
        errorMessage.append("Email exceeds maximum character length (64)")
    
    REmatch = re.fullmatch(emailRE, email)
    if not REmatch:
        valid = False
        errorMessage.append("Email does not follow the correct format: sample.example@example.com")
    
    return valid, errorMessage

def validate_username(username: str) -> bool:
    usernameRE = "^[a-zA-Z0-9_][a-zA-Z0-9_-]+[a-zA-Z0-9_]$"
    errorMessage = []
    valid = True
    if len(username) < 8:
        valid = False
        errorMessage.append("Username is too short (min 8 characters)")
    elif len(username) > 24:
        valid = False
        errorMessage.append("Username exceeds maximum character length(24)")
    
    hasLetterOrNum = False
    for l in username:
        if l.isalnum():
            hasLetterOrNum = True
            break
    
    if not hasLetterOrNum:
        valid = False
        errorMessage.append("Username must contain at least one alphanumeric character")

    REmatch = re.fullmatch(usernameRE, username)
    if not REmatch:
        valid = False
        errorMessage.append("Username does not follow correct format. Usernames must contain only alphanumeric characters, underscores, and hyphens, and cannot begin or end with a hyphen.")
    
    return valid, errorMessage