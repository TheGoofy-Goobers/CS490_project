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
        pass

    def execute(self, query, format = None):
        pass

    def fetchone(self = None):
        return None
    
    def close(self = None):
        if self:
            del self