import { FC } from "react";

export const MarketsIcon: FC<{ size?: number }> = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M13.625 13.625H6.75C4.68761 13.625 3.65641 13.625 3.01571 12.9843C2.375 12.3436 2.375 11.3124 2.375 9.25V2.375"
      stroke="#ECECEC"
      strokeLinecap="round"
    />
    <path
      d="M11.5655 6.33333L9.76944 9.24031C9.50769 9.66394 9.21056 10.3037 8.67181 10.209C8.03819 10.0975 7.73387 9.15306 7.18912 8.84031C6.74553 8.58569 6.42482 8.89256 6.16547 9.25M13.625 3L12.4666 4.875M3.625 13L5.20395 10.6667"
      stroke="#ECECEC"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const MarketsActiveIcon: FC<{ size?: number }> = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M13.625 13.625H6.75C4.68761 13.625 3.65641 13.625 3.01571 12.9843C2.375 12.3436 2.375 11.3124 2.375 9.25V2.375"
      stroke="url(#paint0_linear_2585_4242)"
      strokeLinecap="round"
    />
    <path
      d="M11.5655 6.33333L9.76944 9.24031C9.50769 9.66394 9.21056 10.3037 8.67181 10.209C8.03819 10.0975 7.73387 9.15306 7.18912 8.84031C6.74553 8.58569 6.42482 8.89256 6.16547 9.25M13.625 3L12.4666 4.875M3.625 13L5.20395 10.6667"
      stroke="url(#paint1_linear_2585_4242)"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <defs>
      <linearGradient
        id="paint0_linear_2585_4242"
        x1="2.375"
        y1="8"
        x2="13.625"
        y2="8"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FFC955" />
        <stop offset="1" stopColor="#FF7CD5" />
      </linearGradient>
      <linearGradient
        id="paint1_linear_2585_4242"
        x1="3.625"
        y1="8"
        x2="13.625"
        y2="8"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FFC955" />
        <stop offset="1" stopColor="#FF7CD5" />
      </linearGradient>
    </defs>
  </svg>
);
