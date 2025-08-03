from flask import Blueprint, jsonify
from services.metric_service import get_all_metrics

metrics_bp = Blueprint('metrics', __name__)

@metrics_bp.route('/metrics', methods=['GET'])
def metrics():
    metrics = get_all_metrics()
    return jsonify({"data": metrics})
