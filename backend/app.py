from flask import Flask
from routes.climate import climate_bp
from routes.locations import locations_bp
from routes.metrics import metrics_bp
from routes.summary import summary_bp
from routes.trends import trends_bp

app = Flask(__name__)

# Register Blueprints
app.register_blueprint(climate_bp, url_prefix="/api/v1")
app.register_blueprint(locations_bp, url_prefix="/api/v1")
app.register_blueprint(metrics_bp, url_prefix="/api/v1")
app.register_blueprint(summary_bp, url_prefix="/api/v1")
app.register_blueprint(trends_bp, url_prefix="/api/v1")

if __name__ == '__main__':
    app.run(debug=True)
