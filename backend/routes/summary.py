from flask import Blueprint, request, jsonify
from services.summary_service import get_climate_summary

summary_bp = Blueprint('summary', __name__)

@summary_bp.route('/summary', methods=['GET'])
def summary():
    params = request.args.to_dict()
    summary_data = get_climate_summary(params)
    return jsonify({"data": summary_data})
