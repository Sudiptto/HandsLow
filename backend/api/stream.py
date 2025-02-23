from flask import Flask, Blueprint, abort, jsonify, request, session

from flask_cors import CORS

from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager

from service.firestore import db, check_user_exists, register_new_user, check_email_exists

from service.pose_detector import compare_videos

from service.access_drill import encode_drill

import base64


drill_encodings = {}

def encode_video(video_path):
    with open(video_path, "rb") as video_file:
        return base64.b64encode(video_file.read()).decode('utf-8')

stream = Blueprint('stream', __name__)
@stream.route("/upload", methods=['POST'])
def upload_videos():
    encoded_video = request.json['video_link'] 
    drill = request.json['drill']
    drill_filename = f"drills/{drill}.mov"
    
    with open(drill_filename, "rb") as drill_file:
        encoded_drill = base64.b64encode(drill_file.read()).decode('utf-8')
    
    accuracy_result = compare_videos(encoded_video, encoded_drill)

    return jsonify(accuracy_result)

