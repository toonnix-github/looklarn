import React from 'react';
import { cn } from '../../utils/cn';
import { formatMatchScore } from '../../utils/formatters';

export function MatchScoreRing({
  score = 0,
  size = 'md',
  strokeWidth,
  showLabel = true,
  showSublabel = false,
  sublabel = 'Match',
  className = '',
}) {
  const sizeMap = {
    sm: { px: 52, defaultStroke: 4, textSize: 'text-xs font-bold', subTextSize: 'text-[9px]' },
    md: { px: 76, defaultStroke: 6, textSize: 'text-base font-extrabold', subTextSize: 'text-[10px]' },
    lg: { px: 96, defaultStroke: 8, textSize: 'text-xl font-extrabold', subTextSize: 'text-xs' },
    xl: { px: 124, defaultStroke: 10, textSize: 'text-2xl font-black', subTextSize: 'text-xs' },
  };

  const currentSizeConfig =
    typeof size === 'number'
      ? { px: size, defaultStroke: strokeWidth || 6, textSize: 'text-base font-bold', subTextSize: 'text-[10px]' }
      : sizeMap[size] || sizeMap.md;

  const dimension = currentSizeConfig.px;
  const stroke = strokeWidth || currentSizeConfig.defaultStroke;
  const radius = (dimension - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedScore = Math.min(100, Math.max(0, score));
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  const scoreMeta = formatMatchScore(clampedScore);

  return (
    <div
      className={cn('relative inline-flex items-center justify-center select-none shrink-0', className)}
      style={{ width: dimension, height: dimension }}
      role="progressbar"
      aria-valuenow={clampedScore}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Match score ${clampedScore} percent`}
    >
      <svg
        width={dimension}
        height={dimension}
        viewBox={`0 0 ${dimension} ${dimension}`}
        className="rotate-[-90deg] transform"
      >
        {/* Background track */}
        <circle
          cx={dimension / 2}
          cy={dimension / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-slate-100 dark:text-slate-800"
        />
        {/* Animated Progress circle */}
        <circle
          cx={dimension / 2}
          cy={dimension / 2}
          r={radius}
          fill="none"
          stroke={scoreMeta.hexColor}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className={cn('text-slate-900 tracking-tight leading-none', currentSizeConfig.textSize)}>
            {clampedScore}%
          </span>
          {showSublabel && (
            <span className={cn('font-medium text-slate-500 uppercase tracking-wider mt-0.5', currentSizeConfig.subTextSize)}>
              {sublabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default MatchScoreRing;
