import React from 'react';

export const CareerBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* 1. Subtle Radial Glow Orbs */}
      <div className="absolute -top-32 -left-32 w-[550px] h-[550px] bg-blue-400/10 rounded-full blur-3xl" />
      <div className="absolute top-[28%] -right-40 w-[600px] h-[600px] bg-indigo-400/8 rounded-full blur-3xl" />
      <div className="absolute top-[60%] left-[10%] w-[500px] h-[500px] bg-emerald-400/6 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 right-[20%] w-[550px] h-[550px] bg-blue-500/10 rounded-full blur-3xl" />

      {/* 2. Professional Grid Matrix Lines */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.035] stroke-slate-900"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="career-grid-pattern" width="56" height="56" patternUnits="userSpaceOnUse">
            <path d="M 56 0 L 0 0 0 56" fill="none" strokeWidth="1" />
            <circle cx="0" cy="0" r="1.5" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#career-grid-pattern)" />
      </svg>

      {/* 3. Subtle Vector Career Trajectory Lines (representing professional journey & growth) */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.05] pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M -100 200 C 300 150, 600 450, 1100 250 S 1600 600, 2100 400"
          fill="none"
          stroke="url(#gradient-path-1)"
          strokeWidth="2"
          strokeDasharray="6 6"
        />
        <path
          d="M -50 600 C 400 700, 800 350, 1300 550 S 1700 300, 2200 450"
          fill="none"
          stroke="url(#gradient-path-2)"
          strokeWidth="2"
        />
        <defs>
          <linearGradient id="gradient-path-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="50%" stopColor="#4f46e5" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="gradient-path-2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};
