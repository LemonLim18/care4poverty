import os
import json
from flask import Flask, jsonify, request, Response
from flask_cors import CORS
from scanner import scan_barcode_and_save
from flask_socketio import SocketIO, emit
from pyzbar.pyzbar import decode
import time
import asyncio
import cv2
import threading


app = Flask(__name__)
CORS(app, origins="*")
socketio = SocketIO(app, cors_allowed_origins="*")

# global variable
is_scanning = False
cap = None
scan_thread = None


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
# @app.route('/scan-barcode', methods=['GET'])
# def scan_barcode():
#     global is_scanning
#     is_scanning = True
#     scan_barcode_and_save(is_scanning)  # Call the function inside the route handler
#     with open('scannedResult.json', 'r') as file:
#         decoded_result = json.load(file)
#     if decoded_result:
#         return jsonify(decoded_result)
#     else:
#         return jsonify({"error": "No barcode detected"})

# @socketio.on('start-scan')
# def start_scan():
#     global is_scanning
#     is_scanning = True
#     print("Scanning started")

#     while is_scanning:
#         scan_barcode_and_save(is_scanning)
#         with open('scannedResult.json', 'r') as file:
#             decoded_result = json.load(file)
#         if decoded_result:
#             emit('barcode_detected', decoded_result)
        
# SSE endpoint for streaming barcode scan results
@app.route('/scan-barcode', methods=['GET'])
def scan_barcode_and_stream():
    global is_scanning, scan_thread
    is_scanning = True

    def event_stream():
        global is_scanning, cap
        print("Scanning started")
        try:
            # Initialize the webcam
            cap = cv2.VideoCapture(0)
            with open('itemList.json', 'r') as file:
                resource_mapping = json.load(file)

                # Open a JSON file to save scanned barcode data
            while is_scanning:
                ret, frame = cap.read()
                if not ret:
                    print("Failed to capture frame from webcam. Exiting...")
                    break
                # Draw a rectangle in the center of the frame as a scanning guide
                height, width, _ = frame.shape
                top_left = (width // 4, height // 4)
                bottom_right = (3 * width // 4, 3 * height // 4)
                cv2.rectangle(frame, top_left, bottom_right, (0, 255, 0), 2)
                # Add guiding text to the frame
                cv2.putText(frame, "Place barcode inside the rectangle", 
                            (width // 4, height // 4 - 10), 
                            cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
                cv2.putText(frame, "Press ESC to exit", 
                            (10, 30), 
                            cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
                
                # Decode barcodes in the frame
                barcodes = decode(frame)
                for barcode in barcodes:
                    barcode_data = barcode.data.decode('utf-8')
                    # get() returns the value for a given key, if the key is not found it returns the default value
                    item_name = resource_mapping.get(barcode_data, "Unknown Item").replace("_", " ")
                    category_id = barcode_data[0]  # First digit represents the category
                    # Map the category ID to a category name
                    category_name = {
                        '1': 'Foods',
                        '2': 'Wearable Items',
                    }.get(category_id, "Unknown Category")
                    # Create the decoded result
                    decoded_result = {
                        'category': category_name,
                        'item_name': item_name,
                        'barcode': barcode_data
                    }
                    if decoded_result:
                        print(f"Yielding decoded result: {decoded_result}")  # Debug print
                        yield f"data: {json.dumps(decoded_result)}\n\n"
                    time.sleep(1)  # Control frequency of scanning

                cv2.imshow('Barcode Scanner', frame)
                if cv2.waitKey(1) & 0xFF == 27:
                    break

        except GeneratorExit:
            print("Client disconnected. Stopping SSE stream.")
        finally:
            cap.release()
            cv2.destroyAllWindows()
            is_scanning = False
            print("Scanning stopped (SSE).")
    
    return Response(event_stream(), headers={
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive"
    })

@app.route('/test-barcode', methods=['GET'])
def test_barcode_and_stream():
    def test_stream():
        while True:
            yield f"data: {json.dumps({"name":"json","age":"18"})}\n\n"
    
    return Response(test_stream(), headers={
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive"
    })

# @app.route('/disconnect', methods=['GET'])
# def disconnect():
#     global is_scanning
#     if is_scanning:
#         is_scanning = False
#         print("Disconnecting and stopping the scan.")
#         # Perform any additional cleanup if necessary
#         if cap and cap.isOpened():
#             cap.release()
#             print("Webcam released.")
#         cv2.destroyAllWindows()
#         return jsonify({"status_code": "200", "status_message": "Disconnected"})
#     else:
#         return jsonify({"status_code": "400", "status_message": "No active scanning to stop"})
#     # return jsonify({"status_code":"200", "status_message": "Disconnected"})

@app.route('/disconnect', methods=['GET'])
def disconnect():
    global is_scanning, cap
    if is_scanning:
        print("Disconnect requested. Stopping scanning...")
        is_scanning = False  # Stop the generator loop

        # Release the webcam
        if cap:
            if cap.isOpened():
                cap.release()
                print("Webcam resource released.")
            cap = None

        # Destroy OpenCV windows
        cv2.destroyAllWindows()
        print("OpenCV windows destroyed.")

        return jsonify({"status_code": "200", "status_message": "Scanning stopped and disconnected"})
    else:
        print("No active scanning process.")
        return jsonify({"status_code": "400", "status_message": "No active scanning to stop"})


if __name__ == '__main__':
    app.run(debug=True)
