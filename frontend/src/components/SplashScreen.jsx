import React from 'react';

const SplashScreen = () => {
  return (
    <div className="min-h-screen bg-[#f7efe6] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3b2a20] mx-auto mb-4"></div>
        <p className="text-[#3b2a20] text-lg">Loading Churchly...</p>
      </div>
    </div>
  );
};

export default SplashScreen;