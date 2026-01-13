import { FC } from "react";

export const FundedTraderIcon: FC<{ size?: number }> = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8 2.5V13.5"
      stroke="#ECECEC"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.5 4.5C10.5 3.39543 9.60457 2.5 8.5 2.5H6.5C5.39543 2.5 4.5 3.39543 4.5 4.5C4.5 5.60457 5.39543 6.5 6.5 6.5H9.5C10.6046 6.5 11.5 7.39543 11.5 8.5V9.5C11.5 10.6046 10.6046 11.5 9.5 11.5H6.5C5.39543 11.5 4.5 10.6046 4.5 9.5"
      stroke="#ECECEC"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const FundedTraderActiveIcon: FC<{ size?: number }> = ({
  size = 16,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8 2.5V13.5"
      stroke="url(#paint0_linear_funded)"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.5 4.5C10.5 3.39543 9.60457 2.5 8.5 2.5H6.5C5.39543 2.5 4.5 3.39543 4.5 4.5C4.5 5.60457 5.39543 6.5 6.5 6.5H9.5C10.6046 6.5 11.5 7.39543 11.5 8.5V9.5C11.5 10.6046 10.6046 11.5 9.5 11.5H6.5C5.39543 11.5 4.5 10.6046 4.5 9.5"
      stroke="url(#paint1_linear_funded)"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <defs>
      <linearGradient
        id="paint0_linear_funded"
        x1="8"
        y1="2.5"
        x2="8"
        y2="13.5"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FFC955" />
        <stop offset="1" stopColor="#FF7CD5" />
      </linearGradient>
      <linearGradient
        id="paint1_linear_funded"
        x1="4.5"
        y1="7"
        x2="11.5"
        y2="7"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FFC955" />
        <stop offset="1" stopColor="#FF7CD5" />
      </linearGradient>
    </defs>
  </svg>
);
