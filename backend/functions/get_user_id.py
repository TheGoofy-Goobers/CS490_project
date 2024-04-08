from flask_mysqldb import MySQL

def get_user_id(mysql: MySQL, token: str) -> int:
    error = ""
    try:
        cur = mysql.connection.cursor()
        cur.execute("SELECT user_id from logged_in WHERE session_token = %s", (token,))
    except Exception as e:
        cur.close
        error = str(e)

    user = cur.fetchone()
    
    cur.close()
    if user:
        return user['user_id'], error
    else:
        return -1, error