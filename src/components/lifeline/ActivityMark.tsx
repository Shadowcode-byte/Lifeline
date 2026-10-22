export default function ActivityMark() {
  return (
    <svg
      width="21"
      height="12"
      viewBox="0 0 21 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M1 6H5L7.2 2L10.2 10L13.1 4.2L15.2 6H20"
        stroke="url(#lifeline-gradient)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <defs>
        <linearGradient
          id="lifeline-gradient"
          x1="1"
          y1="6"
          x2="20"
          y2="6"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#00A8E8" />
          <stop offset="1" stopColor="#FF2E88" />
        </linearGradient>
      </defs>
    </svg>
  );
}