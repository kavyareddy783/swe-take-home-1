# services/climate_service.py
from db_config import get_connection
from services.utils import get_valid_qualities, build_quality_filter_clause, paginate_query, parse_date_filter

def get_climate_data(params):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    sql = """
    SELECT c.id, l.id AS location_id, l.name AS location_name, l.latitude, l.longitude,
           c.date, m.name AS metric, c.value, m.unit, c.quality
    FROM climate_data c
    JOIN locations l ON c.location_id = l.id
    JOIN metrics m ON c.metric_id = m.id
    WHERE 1=1
    """

    conditions = []
    values = []

    # Filters
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

    # Pagination params
    page = int(params.get("page", 1))
    per_page = int(params.get("per_page", 50))
    offset, limit = paginate_query(page, per_page)

    sql += " ORDER BY c.date ASC"
    sql += " LIMIT %s OFFSET %s"
    values.extend([limit, offset])

    cursor.execute(sql, tuple(values))
    data = cursor.fetchall()

    # Get total count for meta
    count_sql = "SELECT COUNT(*) FROM climate_data c JOIN locations l ON c.location_id = l.id JOIN metrics m ON c.metric_id = m.id WHERE 1=1"
    if conditions:
        count_sql += " AND " + " AND ".join(conditions)

    cursor.execute(count_sql, tuple(values[:-2]))  # exclude limit, offset
    total_count = cursor.fetchone()["COUNT(*)"]

    cursor.close()
    conn.close()

    meta = {
        "total_count": total_count,
        "page": page,
        "per_page": per_page
    }
    return data, meta
