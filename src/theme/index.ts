declare module "styled-components" {
  export interface DefaultTheme {
    color: {
      background: string;
      white: string;
      white1: string;
      white2: string;
      black: string;
      black2: string;
      green1: string;
      green2: string;
      green3: string;
      red: string;
      red1: string;
      red2: string;
      darkBlue: string;
      blue1: string;
      blue2: string;
      blue3: string;
      grey1: string;
      grey2: string;
      grey3: string;
      grey4: string;
      grey5: string;
      grey6: string;
      grey7: string;
      textSecondary: string;
    };
    headerSize: {
      width: string;
      height: string;
      tabletWidth: string;
      mobileHeight: string;
    };
    breakpoints: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      xxl: string;
    };
    app: {
      rightPadding: string;
      xxlPadding: string;
      mobilePadding: string;
    };
  }
}

const theme = {
  color: {
    background: "#171721",
    white: "#FFFFFF",
    white1: "#F0F0F0",
    white2: "#F8F8F8",
    black: "#000000",
    black2: "#373A44",
    green1: "#5FD0AB",
    green2: "#50FFB1",
    green3: "#96EE8F",
    red: "#FF0000",
    red1: "#FF648A",
    red2: "#FF8080",
    darkBlue: "#39456B",
    blue1: "#E5F6FF",
    blue2: "#71CEFF",
    blue3: "#12B4FF",
    grey1: "#F2F2F2",
    grey2: "#ECECEC",
    grey3: "#A8A6A6",
    grey4: "#252534",
    grey5: "#373A44",
    grey6: "#2E3343",
    grey7: "#111111",
    grey8: "#90A6BF",
    grey9: "#1F2538",
  },
  headerSize: {
    width: "88px",
    height: "52px",
    tabletWidth: "82px",
    mobileHeight: "64px",
  },
  breakpoints: {
    xs: "520px",
    sm: "768px",
    md: "1024px",
    lg: "1280px",
    xl: "1640px",
    xxl: "1920px",
  },
  app: {
    rightPadding: "16px",
    xxlPadding: "60px",
    mobilePadding: "16px",
  },
};

export default theme;
