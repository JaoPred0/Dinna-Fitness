import React from 'react';

const Watermark = () => (
  <div className="fixed bottom-2 right-2 z-50 sm:bottom-4 sm:right-4">
    <a
      href="https://github.com/JaoPred0" 
      target="_blank" 
      rel="noopener noreferrer"
    >
      <div className="flex items-center gap-1 bg-black text-white rounded-[5px] px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm font-medium shadow-lg opacity-60 sm:opacity-70 pointer-events-none select-none">
        <span>Programa em andamento, feito por</span>
        <span className="font-bold">JoaoPred0</span>
      </div>
    </a>
  </div>
);

export default Watermark;
