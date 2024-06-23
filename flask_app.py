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

# Allows the api to be used by our dashboard
CORS(app)

#################################################
# Flask Routes
#################################################


# Route for our home page
@app.route("/")
def home_route():
    """List of all available api routes:"""
    return (
        f"Welcome to the landing page of our data website!<br/>" 
        f'''
    <pre>
            _   _ _     _     _              _____           _   _     
            | | | (_) __| | __| | ___ _ __   |_   _| __ _   _| |_| |__  
            | |_| | |/ _` |/ _` |/ _ \ '_ \    | || '__| | | | __| '_ \ 
            |  _  | | (_| | (_| |  __/ | | |   | || |  | |_| | |_| | | |
            |_| |_|_|\__,_|\__,_|\___|_| |_|   |_||_|   \__,_|\__|_| |_|
            ____       _     _           _    ____           _     _   
            | __ )  ___| |__ (_)_ __   __| |  / ___|_____   _(_) __| |  
            |  _ \ / _ \ '_ \| | '_ \ / _` | | |   / _ \ \ / / |/ _` |  
            | |_) |  __/ | | | | | | | (_| | | |__| (_) \ V /| | (_| |  
            |____/ \___|_| |_|_|_| |_|\__,_|  \____\___/ \_/ |_|\__,_|  
    </pre>
    ''' 
        f"Here are the Available Routes:<br/>"
        f"/api/v1.0/states<br/>"
        f"/api/v1.0/counties<br/>"
        f"/api/v1.0/series_ids<br/>"
    )

# Route for our state data
@app.route("/api/v1.0/states")
def state_route():
    data = []
    # Grab the state documents
    records = states.find()
    # Fixes the id so it will run
    for record in records:
        record['_id'] = str(record['_id'])
        data.append(record)
    # Makes the data geojson combatible
    dic = {
    "features": data,
    "type": "FeatureCollection"}
    return dic

# Route for our county data
@app.route("/api/v1.0/counties")
def counties_route():
    data = []
    # Grab the county documents
    records = counties.find()
    # Fixes the id so it will run
    for record in records:
        record['_id'] = str(record['_id'])
        data.append(record)
    # Makes the data geojson combatible
    dic = {
    "features": data,
    "type": "FeatureCollection"}
    return dic

# Route for our state ids data
@app.route("/api/v1.0/series_ids")
def series_route():
    data = []
    # Grab the series id documents
    records = series_ids.find()
    # Fixes the id so it will run
    for record in records:
        record['_id'] = str(record['_id'])
        data.append(record)
    dic = {
    "features": data}
    return dic

# Runs the app
if __name__ == "__main__":
    app.run(debug=True)
