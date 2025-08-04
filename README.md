# Take Home Assessment - Software Engineering Position

This project is designed to test your full-stack skills in Python, JavaScript, and SQL by building an interactive climate data explorer.

# 🌱 EcoVision – Climate Visualizer

A full-stack web application that allows users to explore and visualize climate metrics like temperature, humidity, and precipitation using interactive charts.

# Project Demo
-  https://drive.google.com/file/d/1pLJdABV6yM08PA7TlzZaL57U-9CzqSAK/view?usp=sharing

## Tech Stack

- Backend: Flask (Python), MySQL
- Frontend: React, Vite, TailwindCSS
- Charting: Chart.js (via react-chartjs-2)

## 📁 Project Structure

```bash
swe-take-home-1/
├── backend/               # Flask app with routes/services
├── frontend/              # React dashboard
├── data/sample_data.json  # sample data 
├── docs/                  # sample docs
└── README.md 
```

- Refer backend/README_Backend.me (In detail backend architecure such as route,services, schemas)
- Refer frontend/README_Frontend.me (In detail frontend services such as api and component rendering for filtering)

##  Documentation Index

### Backend Setup and Instructions

Refer to backend/README_Backend.md for in-depth details including:

- API architecture and route structure
- Service layer design and logic
- SQL schema and indexing strategy
- Data ingestion and quality mapping
- Endpoint behaviors: /climate, /trends, /summary, etc.

```sh
# Step into backend folder
cd backend

# Create virtual environment
python -m venv venv

# Activate the environment
source venv/bin/activate  #MacOs 
venv\Scripts\activate     #Windows OS

# Install required Python packages
pip install -r requirements.txt
```
## MySQL Setup
```sh
## 1. Download MySQL Installer
- Go to: [MySQL Installer Downloads](https://dev.mysql.com/downloads/installer/)  
- Select: Windows (x86, 32-bit), MSI Installer
- Version: 8.0.43
- File size: 354.3 MB
```
```sh
## 2. Install and Configure MySQL Server
1. Run the downloaded installer.  
2. Follow the setup wizard to install MySQL Server and MySQL Workbench.  
3. Set your root password during installation (remember it for later).
```

```sh
## 3. Create Schema in MySQL Workbench
1. Open MySQL Workbench 8.0 CE.  
2. Connect to your MySQL server using the root credentials.  
3. Create a new schema:
    sql
    CREATE DATABASE climate_data;
```
    
```sh
## 4. Configure Database Password in Your Project (choose one option)
- Option 1 (Not recommended): 
  Set the password directly in `db_config.py`.

- Option 2 (Recommended):  
  Store the password in a `.env` file and ensure your code reads it from there.
```

```sh
# Load sample data
python seed_data.py

# Start the Flask server
python app.py
```



### 🖥 Frontend Setup and Instructions

Refer to ../frontend/README_Frontend.md to understand:

- Component structure (Filters, ChartContainer, etc.)
- api.js abstraction for backend communication
- Filter state management
- Chart rendering logic based on analysis type
- Error/loading handling and UI responsiveness

```sh
# Step into frontend folder
cd frontend

# Install Node dependencies
npm install

# Start the development server
npm run dev

```

* We can access the application locally at http://localhost:3000 once the frontend development  server is running.

### Challenges Faced
- Summary API shape: The /summary response isn’t an array, so trying .map() broke charts. Fixed it with conditional checks.
- Trends response mismatch: Trend data came nested under the metric key — had to restructure it for the UI to read properly.


### Future Improvements
- Auth & user features: Add login, saved filters, and activity logs.
- Better UX for errors: Show clearer messages for missing data or filters.
- Test Coverage: Backend tests with pytest, Frontend tests with Jest & React Testing Library
- Logging: Add centralized logs for debugging and tracing issues.
- Deployment: Dockerize and host via Render or Railway or Vercel.

