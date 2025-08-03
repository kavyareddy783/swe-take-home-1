from flask import Blueprint, request, jsonify
from services.trend_service import get_trends_analysis

trends_bp = Blueprint('trends', __name__)

@trends_bp.route('/trends', methods=['GET'])
def trends():
    params = request.args.to_dict()
    trends_data = get_trends_analysis(params)
    return jsonify(trends_data)
