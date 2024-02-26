import mysql.connector

# mysql connection parameters
mysql_config = {
    'host': 'localhost',
    'user': 'root',
    'password': '',
    'database': 'codecraft'
}

# connect to server
# TODO: make this work with azure
connection = mysql.connector.connect(**mysql_config)

# create users table
cursor = connection.cursor()
create_table_query = """
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(24) NOT NULL UNIQUE,
    email VARCHAR(64) NOT NULL UNIQUE,
    password VARCHAR(32) NOT NULL
)
"""
cursor.execute(create_table_query)

# commit changes
connection.commit()
cursor.close()
connection.close()
