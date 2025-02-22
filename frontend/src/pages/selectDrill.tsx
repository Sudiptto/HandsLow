import React, { useState, useEffect } from 'react';
import { ChevronDown, Play } from 'lucide-react';

interface DrillSelectorProps {
  initialWeight?: string;
}

const DrillSelector: React.FC<DrillSelectorProps> = ({ initialWeight }) => {
  // States for drill selection and dropdown
  const [selectedDrill, setSelectedDrill] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);
  
  // Available drills
  const drills = ['1x2', '1x12', '1x22', '2x1'];

  // Load stored weight from localStorage
  const weight = localStorage.getItem('userWeight') || initialWeight || '';

  return (
    <div className="min-h-screen w-full bg-black flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-md mx-auto text-center">
        <h1 className="text-5xl text-white font-black mb-8">Choose Drill</h1>
        
        {/* Weight display */}
        <div className="mb-6 text-white text-xl">
          Weight: {weight} LBS
        </div>

        {/* Custom dropdown */}
        <div className="relative mb-8">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="
              w-full
              bg-gray-800
              text-white
              rounded-lg
              py-3
              px-4
              flex
              items-center
              justify-between
              border-2
              border-[#6C63FF]/30
              focus:border-[#6C63FF]
              transition-all
            "
          >
            {selectedDrill || 'Select Drill'}
            <ChevronDown className={`
              transition-transform
              ${isOpen ? 'rotate-180' : ''}
            `} />
          </button>

          {/* Dropdown menu */}
          {isOpen && (
            <div className="
              absolute
              w-full
              mt-2
              bg-gray-800
              rounded-lg
              overflow-hidden
              border-2
              border-[#6C63FF]/30
              z-10
            ">
              {drills.map((drill) => (
                <button
                  key={drill}
                  onClick={() => {
                    setSelectedDrill(drill);
                    setIsOpen(false);
                  }}
                  className="
                    w-full
                    text-white
                    py-2
                    px-4
                    text-left
                    hover:bg-[#6C63FF]
                    transition-colors
                  "
                >
                  {drill}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Start button */}
        <button
          onClick={() => {
            if (selectedDrill) {
              console.log('Starting drill:', selectedDrill);
              // Navigate to upload drill page
              window.location.href = `/uploadDrill`;
            }
          }}
          disabled={!selectedDrill}
          className={`
            w-full
            py-4
            px-8
            rounded-lg
            font-bold
            text-xl
            flex
            items-center
            justify-center
            gap-2
            transition-all
            ${selectedDrill 
              ? 'bg-[#6C63FF] hover:bg-[#5a52d5] hover:scale-105 active:scale-95' 
              : 'bg-gray-600 cursor-not-allowed'}
            text-white
          `}
        >
          <Play />
          START
        </button>
      </div>
    </div>
  );
};

export default DrillSelector;