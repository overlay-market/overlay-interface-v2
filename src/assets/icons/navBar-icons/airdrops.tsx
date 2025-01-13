import { FC } from "react";

export const AirdropsIcon: FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    stroke="#ECECEC"
    strokeWidth="0.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="8" cy="8" r="4" />

    <path d="M3.5 8c-1.7 0-2.7-1.7-2.7-1.7s1-1.7 2.7-1.7" />
    <path d="M12.5 8c1.7 0 2.7-1.7 2.7-1.7s-1-1.7-2.7-1.7" />

    <path d="M5.5 13v1" />
    <path d="M8 12.5v3.5" />
    <path d="M10.5 13v1" />
  </svg>
);

export const AirdropsActiveIcon: FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    stroke="url(#paint0_linear_212_3620)"
    strokeWidth="0.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="8" cy="8" r="4" />

    <path d="M3.5 8c-1.7 0-2.7-1.7-2.7-1.7s1-1.7 2.7-1.7" />
    <path d="M12.5 8c1.7 0 2.7-1.7 2.7-1.7s-1-1.7-2.7-1.7" />

    <path d="M5.5 13v1" />
    <path d="M8 12.5v3.5" />
    <path d="M10.5 13v1" />
    <defs>
      <linearGradient
        id="paint0_linear_212_3620"
        x1="2.04688"
        y1="8.00005"
        x2="13.95"
        y2="8.00005"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FFC955" />
        <stop offset="1" stopColor="#FF7CD5" />
      </linearGradient>
    </defs>
  </svg>
);
