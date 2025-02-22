import cv2
import mediapipe as mp
import time
import math
from scipy.spatial.distance import cosine
from fastdtw import fastdtw

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
            for id, lm in enumerate(self.results.pose_landmarks.landmark):
                h, w, _ = img.shape
                cx, cy = int(lm.x * w), int(lm.y * h)
                lmList.append((id, cx, cy))
        return lmList

def compare_videos(video1_path, video2_path):
    cap1 = cv2.VideoCapture(video1_path)
    cap2 = cv2.VideoCapture(video2_path)

    detector1 = PoseDetector()
    detector2 = PoseDetector()

    frame_count = 0
    correct_frames = 0

    while cap1.isOpened() and cap2.isOpened():
        ret1, frame1 = cap1.read()
        ret2, frame2 = cap2.read()

        if not ret1 or not ret2:
            break  # End if one of the videos finishes

        frame1 = cv2.resize(frame1, (640, 480))
        frame2 = cv2.resize(frame2, (640, 480))

        frame1 = detector1.findPose(frame1)
        frame2 = detector2.findPose(frame2)

        lmList1 = detector1.findPosition(frame1)
        lmList2 = detector2.findPosition(frame2)

        if lmList1 and lmList2:
            # Compute similarity using FastDTW + Cosine Distance
            error, _ = fastdtw(lmList1, lmList2, dist=cosine)
            similarity = 100 - (error * 100)  # Convert error to percentage similarity

            # Draw similarity score on the video
            cv2.putText(frame2, f'Similarity: {round(similarity, 2)}%', (20, 50),
                        cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

            # Count correct frames if similarity is above 80%
            if similarity > 85:
                correct_frames += 1

        frame_count += 1

        # Show both videos side by side
        combined_frame = cv2.hconcat([frame1, frame2])
        cv2.imshow('Pose Comparison', combined_frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap1.release()
    cap2.release()
    cv2.destroyAllWindows()

    # Final Accuracy Score
    accuracy = (correct_frames / frame_count) * 100 if frame_count > 0 else 0
    print(f"Final Accuracy: {round(accuracy, 2)}%")

if __name__ == "__main__":
    compare_videos("/Users/ishmam/HandsLow/jab8.mov", "/Users/ishmam/HandsLow/jab11.mov")