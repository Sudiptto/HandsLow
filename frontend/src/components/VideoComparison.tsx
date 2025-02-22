import React, { useState } from "react";
import axios from "axios";

const VideoComparison: React.FC = () => {
  const [benchmark, setBenchmark] = useState<File | null>(null);
  const [user, setUser] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!benchmark || !user) {
      setError("Please select both videos.");
      return;
    }

    setLoading(true);
    setError(null);
    setAccuracy(null);

    const formData = new FormData();
    formData.append("benchmark", benchmark);
    formData.append("user", user);

    try {
      const response = await axios.post("http://127.0.0.1:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setAccuracy(response.data.accuracy);
    } catch (err) {
      setError("Failed to upload videos. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Pose Comparison</h1>
      <div className="flex flex-col gap-4">
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setBenchmark(e.target.files?.[0] || null)}
        />
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setUser(e.target.files?.[0] || null)}
        />
        <button
          className="bg-blue-500 text-white p-2 rounded"
          onClick={handleUpload}
          disabled={loading}
        >
          {loading ? "Processing..." : "Upload & Compare"}
        </button>
      </div>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {accuracy !== null && (
        <div className="mt-4 p-4 bg-green-100 border border-green-500 rounded">
          <h2 className="text-xl font-semibold">Comparison Result</h2>
          <p className="text-lg">Accuracy: <strong>{accuracy}%</strong></p>
        </div>
      )}
    </div>
  );
};

export default VideoComparison;
