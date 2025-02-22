import React, { useState, DragEvent } from 'react';
import { UploadCloud } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const UploadDrill: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [base64Video, setBase64Video] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // Mock loading state
  const [videoDuration, setVideoDuration] = useState<number | null>(null);


  const drill = location.state?.selectedDrill || 'Default Drill';
  const weight = location.state?.weight || '';

  // Handle file drag over
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  // Handle drag leave
  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  // Handle file drop
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      convertToBase64(file);
    }
  };

  // Handle file selection from input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      convertToBase64(file);
    }
  };

  // Convert file to Base64
  const convertToBase64 = (file: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setBase64Video(reader.result);
  
        // Create a video element to get duration
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.src = reader.result;
  
        video.onloadedmetadata = () => {
          setVideoDuration(video.duration);
        };
      }
    };
    reader.onerror = (error) => {
      console.error('Error converting file:', error);
    };
  };

  // 9 * ( body weight lbs/ 2.20462 ) * duration/60 ( cause were gonna be doing seconds )20 * (130/2.20462 ) * 1/60
    // have this return {calories-burned: , calories-burned-per-minute}
    function calculateCaloriesBurned(weight: number, duration: number) {
      const caloriesBurned = 9 * (weight / 2.20462) * (duration / 60);
      const caloriesBurnedPerMinute = caloriesBurned / (duration / 60);
      return { caloriesBurned, caloriesBurnedPerMinute };
    }

  // Handle Submit Button Click (FOR ISHMAM)
  const handleSubmit = async () => {
    // analysisData will contain the calories burned and calories burned per minute ({calories-burned: , calories-burned-per-minute}) &  text from the API so like this {{calories-burned: , calories-burned-per-minute}, analysis: "text from the API"}
    const analaysisData = {};


    if (!selectedFile) {
      alert('Please upload a video before submitting.');
      return;
    }

    setIsSubmitting(true);

    console.log('Submitting data...');
    console.log('Drill:', drill);
    console.log('Video Data:', base64Video);

    // Mock API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // make a mock API call with data and get the response
    // const response = await fetch('https://api.example.com/analyze', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ drill, video: base64Video }),
    // });

    // const data = await response.json();

    // console.log('API Response:', data);

    // mock
    // calculate duration of the video sent (the mp4 in seconds)
    


    const analysisData = {
      calories: calculateCaloriesBurned(weight, videoDuration ?? 0), // Ensure duration is not null
      analysis: "text from the API",
      base64video: base64Video,
      ogVideo: base64Video
    };
    
    
    console.log("Submission complete. Redirecting to analysis...");

    // Navigate to analysis page
    navigate('/analysis', { state: { drill, analysisData, weight } });
  };

  return (
    <div className="min-h-screen w-full bg-black flex flex-col items-center justify-center p-8">
      <h1 className="text-5xl text-white font-black mb-8">Upload Drill</h1>
      
      <div className="mb-6 text-white text-xl">
        Selected Drill: {drill}
      </div>

      <div className="mb-6 text-white text-xl">
        Weight: {weight} LBS
    </div>

      {/* File Upload Area */}
      <div
        className={`
          relative
          w-full max-w-md
          bg-gray-900
          rounded-lg
          p-8
          border-2 border-dashed
          ${isDragging ? 'border-[#6C63FF]' : 'border-[#6C63FF]/30'}
          flex flex-col items-center justify-center
          mb-8
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <UploadCloud className="text-[#6C63FF] w-16 h-16 mb-4" />
        <p className="text-white mb-2">
          Drag &amp; drop files or{' '}
          <span className="text-[#6C63FF] underline cursor-pointer">
            Browse
          </span>
        </p>
        <p className="text-gray-400">Supported formats: MP4</p>

        <input
          type="file"
          accept="video/mp4"
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={handleFileChange}
        />
      </div>

      {/* Video Preview */}
      {base64Video && (
        <div className="mt-6 w-full max-w-md">
          <p className="text-white mb-2">Preview:</p>
          <video controls className="w-full rounded-lg">
            <source src={base64Video} type="video/mp4" />
          </video>
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={!selectedFile || isSubmitting}
        className={`mt-4 bg-[#6C63FF] text-white text-xl font-bold py-3 px-8 rounded-full transition-all hover:scale-105 active:scale-95
          ${selectedFile && !isSubmitting ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}
        `}
      >
        {isSubmitting ? 'Processing...' : 'Submit'}
      </button>
    </div>
  );
};

export default UploadDrill;
