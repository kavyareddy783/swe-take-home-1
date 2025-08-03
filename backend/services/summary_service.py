# services/summary_service.py
from db_config import get_connection
from services.utils import get_valid_qualities, build_quality_filter_clause, parse_date_filter

def get_climate_summary(params):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    sql = """
    SELECT m.name AS metric,
           MIN(c.value) AS min,
           MAX(c.value) AS max,
           AVG(c.value) AS avg,
           m.unit
    FROM climate_data c
    JOIN metrics m ON c.metric_id = m.id
    JOIN locations l ON c.location_id = l.id
    WHERE 1=1
    """

    conditions = []
    values = []

    if "location_id" in params:
        conditions.append("l.id = %s")
        values.append(params["location_id"])

    start_clause, start_val = parse_date_filter(params, "start_date")
    if start_clause:
        conditions.append(start_clause)
        values.append(start_val)

    end_clause, end_val = parse_date_filter(params, "end_date")
    if end_clause:
        conditions.append(end_clause)
        values.append(end_val)

    if "metric" in params:
        conditions.append("m.name = %s")
        values.append(params["metric"])

    if "quality_threshold" in params:
        valid_qualities = get_valid_qualities(params["quality_threshold"])
        clause, quals = build_quality_filter_clause(valid_qualities)
        conditions.append(clause)
        values.extend(quals)

    if conditions:
        sql += " AND " + " AND ".join(conditions)

    sql += " GROUP BY m.name, m.unit"

    cursor.execute(sql, tuple(values))
    results = cursor.fetchall()

    # Build summary dictionary with quality distribution if metric is temperature
    data = {}
    for row in results:
        metric_name = row['metric']
        data[metric_name] = {
            "min": row['min'],
            "max": row['max'],
            "avg": row['avg'],
            "unit": row['unit'],
        }
        # quality_distribution - do a separate query for temperature or any metric
        if metric_name == "temperature":
            quality_dist = get_quality_distribution(cursor, params, metric_name)
            data[metric_name]["quality_distribution"] = quality_dist

    cursor.close()
    conn.close()

    return data


def get_quality_distribution(cursor, params, metric):
    # Calculate fraction of records per quality level
    sql = """
    SELECT c.quality, COUNT(*) as count
    FROM climate_data c
    JOIN metrics m ON c.metric_id = m.id
    JOIN locations l ON c.location_id = l.id
    WHERE m.name = %s
    """

    values = [metric]
    conditions = []

    if "location_id" in params:
        conditions.append("l.id = %s")
        values.append(params["location_id"])

    start_clause, start_val = parse_date_filter(params, "start_date")
    if start_clause:
        conditions.append(start_clause)
        values.append(start_val)

    end_clause, end_val = parse_date_filter(params, "end_date")
    if end_clause:
        conditions.append(end_clause)
        values.append(end_val)

    if "quality_threshold" in params:
        valid_qualities = get_valid_qualities(params["quality_threshold"])
        clause, quals = build_quality_filter_clause(valid_qualities)
        conditions.append(clause)
        values.extend(quals)

    if conditions:
        sql += " AND " + " AND ".join(conditions)

    sql += " GROUP BY c.quality"

    cursor.execute(sql, tuple(values))
    rows = cursor.fetchall()

    total = sum(row["count"] for row in rows) or 1
    distribution = {row["quality"]: row["count"] / total for row in rows}

    return distribution
