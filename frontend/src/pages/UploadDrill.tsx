import React, { useState, DragEvent } from 'react';
import { UploadCloud } from 'lucide-react';

const UploadDrill: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Handle drag events
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Simulate file upload
  const handleUpload = () => {
    if (selectedFile) {
      // Your upload logic goes here
      console.log('Uploading file:', selectedFile);
      alert(`Uploading: ${selectedFile.name}`);
    }
  };

  return (
    <div className="min-h-screen w-full bg-black flex flex-col items-center justify-center p-8">
      <h1 className="text-5xl text-white font-black mb-8">Upload Drill</h1>
      
      {/* Drag & Drop / Browse Area */}
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
        
        {/* Invisible file input to capture clicks */}
        <input
          type="file"
          accept="video/mp4"
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={handleFileChange}
        />
      </div>

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={!selectedFile}
        className={`
          bg-[#6C63FF] 
          text-white 
          text-xl 
          font-bold 
          py-3 px-8 
          rounded-full
          transition-all 
          hover:scale-105 
          active:scale-95
          ${
            selectedFile
              ? 'cursor-pointer'
              : 'cursor-not-allowed opacity-50'
          }
        `}
      >
        UPLOAD
      </button>
    </div>
  );
};

export default UploadDrill;
