import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LiveCoach.css";  // Ensure to import the custom CSS

const LiveCoach = () => {
    const navigate = useNavigate();
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const [recording, setRecording] = useState(false);
    const [presignedUrls, setPresignedUrls] = useState<string[]>([]);
    const [critiques, setCritiques] = useState<string[]>([]);

    useEffect(() => {
        const startVideoStream = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true, 
                    audio: false
                });
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
                (videoRef.current.srcObject as MediaStream)
                    .getTracks()
                    .forEach(track => track.stop());
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
                await uploadVideo(video);
            };

            setTimeout(() => {
                mediaRecorder.start();
                setRecording(true);

                setTimeout(() => {
                    mediaRecorder.stop();
                    setRecording(false);
                }, 5000);
            }, 1000);

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
            const payload = { video: base64String };

            const response = await fetch("http://localhost:5001/liveCoach", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error("Failed to upload video");
            }

            const data = await response.json();

            if (data.presigned_urls && data.presigned_urls.length > 0) {
                setPresignedUrls(data.presigned_urls);
                setCritiques(data.critique);
            }
            console.log("Video uploaded successfully!");
        } catch (error) {
            console.error("Error uploading video:", error);
        }
    };

    return (
        <div className="live-coach-container min-h-screen w-full bg-[#0A0F1C] flex flex-col items-center p-6">
            <h1 className="title text-3xl md:text-5xl font-extrabold text-white mt-8 mb-6">
                Live Coach
            </h1>

            {presignedUrls.length > 0 && critiques.length > 0 ? (
                <div className="screenshots-section w-full max-w-5xl bg-[#151A2D] rounded-xl p-6 shadow-xl border border-white/5">
                    <h2 className="section-title text-xl md:text-2xl font-semibold text-white mb-4">
                        Screenshots & Critique
                    </h2>
                    <div className="screenshots-list grid grid-cols-1 md:grid-cols-2 gap-6">
                        {presignedUrls.map((url, index) => (
                            <div 
                                key={index} 
                                className="screenshot-item bg-[#0A0F1C] p-4 rounded-xl shadow-lg border border-white/5"
                            >
                                <img
                                    src={url}
                                    alt={`Screenshot ${index + 1}`}
                                    className="screenshot-image rounded-lg mb-3 w-full object-cover"
                                />
                                <p className="critique-text text-gray-400">
                                    {critiques[index]}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center gap-4">
                    <div className="video-container overflow-hidden rounded-xl border border-white/5 shadow-lg bg-black/50">
                        <video 
                            ref={videoRef} 
                            autoPlay 
                            playsInline 
                            className="video-stream w-80 h-60 md:w-[600px] md:h-[400px] object-cover"
                        />
                    </div>
                    <button
                        onClick={startRecording}
                        disabled={recording}
                        className={`record-btn px-6 py-3 rounded-lg font-semibold text-white transition-colors duration-200 
                            ${recording ? "bg-gray-600 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-500"} 
                        `}
                    >
                        {recording ? "Recording..." : "Record 5s Clip"}
                    </button>
                </div>
            )}

            <button
                onClick={() => navigate("/")}
                className="return-home-btn mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold transition-colors"
            >
                Return to Home
            </button>
        </div>
    );
};

export default LiveCoach;