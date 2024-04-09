class MockFlaskMysqlConnection:

    def __init__(self):
        pass

    def cursor(self = None):
        return MockFlaskMysqlCursor()

    def commit(self = None):
        pass

    def rollback(self = None):
        pass

class MockFlaskMysqlCursor:

    def __init__(self):
        # Initially set fetchall_data to None to indicate no data
        self.fetchall_data = None

    def execute(self, query, format=None):
        # You can simulate behavior based on query if needed
        return None

    def fetchone(self):
        # Return a single record if fetchall_data is set
        if self.fetchall_data:
            return self.fetchall_data[0]
        return None

    def fetchall(self):
        # If fetchall_data is set, return it; otherwise return empty list
        return self.fetchall_data if self.fetchall_data is not None else []

    def close(self):
        pass

    # Use this in your tests to set up specific data to return for fetchall
    def set_fetchall_data(self, data):
        self.fetchall_data = data

    
