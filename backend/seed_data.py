import json,os 
from db_config import get_connection


# Get absolute path to sample.json relative to this script
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_FILE = os.path.join(BASE_DIR, 'data', 'sample_data.json')

def seed_data():
    with open(DATA_FILE, 'r') as f:
        data = json.load(f)

    conn = get_connection()
    cursor = conn.cursor()

    # Clear existing data (order matters because of foreign keys)
    cursor.execute("DELETE FROM climate_data")
    cursor.execute("DELETE FROM metrics")
    cursor.execute("DELETE FROM locations")

    # Insert locations
    for loc in data['locations']:
        cursor.execute("""
            INSERT INTO locations (id, name, country, latitude, longitude, region)
            VALUES (%s, %s, %s, %s, %s, %s)
            ON DUPLICATE KEY UPDATE name=VALUES(name)
        """, (loc['id'], loc['name'], loc['country'], loc['latitude'], loc['longitude'], loc.get('region', None)))

    # Insert metrics
    for metric in data['metrics']:
        cursor.execute("""
            INSERT INTO metrics (id, name, display_name, unit, description)
            VALUES (%s, %s, %s, %s, %s)
            ON DUPLICATE KEY UPDATE display_name=VALUES(display_name)
        """, (metric['id'], metric['name'], metric['display_name'], metric['unit'], metric['description']))

    # Insert climate_data
    for cdata in data['climate_data']:
        cursor.execute("""
            INSERT INTO climate_data (id, location_id, metric_id, date, value, quality)
            VALUES (%s, %s, %s, %s, %s, %s)
            ON DUPLICATE KEY UPDATE value=VALUES(value)
        """, (cdata['id'], cdata['location_id'], cdata['metric_id'], cdata['date'], cdata['value'], cdata['quality']))

    conn.commit()
    cursor.close()
    conn.close()
    print("Seed data inserted successfully.")

if __name__ == '__main__':
    seed_data()
