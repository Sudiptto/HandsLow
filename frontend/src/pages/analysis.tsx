import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { IoMdFitness } from "react-icons/io";
import { FaFireAlt, FaClock, FaDumbbell, FaRunning } from "react-icons/fa";

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
  const navigate = useNavigate();
  const weight = location.state?.weight || '';
  const selectedDrill = location.state?.selectedDrill || '';
  const analysisData = location.state?.analysisData || {};

  const handleRepeat = () => navigate('/workout', { state: { selectedDrill } });
  const handleNewCombo = () => navigate('/drills');

  return (
    <div className="min-h-screen w-full bg-[#0A0F1C]">
      {/* Decorative Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20" />
      <div className="fixed inset-0 bg-[url('/grid.svg')] opacity-20" />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="w-full bg-[#0A0F1C]/80 backdrop-blur-xl py-6 fixed top-0 z-20 border-b border-white/5">
  <div className="container mx-auto px-4">
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ 
        opacity: 1,
        scale: 1,
      }}
      transition={{
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1]
      }}
    >
      <motion.h1 
        className="text-3xl md:text-5xl text-white font-black text-center"
      >
        {/* Split text animation */}
        <motion.span
          initial={{ backgroundPosition: "0% 50%" }}
          animate={{ backgroundPosition: "100% 50%" }}
          transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
          className="bg-gradient-to-r from-purple-400 via-fuchsia-500 to-blue-400 bg-clip-text text-transparent bg-[length:200%]"
        >
          Workout Analysis
        </motion.span>
      </motion.h1>
      
      {/* Optional subtitle with stagger effect */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-gray-400 text-sm md:text-base text-center mt-2"
      >
        Let's review your performance
      </motion.p>
    </motion.div>
  </div>
</header>

        <main className="container mx-auto px-4 pt-28 pb-20 max-w-7xl">
          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Left Column - Video and Stats */}
            <div className="lg:col-span-7 space-y-6">
              {/* Video Section */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#151A2D] rounded-2xl p-6 shadow-xl border border-white/5"
              >
                <h2 className="text-xl text-white font-semibold mb-4 flex items-center">
                  <IoMdFitness className="mr-2 text-purple-400" />
                  Workout Replay
                </h2>
                <div className="rounded-xl overflow-hidden bg-black/50 shadow-inner">
                  <video 
                    className="w-full h-full object-cover"
                    controls
                    src={analysisData.correctVideo}
                  />
                </div>
              </motion.div>

              {/* Stats Grid */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-2 gap-4"
              >
                {[
                  { icon: FaFireAlt, label: "Calories", value: `12 kcal` },
                  { icon: FaClock, label: "Duration", value: `${totalSeconds}s` },
                  { icon: FaDumbbell, label: "Weight", value: `${weight} LBS` },
                  { icon: FaRunning, label: "Drill", value: "Jab" },
                ].map((stat, index) => (
                  <div key={index} className="bg-[#151A2D] rounded-xl p-4 border border-white/5">
                    <div className="flex items-center space-x-3">
                      <stat.icon className="text-purple-400 text-xl" />
                      <div>
                        <p className="text-gray-400 text-sm">{stat.label}</p>
                        <p className="text-white font-bold truncate">{stat.value}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right Column - AI Analysis */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-5"
            >
              <div className="bg-[#151A2D] rounded-2xl p-6 border border-white/5 sticky top-28">
                <div className="flex items-center mb-6 space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🤖</span>
                  </div>
                  <h2 className="text-2xl text-white font-bold">AI Analysis</h2>
                </div>
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300 leading-relaxed">
                    Wow! This is a great start! You did a good job with the jab but it does seem that you are getting slower as you go on. Try to keep your pace consistent and focus on your form. You are doing great! Keep it up! Some drills you can do to improve your jab and range are the following:
                    Keep your hands out a little, bounce up and down head off center line. Most imporantly be consistent with your pace and form. You are doing great! Keep it up! OSU!

                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Action Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row justify-center gap-4 mt-12"
          >
            <button
              onClick={handleRepeat}
              className="group relative px-8 py-4 overflow-hidden rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold text-lg transition-all hover:scale-105 active:scale-95"
            >
              <span className="relative z-10">Repeat Workout</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 transition-transform duration-300 ease-out -translate-x-full group-hover:translate-x-0" />
            </button>
            <button
              onClick={handleNewCombo}
              className="px-8 py-4 rounded-xl bg-white/5 text-white font-bold text-lg border border-white/10 transition-all hover:bg-white/10 hover:scale-105 active:scale-95"
            >
              New Combo
            </button>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AnalysisPage;