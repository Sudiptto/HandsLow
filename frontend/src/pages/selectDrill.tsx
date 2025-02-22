import React, { useState, useEffect } from 'react';
import { ChevronDown, Play } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

interface DrillSelectorProps {
  initialWeight?: string;
}

const DrillSelector: React.FC<DrillSelectorProps> = ({ initialWeight }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedDrill, setSelectedDrill] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);
  
  const drills = ['1x2', '1x12', '1x22', '2x1'];
  const weight = location.state?.weight || localStorage.getItem('userWeight') || initialWeight || '';

  const handleStartClick = () => {
    if (selectedDrill) {
      console.log('Starting drill:', selectedDrill);
      navigate('/uploadDrill', { state: { weight, selectedDrill } });
    }
  };

  return (
    <div className="min-h-screen w-full bg-black flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-md mx-auto text-center">
        <h1 className="text-5xl text-white font-black mb-8">Choose Drill</h1>
        
        <div className="mb-6 text-white text-xl">
          Weight: {weight} LBS
        </div>

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

        <button
          onClick={handleStartClick}
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