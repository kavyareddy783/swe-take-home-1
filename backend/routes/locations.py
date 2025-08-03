from flask import Blueprint, jsonify
from services.location_service import get_all_locations

locations_bp = Blueprint("locations", __name__)

@locations_bp.route('/locations', methods=['GET'])
def fetch_locations():
    locations = get_all_locations()
    return jsonify({"data":locations })
