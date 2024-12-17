import cv2
import json
from pyzbar.pyzbar import decode
from flask import jsonify
import threading
# from flask_socketio import SocketIO

def scan_barcode_and_save(is_scanning):
    # Load the item mapping from a JSON file
    with open('itemList.json', 'r') as file:
        resource_mapping = json.load(file)

    # Initialize the webcam
    cap = cv2.VideoCapture(0)

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

            # Print and save the decoded result
            print(f"Decoded Data: {decoded_result}")
            # Save the data in JSON format to a file
            with open('scannedResult.json', 'w') as file:
                json.dump(decoded_result, file)
                file.write('\n')  # Add newline for each JSON object
                # return decoded_result
            # Exit after the first detected barcode
            # break
        # Break the loop if a barcode was detected
        # if barcodes:
        #     break
        # Display the frame
        cv2.imshow('Barcode Scanner', frame)
        # Exit the loop when 'ESC' is pressed
        if cv2.waitKey(1) & 0xFF == 27:
            break

    # Release the webcam and close all OpenCV windows
    cap.release()
    cv2.destroyAllWindows()

    # But the problem is it cant return the decoded result without stopping the scanning process
    # return decoded_result  # Return the decoded results to the caller
