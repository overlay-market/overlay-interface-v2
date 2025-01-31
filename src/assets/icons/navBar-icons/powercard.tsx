import { FC } from "react";

export const PowercardIcon: FC<{ size?: number }> = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5.5 2.5C5.22386 2.5 5 2.72386 5 3V13C5 13.2761 5.22386 13.5 5.5 13.5H11.5C11.7761 13.5 12 13.2761 12 13V3C12 2.72386 11.7761 2.5 11.5 2.5H5.5ZM4 3C4 2.17157 4.67157 1.5 5.5 1.5H11.5C12.3284 1.5 13 2.17157 13 3V13C13 13.8284 12.3284 14.5 11.5 14.5H5.5C4.67157 14.5 4 13.8284 4 13V3Z"
      fill="#ECECEC"
    />
    <path
      d="M8.49982 5.13135L10.156 7.99997H6.84362L8.49982 5.13135Z"
      fill="#ECECEC"
    />
    <path
      d="M8.50018 10.8687L6.84398 8.00003L10.1564 8.00003L8.50018 10.8687Z"
      fill="#ECECEC"
    />
  </svg>
);

export const PowercardActiveIcon: FC<{ size?: number }> = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5.5 2.5C5.22386 2.5 5 2.72386 5 3V13C5 13.2761 5.22386 13.5 5.5 13.5H11.5C11.7761 13.5 12 13.2761 12 13V3C12 2.72386 11.7761 2.5 11.5 2.5H5.5ZM4 3C4 2.17157 4.67157 1.5 5.5 1.5H11.5C12.3284 1.5 13 2.17157 13 3V13C13 13.8284 12.3284 14.5 11.5 14.5H5.5C4.67157 14.5 4 13.8284 4 13V3Z"
      fill="url(#paint0_linear_212_3620)"
    />
    <path
      d="M8.49982 5.13135L10.156 7.99997H6.84362L8.49982 5.13135Z"
      fill="url(#paint0_linear_212_3620)"
    />
    <path
      d="M8.50018 10.8687L6.84398 8.00003L10.1564 8.00003L8.50018 10.8687Z"
      fill="url(#paint0_linear_212_3620)"
    />
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
