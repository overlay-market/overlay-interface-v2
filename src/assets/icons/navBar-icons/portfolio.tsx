import { FC } from "react";

export const PortfolioIcon: FC<{ size?: number }> = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2.375 7.375L2.47055 9.39181C2.57321 11.5429 2.62454 12.6184 3.34928 13.2779C4.07402 13.9375 5.20447 13.9375 7.46537 13.9375H8.53463C10.7955 13.9375 11.926 13.9375 12.6508 13.2779C13.3754 12.6184 13.4268 11.5429 13.5294 9.39181L13.625 7.375"
      stroke="#ECECEC"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2.27949 7.02694C3.34155 9.0465 5.737 9.875 8 9.875C10.263 9.875 12.6584 9.0465 13.7205 7.02694C14.2275 6.06285 13.8436 4.25 12.595 4.25H3.405C2.15639 4.25 1.77252 6.06285 2.27949 7.02694Z"
      stroke="#ECECEC"
    />
    <path
      d="M8 7.375H8.00562"
      stroke="#ECECEC"
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.5 4.25L10.4448 4.05684C10.1698 3.09431 10.0323 2.61304 9.70495 2.33777C9.37758 2.0625 8.94276 2.0625 8.07308 2.0625H7.92689C7.05726 2.0625 6.62242 2.0625 6.29506 2.33777C5.9677 2.61304 5.83019 3.09431 5.55519 4.05684L5.5 4.25"
      stroke="#ECECEC"
    />
  </svg>
);

export const PortfolioActiveIcon: FC<{ size?: number }> = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 17 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2.375 7.375L2.47055 9.39181C2.57321 11.5429 2.62454 12.6184 3.34928 13.2779C4.07402 13.9375 5.20447 13.9375 7.46537 13.9375H8.53463C10.7955 13.9375 11.926 13.9375 12.6508 13.2779C13.3754 12.6184 13.4268 11.5429 13.5294 9.39181L13.625 7.375"
      stroke="url(#paint0_linear_212_3620)"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2.27949 7.02694C3.34155 9.0465 5.737 9.875 8 9.875C10.263 9.875 12.6584 9.0465 13.7205 7.02694C14.2275 6.06285 13.8436 4.25 12.595 4.25H3.405C2.15639 4.25 1.77252 6.06285 2.27949 7.02694Z"
      stroke="url(#paint0_linear_212_3620)"
    />
    <path
      d="M8 7.375H8.00562"
      stroke="url(#paint0_linear_212_3620)"
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.5 4.25L10.4448 4.05684C10.1698 3.09431 10.0323 2.61304 9.70495 2.33777C9.37758 2.0625 8.94276 2.0625 8.07308 2.0625H7.92689C7.05726 2.0625 6.62242 2.0625 6.29506 2.33777C5.9677 2.61304 5.83019 3.09431 5.55519 4.05684L5.5 4.25"
      stroke="url(#paint0_linear_212_3620)"
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
