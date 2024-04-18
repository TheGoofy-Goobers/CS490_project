from flask_mysqldb import MySQL
import datetime

EXPIRY_HOURS = 24
class User:
    def __init__(self, token, id, login_time):
        self.token = token
        self.id = id
        self.expiry = login_time + datetime.timedelta(hours=24)

id_cache = {}

def get_user_id(mysql: MySQL, token: str) -> int:
    error = ""

    if token in id_cache:
        user = id_cache[token]
        if datetime.datetime.now() < user.expiry:
            return user.id, error
        else:
            id_cache.pop(token)

    try:
        cur = mysql.connection.cursor()
        cur.execute("SELECT user_id, login_date from logged_in WHERE session_token = %s", (token,))
    except Exception as e:
        cur.close
        error = str(e)

    user = cur.fetchone()
    
    cur.close()
    if user:
        id_cache[token] = User(token, user["user_id"], user["login_date"])
        return user['user_id'], error
    else:
        return -1, error