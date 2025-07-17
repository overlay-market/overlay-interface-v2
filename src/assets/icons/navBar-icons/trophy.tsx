import { FC } from "react";

export const TrophyIcon: FC<{ size?: number }> = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8 11.125C6.954 11.125 6.04357 11.9156 5.57354 13.082C5.34904 13.6391 5.67118 14.25 6.09923 14.25H9.90075C10.3288 14.25 10.6509 13.6391 10.4264 13.082C9.95644 11.9156 9.046 11.125 8 11.125Z"
      stroke="#ECECEC"
      strokeLinecap="round"
    />
    <path
      d="M12.0625 3.625H12.8139C13.5644 3.625 13.9397 3.625 14.1355 3.86085C14.3312 4.0967 14.2499 4.45071 14.0871 5.15872L13.8428 6.22067C13.4756 7.81788 12.1318 9.0055 10.5 9.25"
      stroke="#ECECEC"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3.9375 3.625H3.18612C2.43558 3.625 2.06031 3.625 1.86453 3.86085C1.66874 4.0967 1.75015 4.45071 1.91297 5.15872L2.15718 6.22067C2.52446 7.81788 3.8682 9.0055 5.5 9.25"
      stroke="#ECECEC"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 11.125C9.888 11.125 11.4781 8.21119 11.9561 4.24431C12.0883 3.14724 12.1544 2.59871 11.8042 2.17435C11.4542 1.75 10.8889 1.75 9.75838 1.75H6.24161C5.11109 1.75 4.54583 1.75 4.19573 2.17435C3.84563 2.59871 3.91172 3.14724 4.04391 4.24431C4.52188 8.21119 6.11202 11.125 8 11.125Z"
      stroke="#ECECEC"
      strokeLinecap="round"
    />
  </svg>
);

export const TrophyActiveIcon: FC<{ size?: number }> = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8 11.125C6.954 11.125 6.04357 11.9156 5.57354 13.082C5.34904 13.6391 5.67118 14.25 6.09923 14.25H9.90075C10.3288 14.25 10.6509 13.6391 10.4264 13.082C9.95644 11.9156 9.046 11.125 8 11.125Z"
      stroke="url(#paint0_linear_2128_4423)"
      strokeLinecap="round"
    />
    <path
      d="M12.0625 3.625H12.8139C13.5644 3.625 13.9397 3.625 14.1355 3.86085C14.3312 4.0967 14.2499 4.45071 14.0871 5.15872L13.8428 6.22067C13.4756 7.81788 12.1318 9.0055 10.5 9.25"
      stroke="url(#paint1_linear_2128_4423)"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3.9375 3.625H3.18612C2.43558 3.625 2.06031 3.625 1.86453 3.86085C1.66874 4.0967 1.75015 4.45071 1.91297 5.15872L2.15718 6.22067C2.52446 7.81788 3.8682 9.0055 5.5 9.25"
      stroke="url(#paint2_linear_2128_4423)"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 11.125C9.888 11.125 11.4781 8.21119 11.9561 4.24431C12.0883 3.14724 12.1544 2.59871 11.8042 2.17435C11.4542 1.75 10.8889 1.75 9.75838 1.75H6.24161C5.11109 1.75 4.54583 1.75 4.19573 2.17435C3.84563 2.59871 3.91172 3.14724 4.04391 4.24431C4.52188 8.21119 6.11202 11.125 8 11.125Z"
      stroke="url(#paint3_linear_2128_4423)"
      strokeLinecap="round"
    />
    <defs>
      <linearGradient
        id="paint0_linear_2128_4423"
        x1="5.5"
        y1="12.6875"
        x2="10.5"
        y2="12.6875"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FFC955" />
        <stop offset="1" stopColor="#FF7CD5" />
      </linearGradient>
      <linearGradient
        id="paint1_linear_2128_4423"
        x1="10.5"
        y1="6.4375"
        x2="14.25"
        y2="6.4375"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FFC955" />
        <stop offset="1" stopColor="#FF7CD5" />
      </linearGradient>
      <linearGradient
        id="paint2_linear_2128_4423"
        x1="1.75"
        y1="6.4375"
        x2="5.5"
        y2="6.4375"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FFC955" />
        <stop offset="1" stopColor="#FF7CD5" />
      </linearGradient>
      <linearGradient
        id="paint3_linear_2128_4423"
        x1="3.9375"
        y1="6.4375"
        x2="12.0625"
        y2="6.4375"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FFC955" />
        <stop offset="1" stopColor="#FF7CD5" />
      </linearGradient>
    </defs>
  </svg>
);
