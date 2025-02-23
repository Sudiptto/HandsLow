from io import BytesIO
import cv2
import mediapipe as mp
import numpy as np
import os
import uuid
import time
from sklearn.metrics.pairwise import cosine_similarity

# Initialize MediaPipe Pose
mp_pose = mp.solutions.pose
pose = mp_pose.Pose()
mp_drawing = mp.solutions.drawing_utils

# Define the ideal boxing form as vectors
IDEAL_VECTORS = {
    "right_arm": np.array([1, 0]),   # Example ideal vector
    "left_arm": np.array([-1, 0]),
    "right_leg": np.array([0, -1]),
    "left_leg": np.array([0, -1]),
    "torso": np.array([0, -1])
}

# Create a directory to store screenshots
screenshot_dir = "screenshots"
os.makedirs(screenshot_dir, exist_ok=True)

# Track the last time a screenshot was taken
last_screenshot_time = 0  # Store the timestamp of the last saved frame
SCREENSHOT_COOLDOWN = 2  # Minimum time (seconds) between screenshots

def calculate_vector(a, b):
    """Compute the unit vector from point A to point B."""
    a, b = np.array(a), np.array(b)
    vector = b - a
    return vector / np.linalg.norm(vector)  # Normalize

def compare_pose(keypoints):
    """Compare user's pose against the ideal boxing stance using cosine similarity."""
    shoulder_r, elbow_r, wrist_r = keypoints[mp_pose.PoseLandmark.RIGHT_SHOULDER.value], \
                                   keypoints[mp_pose.PoseLandmark.RIGHT_ELBOW.value], \
                                   keypoints[mp_pose.PoseLandmark.RIGHT_WRIST.value]
    shoulder_l, elbow_l, wrist_l = keypoints[mp_pose.PoseLandmark.LEFT_SHOULDER.value], \
                                   keypoints[mp_pose.PoseLandmark.LEFT_ELBOW.value], \
                                   keypoints[mp_pose.PoseLandmark.LEFT_WRIST.value]
    hip_r, knee_r, ankle_r = keypoints[mp_pose.PoseLandmark.RIGHT_HIP.value], \
                             keypoints[mp_pose.PoseLandmark.RIGHT_KNEE.value], \
                             keypoints[mp_pose.PoseLandmark.RIGHT_ANKLE.value]
    hip_l, knee_l, ankle_l = keypoints[mp_pose.PoseLandmark.LEFT_HIP.value], \
                             keypoints[mp_pose.PoseLandmark.LEFT_KNEE.value], \
                             keypoints[mp_pose.PoseLandmark.LEFT_ANKLE.value]
    
    torso_vector = calculate_vector(shoulder_r, hip_r)
    right_arm_vector = calculate_vector(shoulder_r, elbow_r)
    left_arm_vector = calculate_vector(shoulder_l, elbow_l)
    right_leg_vector = calculate_vector(hip_r, knee_r)
    left_leg_vector = calculate_vector(hip_l, knee_l)

    user_vectors = {
        "right_arm": right_arm_vector,
        "left_arm": left_arm_vector,
        "right_leg": right_leg_vector,
        "left_leg": left_leg_vector,
        "torso": torso_vector
    }

    # Compute cosine similarity for each vector
    similarities = {key: cosine_similarity([user_vectors[key]], [IDEAL_VECTORS[key]])[0][0] for key in IDEAL_VECTORS}
    return similarities

# ** Load a Video File Instead of a Live Camera Feed **
# video_path = "/Users/ishmam/HandsLow-1/backend/drills/1.mov"  # Change this to your video file path

from service.aws_service import upload_image_to_s3

def analyze_video(video_path, screenshot_dir, screenshot_cooldown=3):
    last_screenshot_time = time.time()  # Initialize last screenshot time

    presigned_urls = []

    # Load video
    cap = cv2.VideoCapture(video_path)

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break  # Stop when the video ends

        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = pose.process(frame_rgb)

        if results.pose_landmarks:
            mp_drawing.draw_landmarks(frame, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)
            keypoints = [[lm.x, lm.y] for lm in results.pose_landmarks.landmark]
            similarities = compare_pose(keypoints)
            
            # Display similarity scores
            for i, (key, score) in enumerate(similarities.items()):
                color = (0, 255, 0) if score > 0.9 else (0, 0, 255)
                cv2.putText(frame, f"{key}: {score:.2f}", (50, 50 + i * 30),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)

            # Take screenshot if any punch is above 0.9 and enough time has passed
            current_time = time.time()
            if any(score > 0.9 for score in similarities.values()) and (current_time - last_screenshot_time > screenshot_cooldown):
                last_screenshot_time = current_time  # Update last screenshot time
                screenshot_path = os.path.join(screenshot_dir, f"{uuid.uuid4().hex}.png")
                cv2.imwrite(screenshot_path, frame)
                print(f"Screenshot saved: {screenshot_path}")

                is_success, buffer = cv2.imencode('.png', frame)
                if is_success:
                    image_data = BytesIO(buffer)
                    presigned_url = upload_image_to_s3(image_data)  # Upload to S3
                    if presigned_url:
                        presigned_urls.append(presigned_url)
                        print(f"Screenshot uploaded: {presigned_url}")

        
        # Exit on 'q' key press
        if cv2.waitKey(25) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

    return presigned_urls


