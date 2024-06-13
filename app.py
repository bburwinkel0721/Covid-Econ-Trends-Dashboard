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

tester_db = mongo.tester

construction = tester_db['construction']

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
        f"/api/v1.0/active_construction<br/>"
    )

# Route for our precipitation data
@app.route("/api/v1.0/active_construction")
def precipitation_route():
    data = []
    records = construction.find()
    for record in records:
        record['_id'] = str(record['_id'])
        data.append(record)
    return jsonify(data)

# Runs the app
if __name__ == "__main__":
    app.run(debug=True)
