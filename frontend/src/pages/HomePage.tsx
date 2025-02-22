import React, { useState } from 'react';
import { Dumbbell, ArrowRight } from 'lucide-react';

// Type definitions for our components
interface ButtonProps {
    children: React.ReactNode;
    icon?: React.ReactNode;
    size?: 'sm' | 'md' | 'lg';
    onClick?: () => void;
}

interface TitleProps {
    text: React.ReactNode;
    subtitle?: React.ReactNode;
}

// Custom button component with optional icon support
const CustomButton: React.FC<ButtonProps> = ({ 
    children, 
    icon,
    size = 'lg',
    onClick 
}) => {
    // Map of size classes for button styling
    const sizeClasses = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-xl'
    };

    return (
        <button
            onClick={onClick}
            className={`
                ${sizeClasses[size]}
                bg-[#6C63FF]
                text-white
                rounded-lg
                font-bold
                transition-all
                duration-200
                shadow-lg
                hover:bg-[#5a52d5]
                hover:scale-105
                active:scale-95
                flex
                items-center
                gap-2
            `}
        >
            {/* Render icon if provided */}
            {icon && <span className="w-6 h-6">{icon}</span>}
            {children}
        </button>
    );
};

// Title component for the main heading and subtitle
const Title: React.FC<TitleProps> = ({ text, subtitle }) => (
    <div className="text-center mb-8">
        <h1 className="text-7xl text-white font-black mb-3 tracking-wider flex items-center justify-center gap-3">
            {text}
        </h1>
        {subtitle && (
            <p className="text-white text-2xl font-bold tracking-wide">
                {subtitle}
            </p>
        )}
    </div>
);

// Main application component
export default function Demo() {
    // State for weight input
    const [weight, setWeight] = useState<string>('');

    // Handler for weight input changes
    const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setWeight(e.target.value);
    };

    return (
        // Main container with full screen black background
        <div className="min-h-screen w-full bg-black flex flex-col items-center justify-center p-8">
            <div className="w-full max-w-2xl mx-auto">
                {/* Title section without heart icon */}
                <Title 
                    text="HandsLOW" 
                    subtitle="Don't get clipped!" 
                />
                
                {/* Weight input field */}
                <input
                    type="number"
                    placeholder="Enter weight (in LBS)"
                    value={weight}
                    onChange={handleWeightChange}
                    className="
                        w-full
                        max-w-md
                        mx-auto
                        mb-12
                        px-6
                        py-4
                        text-xl
                        text-center
                        rounded-lg
                        bg-gray-800
                        text-white
                        placeholder-gray-400
                        border-2
                        border-[#6C63FF]/30
                        focus:border-[#6C63FF]
                        focus:outline-none
                        transition-all
                        duration-200
                        shadow-lg
                        block
                    "
                />
                
                {/* Button container with OR divider */}
                <div className="flex items-center justify-center gap-8">
                    {/* Drills button with dumbbell icon */}
                    <CustomButton 
                        icon={<Dumbbell className="text-white" />} 
                        onClick={() => window.location.href = '/selectDrill'}
                    >
                        DRILLS
                    </CustomButton>
                    
                    {/* OR divider with arrow icon */}
                    <div className="flex items-center gap-2">
                        <span className="text-white text-5xl font-bold">OR</span>
                        <ArrowRight className="text-[#6C63FF] w-8 h-8" />
                    </div>
                    
                    {/* Live coach button */}
                    <CustomButton>LIVE-COACH</CustomButton>
                </div>
            </div>
        </div>
    );
}
