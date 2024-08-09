import React from 'react';

interface Props {
  percent: number;
}

export default function ExpirationTimer({ percent }: Props) {
  const SIZE = 40;

  function Circle({ color, percentage }: { color: string, percentage?: number }) {
    const radius = SIZE/2 - 4;
    const circumference = 2 * Math.PI * radius;
    const strokePercent = ((100 - (percentage || 100)) / 100) * circumference;
    const strokeColor = strokePercent !== circumference ? color : "transparent";
    const strokeDashoffset = percentage !== undefined
      ? strokePercent === 0 ? circumference : strokePercent
      : 0;

    if (color !== "lightgrey") {
      console.log("Circumference: ", circumference);
      console.log("Stroke percent: ", strokePercent);
      console.log("Stroke Color: ", strokeColor);
      console.log("Stroke Dashoffset: ", strokeDashoffset);
      console.log("---")
    }

    return (
      <circle
        r={radius}
        cx={SIZE/2}
        cy={SIZE/2}
        fill="transparent"
        // remove colour as 0% sets full circumference
        stroke={strokeColor} 
        strokeWidth="4"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
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