from flask_mysqldb import MySQL

def get_user_id(mysql: MySQL, uuid: str) -> int:
    cur = mysql.connection.cur()
    cur.execute("SELECT user_id from logged_in WHERE session_token = %s", (uuid,))

    user = cur.fetchone()
    
    if user:
        return user['user_id']
    else:
        return -1