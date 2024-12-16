import os
import json
from flask import Flask, jsonify, request
from flask_cors import CORS
from scanner import scan_barcode_and_save

app = Flask(__name__)
CORS(app)

# global variable
is_scanning = False
cap = None

# Load the item mapping from a JSON file
with open('itemList.json', 'r') as file:
    resource_mapping = json.load(file)

@app.route('/')
def home():
    app_name = os.getenv("APP_NAME")
    return f"Welcome to {app_name}!"

@app.route('/check-connection', methods=['GET'])
def check_connection():
    return jsonify({"status_code": "200", "status_message": "Connected"})

# Define the route and assign a function to handle it
@app.route('/scan-barcode', methods=['GET'])
def scan_barcode():
    global is_scanning
    is_scanning = True
    decoded_result = scan_barcode_and_save(is_scanning)  # Call the function inside the route handler

    if decoded_result:
        return jsonify(decoded_result)
    else:
        return jsonify({"error": "No barcode detected"})

@app.route('/disconnect', methods=['GET'])
def disconnect():
    global is_scanning
    if is_scanning:
        is_scanning = False
        scan_barcode_and_save(is_scanning)
        return jsonify({"status_code":"200", "status_message": "Disconnected"})
    else:
        return jsonify({"status_code":"400", "status_message": "No active scanning to stop"})
    # return jsonify({"status_code":"200", "status_message": "Disconnected"})

if __name__ == '__main__':
    app.run(debug=True)
