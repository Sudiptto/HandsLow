import React from "react";
import { useLocation } from "react-router-dom";

interface AnalysisPageProps {
  aiComments?: string;
  totalCalories?: number;
  totalSeconds?: number;
}

const AnalysisPage: React.FC<AnalysisPageProps> = ({
  aiComments = "LOREM IPSUM ADSADADAA",
  totalCalories = 300,
  totalSeconds = 120,
}) => {
  const location = useLocation();
  const weight = location.state?.weight || '';
  const selectedDrill = location.state?.selectedDrill || '';

  const handleRepeat = () => {
    console.log("REPEAT clicked");
    // Insert your logic here
  };

  const handleNewCombo = () => {
    console.log("NEW COMBO clicked");
    // Insert your logic here
  };

  return (
    <div className="min-h-screen w-full bg-black flex flex-col items-center justify-center p-8">
      <h1 className="text-5xl text-white font-black mb-10">Analysis</h1>

      <div
        className="
          w-full
          max-w-4xl
          bg-gray-900
          rounded-lg
          p-8
          border-2
          border-[#6C63FF]/30
          flex
          flex-col
          md:flex-row
          items-start
          justify-between
        "
      >
        <div className="w-full md:w-1/2 md:pr-4 mb-8 md:mb-0">
          <h2 className="text-2xl text-white font-semibold mb-4">
            Comments from Mustafa (Our AI):
          </h2>
          <p className="text-gray-300">{aiComments}</p>
        </div>

        <div
          className="
            hidden
            md:block
            w-px
            bg-[#6C63FF]/30
            mx-4
          "
        />

        <div className="w-full md:w-1/2 md:pl-4">
          <h2 className="text-2xl text-white font-semibold mb-4">
            Analysis Details
          </h2>
          <p className="text-gray-300 mb-2">
            <span className="font-bold text-white">Total Calories Burnt:</span>{" "}
            {totalCalories}
          </p>
          <p className="text-gray-300">
            <span className="font-bold text-white">Seconds Total:</span>{" "}
            {totalSeconds}
          </p>
          <p className="text-gray-300">
            <span className="font-bold text-white">Weight:</span>{" "}
            {weight} LBS
          </p>
          <p className="text-gray-300">
            <span className="font-bold text-white">Selected Drill:</span>{" "}
            {selectedDrill}
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mt-8">
        <button
          onClick={handleRepeat}
          className="
            bg-[#6C63FF]
            text-white
            text-lg
            font-bold
            py-3
            px-8
            rounded-full
            transition-all
            hover:scale-105
            active:scale-95
          "
        >
          REPEAT
        </button>
        <button
          onClick={handleNewCombo}
          className="
            bg-[#6C63FF]
            text-white
            text-lg
            font-bold
            py-3
            px-8
            rounded-full
            transition-all
            hover:scale-105
            active:scale-95
          "
        >
          NEW COMBO
        </button>
      </div>
    </div>
  );
};

export default AnalysisPage;