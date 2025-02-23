import cv2
import mediapipe as mp
import numpy as np
import uuid
from scipy.spatial.distance import cosine
from fastdtw import fastdtw
import os
import uuid
import base64
import tempfile
import time
from service.cloudinary1 import *

from service.cloudinary1 import *

class PoseDetector:
    def __init__(self, detectionCon=0.7, trackCon=0.7):
        self.mpPose = mp.solutions.pose
        self.mpDraw = mp.solutions.drawing_utils
        self.pose = self.mpPose.Pose(min_detection_confidence=detectionCon, min_tracking_confidence=trackCon)

    def findPose(self, img, draw=True):
        imgRGB = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        self.results = self.pose.process(imgRGB)

        if self.results.pose_landmarks and draw:
            self.mpDraw.draw_landmarks(img, self.results.pose_landmarks, self.mpPose.POSE_CONNECTIONS)

        return img

    def findPosition(self, img):
        lmList = []
        if self.results.pose_landmarks:
            h, w, _ = img.shape
            for id, lm in enumerate(self.results.pose_landmarks.landmark):
                cx, cy = int(lm.x * w), int(lm.y * h)
                lmList.append((id, cx, cy))
        return lmList


def decode_video(encoded_video):
    decoded_data = base64.b64decode(encoded_video)
    with tempfile.NamedTemporaryFile(suffix=".mp4", delete=False) as temp_video:
        temp_video.write(decoded_data)
        return temp_video.name

def compare_videos(encoded_user, encoded_drill):
    video1_path = decode_video(encoded_user)
    video2_path = decode_video(encoded_drill)

    cap1 = cv2.VideoCapture(video1_path)
    cap2 = cv2.VideoCapture(video2_path)

    detector1 = PoseDetector()
    detector2 = PoseDetector()

    frame_count = 0
    correct_frames = 0

    width, height = 640, 480
    fps = int(cap1.get(cv2.CAP_PROP_FPS)) or 30
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')

    # Ensure the "videos" folder exists
    if not os.path.exists("videos"):
        os.makedirs("videos")
    
    # Create a unique filename for the output video
    video_path = os.path.join("videos", f"output_{int(time.time())}.mp4")
    print("Saving video to: " + video_path)

    out = cv2.VideoWriter(video_path, fourcc, fps, (width * 2, height))

    while cap1.isOpened() and cap2.isOpened():
        ret1, frame1 = cap1.read()
        ret2, frame2 = cap2.read()

        if not ret1 or not ret2:
            break

        frame1 = cv2.resize(frame1, (width, height))
        frame2 = cv2.resize(frame2, (width, height))

        frame1 = detector1.findPose(frame1, draw=True)
        frame2 = detector2.findPose(frame2, draw=True)

        lmList1 = detector1.findPosition(frame1)
        lmList2 = detector2.findPosition(frame2)

        if lmList1 and lmList2:
            error, _ = fastdtw(lmList1, lmList2, dist=cosine)
            similarity = max(0, 100 - (error * 100))

            if similarity > 85:
                correct_frames += 1

            cv2.putText(frame2, f'Similarity: {round(similarity, 2)}%', (20, 50),
                        cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

        frame_count += 1
        combined_frame = cv2.hconcat([frame1, frame2])
        out.write(combined_frame)

    cap1.release()
    cap2.release()
    out.release()

    # Pass the local video path to the upload function
    video_url = upload_video(video_path)[:-3] + "mov"

    accuracy = (correct_frames / frame_count) * 100 if frame_count > 0 else 0

    return {"accuracy": round(accuracy, 2), "video_url": video_url[:-3] + "mov"}

