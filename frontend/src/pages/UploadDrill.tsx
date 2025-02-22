import React, { useState, DragEvent } from 'react';
import { UploadCloud } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const UploadDrill: React.FC = () => {
  const location = useLocation();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [base64Video, setBase64Video] = useState<string | null>(null);

  const weight = location.state?.weight || '';
  const selectedDrill = location.state?.selectedDrill || '';

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
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      convertToBase64(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      convertToBase64(file);
    }
  };

  const convertToBase64 = (file: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setBase64Video(reader.result);
      }
    };
    reader.onerror = (error) => {
      console.error('Error converting file:', error);
    };
  };

  const handleCopyEmbedCode = () => {
    if (base64Video) {
      const embedCode = `<video controls width="400"><source src="${base64Video}" type="video/mp4"></video>`;
      navigator.clipboard.writeText(embedCode).then(() => {
        alert('Embed code copied to clipboard!');
      });
    }
  };

  return (
    <div className="min-h-screen w-full bg-black flex flex-col items-center justify-center p-8">
      <h1 className="text-5xl text-white font-black mb-8">Upload Drill</h1>

      <div className="mb-6 text-white text-xl">
        Weight: {weight} LBS
      </div>
      <div className="mb-6 text-white text-xl">
        Selected Drill: {selectedDrill}
      </div>

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

      {base64Video && (
        <div className="mt-6 w-full max-w-md">
          <p className="text-white mb-2">Preview:</p>
          <video controls className="w-full rounded-lg">
            <source src={base64Video} type="video/mp4" />
          </video>
          <button
            onClick={handleCopyEmbedCode}
            className="mt-4 bg-[#6C63FF] text-white text-xl font-bold py-3 px-8 rounded-full transition-all hover:scale-105 active:scale-95"
          >
            Copy Embed Code
          </button>
        </div>
      )}
    </div>
  );
};

export default UploadDrill;
