import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LiveCoach.css";  // Ensure to import the custom CSS

const LiveCoach = () => {
    const navigate = useNavigate();
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const [recording, setRecording] = useState(false);
    const [presignedUrls, setPresignedUrls] = useState<string[]>([]);  // State to hold presigned URLs
    const [critiques, setCritiques] = useState<string[]>([]);

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

            setTimeout(() => {
                mediaRecorder.start();
                setRecording(true);

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
                setCritiques(data.critique); // Assuming critiques are returned in the response
            }

            console.log("Video uploaded successfully!");
        } catch (error) {
            console.error("Error uploading video:", error);
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#0A0F1C] flex flex-col items-center p-6">
        {/* Decorative Background */}
        <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20" />
        <div className="fixed inset-0 bg-[url('/grid.svg')] opacity-20" />
        
        {/* Content Container */}
        <div className="relative z-10 w-full flex flex-col items-center">
            <h1 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-500 to-blue-400 mt-8 mb-6">
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
                                className="screenshot-item bg-[#0A0F1C] p-4 rounded-xl shadow-lg border border-white/5 hover:border-purple-500/50 transition-all duration-200"
                            >
                                <img
                                    src={url}
                                    alt={`Screenshot ${index + 1}`}
                                    className="screenshot-image rounded-lg mb-3 w-full aspect-video object-cover"
                                />
                                <p className="critique-text text-gray-400 leading-relaxed">
                                    {critiques[index]}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center gap-4 w-full max-w-2xl">
                    <div className="w-full bg-[#151A2D] rounded-xl p-6 border border-white/5 shadow-xl">
                        <div className="video-container overflow-hidden rounded-xl border border-white/5 shadow-lg bg-black/50 mb-6">
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                className="w-full aspect-video object-cover"
                            />
                        </div>
                        <button
                            onClick={startRecording}
                            disabled={recording}
                            className={`w-full px-6 py-4 rounded-xl font-semibold text-white transition-all duration-200 
                                ${recording 
                                    ? "bg-gray-600 cursor-not-allowed" 
                                    : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 hover:scale-[1.02]"
                                }
                            `}
                        >
                            {recording ? "Recording..." : "Record 5s Clip"}
                        </button>
                    </div>
                </div>
            )}

            <button
                onClick={() => navigate("/")}
                className="mt-6 px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl font-semibold transition-all hover:scale-105 active:scale-95"
            >
                Return to Home
            </button>
        </div>
    </div>
    );
}

export default LiveCoach;
