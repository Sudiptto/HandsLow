import cv2
import mediapipe as mp
import pyttsx3
import time

mp_hands = mp.solutions.hands
mp_face = mp.solutions.face_detection

engine = pyttsx3.init()
def speak(text):
    engine.say(text)
    engine.runAndWait()

def analyze_video(video_path):
    cap = cv2.VideoCapture(video_path)
    hands = mp_hands.Hands(min_detection_confidence=0.5, min_tracking_confidence=0.5)
    face_detection = mp_face.FaceDetection(min_detection_confidence=0.5)
    
    frame_rate = int(cap.get(cv2.CAP_PROP_FPS))
    frame_count = 0
    
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        
        frame_count += 1
        if frame_count % (frame_rate * 2) == 0:  # Analyze every few seconds
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results_hands = hands.process(rgb_frame)
            results_face = face_detection.process(rgb_frame)
            
            chin_y = None
            if results_face.detections:
                for detection in results_face.detections:
                    bboxC = detection.location_data.relative_bounding_box
                    h, w, _ = frame.shape
                    chin_y = int((bboxC.ymin + bboxC.height) * h)
                    cv2.rectangle(frame, (int(bboxC.xmin * w), int(bboxC.ymin * h)), 
                                  (int((bboxC.xmin + bboxC.width) * w), chin_y), (255, 0, 0), 2)
            
            hands_low = False
            if results_hands.multi_hand_landmarks:
                for hand_landmarks in results_hands.multi_hand_landmarks:
                    wrist_y = int(hand_landmarks.landmark[mp_hands.HandLandmark.WRIST].y * frame.shape[0])
                    if chin_y and wrist_y > chin_y:
                        hands_low = True
            
            if hands_low:
                cv2.putText(frame, "HANDS LOW", (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
                speak("Hands low")
                time.sleep(3)  # Pause for 3 seconds
            else:
                cv2.putText(frame, "Good Form", (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
        
        cv2.imshow('Boxing Analysis', frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    
    cap.release()
    cv2.destroyAllWindows()
    hands.close()
    face_detection.close()

def main():
    video_path = input("Enter the path to your video file: ")
    analyze_video(video_path)

if __name__ == "__main__":
    main()
