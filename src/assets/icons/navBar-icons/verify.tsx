import { FC } from "react";

export const VerifyIcon: FC<{ size?: number }> = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8 1.75L13 3.625V7.3125C13 10.4875 10.8625 13.45 8 14.25C5.1375 13.45 3 10.4875 3 7.3125V3.625L8 1.75Z"
      stroke="#ECECEC"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5.75 7.9375L7.25 9.4375L10.5 6.1875"
      stroke="#ECECEC"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const VerifyActiveIcon: FC<{ size?: number }> = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8 1.75L13 3.625V7.3125C13 10.4875 10.8625 13.45 8 14.25C5.1375 13.45 3 10.4875 3 7.3125V3.625L8 1.75Z"
      stroke="url(#verify_shield_gradient)"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5.75 7.9375L7.25 9.4375L10.5 6.1875"
      stroke="url(#verify_check_gradient)"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <defs>
      <linearGradient
        id="verify_shield_gradient"
        x1="3"
        y1="8"
        x2="13"
        y2="8"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FFC955" />
        <stop offset="1" stopColor="#FF7CD5" />
      </linearGradient>
      <linearGradient
        id="verify_check_gradient"
        x1="5.75"
        y1="7.8125"
        x2="10.5"
        y2="7.8125"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FFC955" />
        <stop offset="1" stopColor="#FF7CD5" />
      </linearGradient>
    </defs>
  </svg>
);
