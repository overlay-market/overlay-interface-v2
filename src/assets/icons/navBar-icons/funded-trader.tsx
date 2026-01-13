import { FC } from "react";

export const FundedTraderIcon: FC<{ size?: number }> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <path
      d="M2.5 4.5C2.5 3.67157 3.17157 3 4 3H12C12.8284 3 13.5 3.67157 13.5 4.5V5.5H2.5V4.5Z"
      stroke="#ECECEC"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2.5 5.5H13.5V11.5C13.5 12.3284 12.8284 13 12 13H4C3.17157 13 2.5 12.3284 2.5 11.5V5.5Z"
      stroke="#ECECEC"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle
      cx="10"
      cy="8.5"
      r="1"
      stroke="#ECECEC"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5 8.5H7"
      stroke="#ECECEC"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const FundedTraderActiveIcon: FC<{ size?: number }> = ({
  size = 16,
}) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <path
      d="M2.5 4.5C2.5 3.67157 3.17157 3 4 3H12C12.8284 3 13.5 3.67157 13.5 4.5V5.5H2.5V4.5Z"
      stroke="url(#paint0_linear_funded)"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2.5 5.5H13.5V11.5C13.5 12.3284 12.8284 13 12 13H4C3.17157 13 2.5 12.3284 2.5 11.5V5.5Z"
      stroke="url(#paint0_linear_funded)"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle
      cx="10"
      cy="8.5"
      r="1"
      stroke="url(#paint0_linear_funded)"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5 8.5H7"
      stroke="url(#paint0_linear_funded)"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <defs>
      <linearGradient
        id="paint0_linear_funded"
        x1="2.5"
        y1="8"
        x2="13.5"
        y2="8"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FFC955" />
        <stop offset="1" stopColor="#FF7CD5" />
      </linearGradient>
    </defs>
  </svg>
);
