## Backend Architecture

The Flask backend is built in a modular, production-ready structure with clear separation of concerns.

### Structure

- `app/routes/` – Each REST endpoint (climate, trends, summary, etc.) is defined in its own file.
- `app/services/` – Business logic and data processing (e.g., trend detection, data weighting).
- `seed_data.py` – Loads structured data from `data/sample.json` into the database.
- `db_config.py` – Switchable DB configurations with `.env`.
- `schema/mysql_schema.sql` – Defines the `locations`, `metrics`, and `climate_data` tables.

###  API Endpoints

| Route                | Description                   |
|----------------------|-------------------------------|
| `/api/v1/climate`    | Raw climate data w/ filters   |
| `/api/v1/trends`     | Trend and anomaly detection   |
| `/api/v1/summary`    | Summary stats + quality dist. |
| `/api/v1/metrics`    | Available metric types        |
| `/api/v1/locations`  | Location list                 |

See [docs/api.md](../docs/api.md) for request/response shapes.

###  Database

The backend uses **MySQL** for storing structured, relational data.  
All schema definitions can be found at:

📄 `backend/schema/mysql_schema.sql`

### 🔃 Data Ingestion

To load data:

```bash
python seed_data.py
