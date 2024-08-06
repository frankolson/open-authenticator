import React from 'react';

interface Props {
  percent: number;
}

export default function ExpirationTimer({ percent }: Props) {
  const SIZE = 50;

  function Circle({ color, percentage }: { color: string, percentage?: number }) {
    const radius = SIZE/4;
    const circumference = 2 * Math.PI * radius;
    const strokePercent = ((100 - (percentage || 100)) / 100) * circumference;

    return (
      <circle
        r={radius}
        cx={SIZE/2}
        cy={SIZE/2}
        fill="transparent"
        // remove colour as 0% sets full circumference
        stroke={strokePercent !== circumference ? color : ""} 
        strokeWidth={"0.25rem"}
        strokeDasharray={circumference}
        strokeDashoffset={percentage ? strokePercent : 0}
      />
    )
  }
  
  return (
    <svg width={SIZE} height={SIZE}>
      <g transform={`rotate(-90 ${SIZE/2} ${SIZE/2})`}>
        <Circle color="lightgrey" />
        <Circle
          color={percent > 25 ? "green" : "red"}
          percentage={percent}
        />
      </g>
    </svg>
  );
}