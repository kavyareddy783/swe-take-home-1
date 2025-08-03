from flask import Blueprint, request, jsonify
from services.climate_service import get_climate_data

climate_bp = Blueprint('climate', __name__)

@climate_bp.route('/climate', methods=['GET'])
def climate():
    params = request.args.to_dict()
    data, meta = get_climate_data(params)
    return jsonify({"data": data, "meta": meta})
