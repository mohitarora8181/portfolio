import type { PortfolioData } from "./portfolioData";

const PORTFOLIO_DATABASE_URL =
  "https://portfolio-mohit8181-default-rtdb.firebaseio.com/.json";

export async function fetchPortfolioDataFromFirebase(): Promise<PortfolioData> {
  const response = await fetch(PORTFOLIO_DATABASE_URL, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(
      `Firebase portfolio request failed: ${response.status} ${response.statusText}`
    );
  }

  const data = (await response.json()) as PortfolioData | null;

  if (!data) {
    throw new Error("Firebase portfolio data is empty.");
  }

  return data;
}
