import cv2
import time
import backend.service.pose_detector as pm
from scipy.spatial.distance import cosine
from fastdtw import fastdtw

def compare_videos(benchmark_path, user_path):
    benchmark_cam = cv2.VideoCapture(benchmark_path)
    user_cam = cv2.VideoCapture(user_path)

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
