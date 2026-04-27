'use client';
import React from 'react';

interface IndicatorProps {
  isActive: boolean;
}

const Indicator: React.FC<IndicatorProps> = ({ isActive }) => {
  // CONDITIONAL RENDERING: HIDE IF NOT ACTIVE
  if (!isActive) return null;

  return (
    // INDICATOR CONTAINER (CENTERED OVERLAY)
    <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
      {/* OUTER CIRCLE */}
      <span className="absolute w-4 h-4 border-white border-2 rounded-full" />

      {/* PULSE ANIMATION */}
      <span className="absolute w-6 h-6 rounded-full bg-white opacity-40 animate-ping" />

      {/* CENTER DOT */}
      <span className="absolute w-1 h-1 bg-white rounded-full" />
    </div>
  );
};

export default Indicator;
