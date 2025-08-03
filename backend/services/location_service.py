from db_config import get_connection

def get_all_locations():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM locations")
    results = cursor.fetchall()
    conn.close()
    return results
