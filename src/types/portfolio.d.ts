import type { PortfolioData } from "@/src/services/portfolioData";

declare global {
  interface Window {
    __PORTFOLIO_DATA__?: PortfolioData;
  }
}

export {};
