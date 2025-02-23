from flask import Flask, Blueprint, abort, jsonify, request, session

from flask_cors import CORS

from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager

from service.firestore import db, check_user_exists, register_new_user, check_email_exists

from service.pose_detector import compare_videos

from service.access_drill import encode_drill


drill_encodings = {}

stream = Blueprint('stream', __name__)
@stream.route("/upload", methods=['POST'])
def upload_videos():
    video_link = request.json['video_link'] 
    drill = request.json['drill']

    """
    benchmark = request.files['benchmark']
    user = request.files['user']

    benchmark.save(benchmark_path)
    user.save(user_path)
    """
    
    
    accuracy_result = compare_videos(video_link)

    return jsonify(accuracy_result)
