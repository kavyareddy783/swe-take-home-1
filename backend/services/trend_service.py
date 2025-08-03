# services/trend_service.py
from db_config import get_connection
from services.utils import get_valid_qualities, build_quality_filter_clause, parse_date_filter
from datetime import datetime, date
import statistics

def get_trends_analysis(params):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    sql = """
    SELECT c.date, c.value, c.quality, m.name AS metric
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

    sql += " ORDER BY c.date ASC"

    cursor.execute(sql, tuple(values))
    records = cursor.fetchall()

    cursor.close()
    conn.close()

    if not records:
        return {}

    # Compute trend (simple linear regression)
    trend = compute_trend(records)
    anomalies = detect_anomalies(records, trend)
    seasonality = detect_seasonality(records)

    return {
        params.get("metric", "metric"): {
            "trend": trend,
            "anomalies": anomalies,
            "seasonality": seasonality
        }
    }

def compute_trend(records):
    # Use simple linear regression on date index vs value to find direction and rate
    # For simplicity, convert dates to ordinal integers
    dates = [
    r["date"].toordinal() if isinstance(r["date"], date)
    else datetime.strptime(r["date"], '%Y-%m-%d').toordinal()
    for r in records
]

    values = [r["value"] for r in records]

    n = len(dates)
    mean_x = sum(dates) / n
    mean_y = sum(values) / n

    numerator = sum((x - mean_x) * (y - mean_y) for x, y in zip(dates, values))
    denominator = sum((x - mean_x) ** 2 for x in dates)

    if denominator == 0:
        slope = 0
    else:
        slope = numerator / denominator

    # direction and rate per month (approx)
    direction = "stable"
    if slope > 0.01:
        direction = "increasing"
    elif slope < -0.01:
        direction = "decreasing"

    rate = slope * 30  # per month approx
    confidence = 0.85  # dummy confidence, could be improved

    return {
        "direction": direction,
        "rate": round(rate, 3),
        "unit": "value/day",
        "confidence": confidence
    }

def detect_anomalies(records, trend):
    # Return list of anomalies where deviation > 2 std dev
    values = [r["value"] for r in records]
    mean = statistics.mean(values)
    stdev = statistics.stdev(values) if len(values) > 1 else 0

    anomalies = []
    for r in records:
        deviation = abs(r["value"] - mean)
        if stdev and deviation > 2 * stdev:
            anomalies.append({
                "date": r["date"],
                "value": r["value"],
                "deviation": round(deviation, 2),
                "quality": r["quality"]
            })
    return anomalies

def detect_seasonality(records):
    # Check if seasonality detected (dummy detection based on month variance)
    # Group by season (Winter, Spring, Summer, Fall)
    seasons = {
        "winter": [],
        "spring": [],
        "summer": [],
        "fall": []
    }

    for r in records:
        if isinstance(r["date"], date):
            month = r["date"].month
        else:
            month = datetime.strptime(r["date"], '%Y-%m-%d').month
        if month in [12, 1, 2]:
            seasons["winter"].append(r["value"])
        elif month in [3, 4, 5]:
            seasons["spring"].append(r["value"])
        elif month in [6, 7, 8]:
            seasons["summer"].append(r["value"])
        else:
            seasons["fall"].append(r["value"])

    season_avgs = {}
    for season, vals in seasons.items():
        avg = round(sum(vals) / len(vals), 2) if vals else None
        # Dummy trend stable for all
        season_avgs[season] = {"avg": avg, "trend": "stable"}

    detected = any(vals for vals in seasons.values())
    return {
        "detected": detected,
        "period": "yearly",
        "confidence": 0.9,
        "pattern": season_avgs
    }
