export const BuntingOverlay = () => {
  return (
    <svg className="bunting-overlay bunting-svg" viewBox="0 0 1000 350" preserveAspectRatio="none">
      {/* TOP ROW */}
      <g className="row-top">
        <path className="string" d="M -10,40 Q 500,150 1010,40" />
        <g transform="translate(0, 0)">
        {/* Pattern: Pink -> Yellow -> Red -> Blue */}
        <polygon className="flag-pink" points="40,55 90,58 65,110" />
        <polygon className="flag-yellow" points="120,68 170,72 145,125" />
        <polygon className="flag-red" points="200,80 250,85 225,138" />
        <polygon className="flag-blue" points="280,92 330,95 305,148" />

        <polygon className="flag-pink" points="360,98 410,100 385,153" />
        <polygon className="flag-yellow" points="440,102 490,102 465,155" />
        <polygon className="flag-blue" points="520,102 570,100 545,153" />
        <polygon className="flag-red" points="600,98 650,94 625,147" />

        <polygon className="flag-pink" points="680,90 730,83 705,136" />
        <polygon className="flag-yellow" points="760,78 810,70 785,123" />
        <polygon className="flag-red" points="840,65 890,55 865,108" />
        </g>
      </g>

      {/* BOTTOM ROW removed for all viewports to keep single string */}
    </svg>
  );
};
