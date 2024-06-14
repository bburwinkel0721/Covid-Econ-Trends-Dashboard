# Import the dependencies.
from flask import Flask, jsonify
import datetime as dt
from datetime import datetime
import dateutil.parser as parser
from pymongo import MongoClient
from flask_cors import CORS

#################################################
# Database Setup
#################################################

# Create an instance of MongoClient
mongo = MongoClient(port=27017)

us_states_db = mongo.us_states_db

states = us_states_db['states']

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
    """List all available api routes."""
    return (
        f"Welcome to the landing page of the data website!<br/>" 
        f"<br/>" 
        f"Here are the Available Routes:<br/>"
        f"<br/>"
        f"/api/v1.0/states<br/>"
    )

# Route for our precipitation data
@app.route("/api/v1.0/states")
def precipitation_route():
    data = []
    records = states.find()
    for record in records:
        record['_id'] = str(record['_id'])
        data.append(record)
    dic = {
    "features": data,
    "type": "FeatureCollection"}
    return dic

# Runs the app
if __name__ == "__main__":
    app.run(debug=True)
