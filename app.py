# Import the dependencies.
from flask import Flask, jsonify
from pymongo import MongoClient
from flask_cors import CORS

#################################################
# Database Setup
#################################################

# Create an instance of MongoClient
mongo = MongoClient(port=27017)

# Connect to the database
us_states_db = mongo.us_states_db

# Connect to the collections
states = us_states_db['states']
counties = us_states_db['counties']
series_ids = us_states_db['series_ids']

################################################
# Flask Setup
#################################################
app = Flask(__name__)
CORS(app)


#################################################
# Flask Routes
#################################################


# Route for our home page
@app.route("/")
def home_route():
    """List of all available api routes:"""
    return (
        f"Welcome to the landing page of our Hidden Truth Behind Covid data website!<br/>" 
        f"<br/>" 
        f"Here are the Available Routes:<br/>"
        f"<br/>"
        f"/api/v1.0/states<br/>"
        f"<br/>"
        f"/api/v1.0/counties<br/>"
        f"<br/>"
        f"/api/v1.0/series_ids<br/>"
    )

# Route for our state data
@app.route("/api/v1.0/states")
def state_route():
    data = []
    records = states.find()
    for record in records:
        record['_id'] = str(record['_id'])
        data.append(record)
    dic = {
    "features": data,
    "type": "FeatureCollection"}
    return dic

# Route for our county data
@app.route("/api/v1.0/counties")
def counties_route():
    data = []
    records = counties.find()
    for record in records:
        record['_id'] = str(record['_id'])
        data.append(record)
    dic = {
    "features": data,
    "type": "FeatureCollection"}
    return dic

# Route for our state ids data
@app.route("/api/v1.0/series_ids")
def series_route():
    data = []
    records = series_ids.find()
    for record in records:
        record['_id'] = str(record['_id'])
        data.append(record)
    dic = {
    "features": data}
    return dic

# Runs the app
if __name__ == "__main__":
    app.run(debug=True)
