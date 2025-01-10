import cv2

def list_available_cameras():
    available_cameras = []
    for index in range(10):  # Adjust the range based on your system; 10 is usually sufficient
        cap = cv2.VideoCapture(index)
        if cap.isOpened():
            available_cameras.append(index)
            cap.release()
    return available_cameras

# Detect available webcams
cameras = list_available_cameras()
if cameras:
    print(f"Available camera indices: {cameras}")
    # Prioritize using the highest index for the external camera
    external_camera_index = max(cameras)
    print(f"Attempting to use external camera at index: {external_camera_index}")
    cap = cv2.VideoCapture(external_camera_index)
    if cap.isOpened():
        print(f"Successfully opened external camera at index: {external_camera_index}")
        # You can now add your webcam functionality here
        # For example, display the webcam feed
        while True:
            ret, frame = cap.read()
            if not ret:
                print("Failed to capture frame. Exiting...")
                break
            cv2.imshow("External Camera", frame)
            if cv2.waitKey(1) & 0xFF == 27:  # Press ESC to exit
                break
        cap.release()
        cv2.destroyAllWindows()
    else:
        print(f"Failed to open external camera at index: {external_camera_index}")
else:
    print("No cameras found.")
