import cv2
import mediapipe as mp
import numpy as np
from scipy.spatial.distance import cosine
import time

# Initialize MediaPipe Pose
mp_pose = mp.solutions.pose
pose = mp_pose.Pose()
mp_drawing = mp.solutions.drawing_utils

# Define the ideal boxing form (angles in degrees)
IDEAL_POSE = {
    "right_arm": 90,  # Shoulder -> Elbow -> Wrist
    "left_arm": 90,
    "right_leg": 170,  # Hip -> Knee -> Ankle
    "left_leg": 170,
    "torso": 160  # Shoulder -> Hip -> Knee
}

def calculate_angle(a, b, c):
    """Calculate angle between three points using cosine similarity."""
    a, b, c = np.array(a), np.array(b), np.array(c)
    ab, bc = b - a, c - b
    cosine_angle = np.dot(ab, bc) / (np.linalg.norm(ab) * np.linalg.norm(bc))
    return np.degrees(np.arccos(np.clip(cosine_angle, -1.0, 1.0)))

def compare_pose(keypoints):
    """Compare user's pose against the ideal boxing stance."""
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
    
    torso_angle = calculate_angle(shoulder_r, hip_r, knee_r)
    right_arm_angle = calculate_angle(shoulder_r, elbow_r, wrist_r)
    left_arm_angle = calculate_angle(shoulder_l, elbow_l, wrist_l)
    right_leg_angle = calculate_angle(hip_r, knee_r, ankle_r)
    left_leg_angle = calculate_angle(hip_l, knee_l, ankle_l)
    
    user_pose = {
        "right_arm": right_arm_angle,
        "left_arm": left_arm_angle,
        "right_leg": right_leg_angle,
        "left_leg": left_leg_angle,
        "torso": torso_angle
    }
    
    # Compute similarity for each angle
    similarities = {key: 1 - cosine([user_pose[key]], [IDEAL_POSE[key]]) for key in IDEAL_POSE}
    return similarities

# Start video capture
cap = cv2.VideoCapture(0)

# List to store frames
frames = []

# Record for 5 seconds
start_time = time.time()
recording_duration = 5  # seconds

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    # Break the loop if 5 seconds have passed
    if time.time() - start_time > recording_duration:
        break

    # Create a blank canvas (black background)
    blank_canvas = np.zeros_like(frame)

    # Convert the frame to RGB (required for Mediapipe)
    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = pose.process(frame_rgb)

    if results.pose_landmarks:
        # Draw the pose landmarks on the blank canvas (stick figure only)
        mp_drawing.draw_landmarks(blank_canvas, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)
        keypoints = [[lm.x, lm.y] for lm in results.pose_landmarks.landmark]
        similarities = compare_pose(keypoints)

        # Display similarity scores
        for i, (key, score) in enumerate(similarities.items()):
            cv2.putText(blank_canvas, f"{key}: {score:.2f}", (50, 50 + i * 30),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0) if score > 0.8 else (0, 0, 255), 2)

    # Add the frame with the stick figure to the list
    frames.append(blank_canvas)

    # Show the frame with the stick figure
    cv2.imshow("Stick Figure Pose", blank_canvas)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Convert the list of frames to a NumPy array
frames_array = np.array(frames)

# Save frames to a .npy file
np.save('jab.npy', frames_array)

# Release the video capture and close OpenCV window
cap.release()
cv2.destroyAllWindows()

print("Frames with stick figure saved as jab.npy")