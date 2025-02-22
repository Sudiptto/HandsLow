import cv2
import time
import backend.service.pose_detector as pm
from scipy.spatial.distance import cosine
from fastdtw import fastdtw

import base64
import numpy as np
import tempfile

def base64_to_cv2_video(base64_string):
    # Decode Base64 string into bytes
    video_bytes = base64.b64decode(base64_string)
    
    # Create a temporary file
    with tempfile.NamedTemporaryFile(delete=True, suffix=".mp4") as temp_video:
        temp_video.write(video_bytes)  # Write the decoded bytes
        temp_video.flush()  # Ensure all data is written

        # Open the temporary video with OpenCV
        cap = cv2.VideoCapture(temp_video.name)

        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
            cv2.imshow("Video", frame)
            
            # Press 'q' to exit
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
        
        cap.release()
        cv2.destroyAllWindows()


def compare_videos(benchmark_encoding, user_encoding):
    benchmark_cam = base64_to_cv2_video(benchmark_encoding)
    user_cam = base64_to_cv2_video(user_encoding)

    detector_benchmark = pm.PoseDetector()
    detector_user = pm.PoseDetector()

    while benchmark_cam.isOpened() and user_cam.isOpened():
        ret1, frame1 = benchmark_cam.read()
        ret2, frame2 = user_cam.read()

        if not ret1 or not ret2:
            break

        frame1 = detector_benchmark.findPose(frame1)
        frame2 = detector_user.findPose(frame2)

        lmList_benchmark = detector_benchmark.findPosition(frame1)
        lmList_user = detector_user.findPosition(frame2)

        # Compare pose similarity
        if lmList_benchmark and lmList_user:
            error, _ = fastdtw(lmList_user, lmList_benchmark, dist=cosine)
            similarity = 100 - (error * 100)  # Convert error into percentage similarity

            cv2.putText(frame2, f'Similarity: {round(similarity, 2)}%', (20, 50),
                        cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

        # Show videos
        cv2.imshow('Benchmark Video', frame1)
        cv2.imshow('User Video', frame2)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    benchmark_cam.release()
    user_cam.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    compare_videos("dance_videos/benchmark_dance.mp4", "dance_videos/user_dance.mp4")
