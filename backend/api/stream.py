from flask import Flask, Blueprint, abort, jsonify, request, session

from flask_cors import CORS

from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager

from service.firestore import db, check_user_exists, register_new_user, check_email_exists

from service.pose_detector import compare_videos

from service.access_drill import encode_drill

from service.punch_detection import analyze_video

import base64
import os

import uuid
import base64
import binascii


drill_encodings = {}

def encode_video(video_path):
    with open(video_path, "rb") as video_file:
        return base64.b64encode(video_file.read()).decode('utf-8')

def is_base64(sb):
    try:
        base64.b64decode(sb, validate=True)
        return True
    except binascii.Error:
        return False

stream = Blueprint('stream', __name__)
@stream.route("/upload", methods=['POST'])
def upload_videos():
    encoded_video = request.json['video'] 
    drill = request.json['drill']
    drill_filename = f"drills/{drill}.mov"

    print("PRINTING DRILL FILENAME" + drill_filename)

    print(is_base64(encoded_video))
    
    with open(drill_filename, "rb") as drill_file:
        encoded_drill = base64.b64encode(drill_file.read())
    
    print("reached")
    accuracy_result = compare_videos(encoded_video, encoded_drill)

    return jsonify(accuracy_result)


UPLOAD_FOLDER = os.getenv("UPLOAD_FOLDER")

@stream.route("/liveCoach", methods=['POST'])
def liveCoach():
    try:
        # Step 1: Get the video data from the request
        data = request.json
        if "video" not in data:
            return jsonify({"error": "No video data received"}), 400

        # Step 2: Decode Base64 video
        video_data = data["video"].split(",")[1]  # Remove metadata header if present
        video_bytes = base64.b64decode(video_data)

        # Step 3: Generate a unique filename and define the path
        filename = f"{uuid.uuid4().hex}.webm"
        file_path = os.path.join(UPLOAD_FOLDER, filename)

        # Step 4: Save the video to the upload folder
        with open(file_path, "wb") as video_file:
            video_file.write(video_bytes)

        # Step 5: Call the analyze_video function with the file path
        screenshot_dir = "screenshots"  # Specify the directory where screenshots will be saved
        presigned_urls = analyze_video(file_path, screenshot_dir)

        return jsonify({
            "message": "Video saved and analyzed successfully",
            "video_path": file_path,
            "presigned_urls": presigned_urls  # Add the presigned URLs in the response
        }), 200

    except Exception as e:
        return jsonify({"error": f"Failed to process video: {str(e)}"}), 500


