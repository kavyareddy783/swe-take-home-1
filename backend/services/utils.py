# services/utils.py

QUALITY_WEIGHTS = {
    "excellent": 1.0,
    "good": 0.8,
    "questionable": 0.5,
    "poor": 0.3
}

def get_valid_qualities(threshold):
    """
    Given a quality threshold (string), return list of qualities
    that have weight >= threshold weight.
    """
    threshold = threshold.lower()
    threshold_weight = QUALITY_WEIGHTS.get(threshold, 0)
    return [q for q, w in QUALITY_WEIGHTS.items() if w >= threshold_weight]

def build_quality_filter_clause(quality_list, column_name="c.quality"):
    """
    Builds an SQL condition for filtering quality column IN quality_list.
    Returns SQL snippet and tuple of values for placeholders.
    """
    placeholders = ','.join(['%s'] * len(quality_list))
    clause = f"{column_name} IN ({placeholders})"
    return clause, tuple(quality_list)

def paginate_query(page, per_page):
    """
    Calculates offset and limit for pagination.
    """
    page = max(1, int(page))
    per_page = max(1, int(per_page))
    offset = (page - 1) * per_page
    return offset, per_page

def parse_date_filter(params, key):
    """
    Returns SQL condition and value for date filters if present.
    """
    from datetime import datetime

    if key in params:
        try:
            datetime.strptime(params[key], '%Y-%m-%d')
            return f"c.date {'>=' if 'start' in key else '<='} %s", params[key]
        except ValueError:
            pass
    return None, None
