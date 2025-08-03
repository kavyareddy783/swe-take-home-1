USE climate_data;

CREATE TABLE locations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100),
  country VARCHAR(100),
  latitude DECIMAL(9,6),
  longitude DECIMAL(9,6),
  region VARCHAR(100),
  INDEX (region)
);

CREATE TABLE metrics (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) UNIQUE,
  display_name VARCHAR(100),
  unit VARCHAR(20),
  description TEXT
);

CREATE TABLE climate_data (
  id INT PRIMARY KEY AUTO_INCREMENT,
  location_id INT NOT NULL,
  metric_id INT NOT NULL,
  date DATE NOT NULL,
  value FLOAT NOT NULL,
  quality ENUM('poor','questionable','good','excellent') NOT NULL,
  FOREIGN KEY (location_id) REFERENCES locations(id),
  FOREIGN KEY (metric_id) REFERENCES metrics(id),
  INDEX idx_loc_date_metric (location_id, metric_id, date)
);
