import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv()

# mysql connection parameters
mysql_config = {
    'host': os.getenv('DB_URL'),
    'user': os.getenv('MYSQL_USER'),
    'password': os.getenv('MYSQL_PASSWORD'),
}

# connect to server
connection = mysql.connector.connect(**mysql_config)

# create database if it doesn't exist
create_database_query = "CREATE DATABASE IF NOT EXISTS codecraft"
cursor = connection.cursor()
cursor.execute(create_database_query)

# switch to the 'codecraft' database
mysql_config['database'] = 'codecraft'
connection.close()
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

# close cursor and connection
cursor.close()
connection.close()
