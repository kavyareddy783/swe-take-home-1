# Take Home Assessment - Software Engineering Position

This project is designed to test your full-stack skills in Python, JavaScript, and SQL by building an interactive climate data explorer.

# 🌱 EcoVision – Climate Visualizer

A full-stack web application that allows users to explore and visualize climate metrics like temperature, humidity, and precipitation using interactive charts.

## 🚀 Tech Stack

- Backend: Flask (Python), MySQL
- Frontend: React, Vite, TailwindCSS
- Charting: Chart.js (via react-chartjs-2)

## 📁 Project Structure

bash
swe-take-home-1/
├── backend/               # Flask app with routes/services
├── frontend/              # React dashboard
├── data/sample_data.json  # sample data 
├── docs/                  # sample docs
└── README.md 


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

sh
# Step into backend folder
cd backend

# Create virtual environment
python -m venv venv

# Activate the environment
source venv/bin/activate  # On Windows use: venv\Scripts\activate

# Install required Python packages
pip install -r requirements.txt

# Set up the MySQL database
mysql -u root -p < schema.sql  # Enter your MySQL password when prompted

# (Optional) Load sample data
python seed_data.py

# Start the Flask server
python app.py



### 🖥 Frontend Setup and Instructions

Refer to ../frontend/README_Frontend.md to understand:

- Component structure (Filters, ChartContainer, etc.)
- api.js abstraction for backend communication
- Filter state management
- Chart rendering logic based on analysis type
- Error/loading handling and UI responsiveness

sh
# Step into frontend folder
cd frontend

# Install Node dependencies
npm install

# Start the development server
npm run dev


* We can access the application locally at http://localhost:3000 once the frontend development  server is running.