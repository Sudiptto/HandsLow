import cv2 
import base64


def encode_drill(drill_name):
    filename = drill_name + ".mov"
    video_path = "drills/" + filename
    try:
        with open(video_path, "rb") as video_file:
            base64_encoded = base64.b64encode(video_file.read()).decode('utf-8')
        return base64_encoded
    except Exception as e:
         print(f"An error occurred: {e}")
         return None

