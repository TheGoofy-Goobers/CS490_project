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

# create and switch to the database
create_database_query = "CREATE DATABASE IF NOT EXISTS codecraft"
cursor = connection.cursor()
cursor.execute(create_database_query)

mysql_config['database'] = 'codecraft'
connection.close()
connection = mysql.connector.connect(**mysql_config)

# create users table
cursor = connection.cursor()
create_user_table_query = """
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(24) NOT NULL UNIQUE,
    email VARCHAR(64) NOT NULL UNIQUE,
    password VARCHAR(64) NOT NULL
)
"""
cursor.execute(create_user_table_query)

# create feedback form table
create_feedback_table_query = """
CREATE TABLE IF NOT EXISTS user_feedback (
    feedback_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    precision_rating INT CHECK (precision_rating BETWEEN 1 AND 5),
    ease_rating INT CHECK (ease_rating BETWEEN 1 AND 5),
    speed_rating INT CHECK (speed_rating BETWEEN 1 AND 5),
    future_use_rating INT CHECK (future_use_rating BETWEEN 1 AND 5),
    note VARCHAR(300),
    submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT user_exists FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
)
"""
cursor.execute(create_feedback_table_query)

# create translation table
create_translation_table_query = """
CREATE TABLE IF NOT EXISTS translation_history (
    user_id INT NOT NULL,
    source_language VARCHAR(10),
    original_code VARCHAR(2000),
    target_language VARCHAR(10),
    translated_code VARCHAR(2000),
    status VARCHAR2(100),
    submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT user_exists FOREIN KEY (user_id) REFERENCES users(uder_id) ON DELETE CASCADE
)
"""
cursor.execute(create_translation_table_query)

# save changes and close
connection.commit()
cursor.close()
connection.close()
