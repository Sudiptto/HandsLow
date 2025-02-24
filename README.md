# HandsLow
Hacklytics 2025 

## Inspiration
Boxing is one of the most effective full-body workouts, but proper form is essential for maximizing performance and preventing injuries. However, professional coaching can be expensive, making quality training inaccessible to many. Our goal was to develop an affordable, AI-powered solution that helps boxers refine their technique and defensive skills anytime, anywhere.

## What it does
HandsUp is a web app that uses computer vision and AI to analyze boxing form. It detects when a user's hands are too low—indicating weak defense—and provides real-time feedback. Future expansions will include foot positioning detection, AI-generated coaching, and velocity tracking for punch effectiveness.

## How we built it
Frontend: Vite + React (TypeScript)
Backend: Flask (Python)
Computer Vision & AI: OpenCV, MediaPipe, OpenCV
Cloud Services: AWS (Boto3), Firebase (user authentication)

## Challenges we ran into
- Developing an accurate computer vision model that compares the accuracy of two different videos utilizing cosine similarity. 
- Fine-tuning the model to accurately detect low hands in various lighting conditions
- Integrating real-time, accurate AI Boxing Coach feedback without massive latency issues. 
## Accomplishments that we're proud of
- Developing two AI models using MediaPipe—one for detecting hand position and another for tracking punches
- Implementing AWS S3 storage to automatically save images when a punch is detected
- Designing a scalable system to support future features like calorie tracking and velocity detection
- Crafting an intuitive and engaging user interface lucide-react and TailwindCSS. 

## What we learned
Optimizing AI models for real-time sports analysis
The importance of user customization in fitness applications
Effective cloud integration for performance and scalability
## What's next for HandsUp
Expanding detection to foot positioning mistakes
Adding social features like commenting and sharing workout progress
Implementing a velocity-based scoring system for punches
Tracking calories burned using MET calculations
Refining AI-generated coaching for more personalized feedback
