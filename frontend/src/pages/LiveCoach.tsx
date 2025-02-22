import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const LiveCoach = () => {
    const navigate = useNavigate();
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const [recording, setRecording] = useState(false);

    useEffect(() => {
        const startVideoStream = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (error) {
                console.error("Error accessing webcam:", error);
            }
        };

        startVideoStream();

        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const startRecording = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            const mediaRecorder = new MediaRecorder(stream, { mimeType: "video/webm" });
            const recordedChunks: Blob[] = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    recordedChunks.push(event.data);
                }
            };

            mediaRecorder.onstop = async () => {
                const recordedBlob = new Blob(recordedChunks, { type: "video/webm" });
                const video = new File([recordedBlob], 'recorded-video.webm', { type: 'video/webm' });

                await uploadVideo(video);  // Upload the video after recording stops
            };

            // Delay before starting the recording
            setTimeout(() => {
                mediaRecorder.start();
                setRecording(true);

                // Stop after 5 seconds
                setTimeout(() => {
                    mediaRecorder.stop();
                    setRecording(false);
                }, 5000);
            }, 1000); // Delay for user action before starting the recording

            mediaRecorderRef.current = mediaRecorder;
        }
    };

    const convertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (reader.result) {
                    resolve(reader.result as string);
                } else {
                    reject("Error converting file to Base64");
                }
            };
            reader.onerror = () => reject("Error reading file");
            reader.readAsDataURL(file);
        });
    };

    const uploadVideo = async (file: File) => {
        try {
            const base64String = await convertToBase64(file);

            const payload = {
                video: base64String,
            };

            const response = await fetch("http://localhost:5000/liveCoach", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error("Failed to upload video");
            }

            console.log("Video uploaded successfully!");
        } catch (error) {
            console.error("Error uploading video:", error);
        }
    };

    return (
        <div className="min-h-screen w-full bg-black flex flex-col items-center justify-center p-8">
            <h1 className="text-5xl text-white font-black mb-8">Live Coach</h1>
            
            {/* Video Stream */}
            <div className="w-full max-w-4xl bg-gray-900 rounded-lg overflow-hidden">
                <video ref={videoRef} autoPlay playsInline className="w-full h-auto rounded-lg" />
            </div>
    
            {/* Start Recording Button */}
            <button
                onClick={startRecording}
                disabled={recording}
                className={`mt-6 text-white text-xl font-bold py-3 px-8 rounded-lg transition-all 
                    ${recording ? "bg-gray-500 cursor-not-allowed" : "bg-[#6C63FF] hover:bg-[#5a52d5]"}`}
            >
                {recording ? "Recording..." : "Record 5s Clip"}
            </button>
    
            {/* Return to Home Button */}
            <button
                onClick={() => navigate("/")}
                className="mt-4 bg-gray-700 hover:bg-gray-600 text-white text-xl font-bold py-3 px-8 rounded-lg transition-all"
            >
                Return to Home
            </button>
        </div>
    );    
};

export default LiveCoach;
