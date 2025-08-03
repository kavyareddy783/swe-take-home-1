from db_config import get_connection

def get_all_metrics():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT id, name, display_name, unit, description FROM metrics")
    results = cursor.fetchall()
    cursor.close()
    conn.close()
    return results
