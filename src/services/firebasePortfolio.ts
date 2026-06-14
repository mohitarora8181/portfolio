import portfolioJson from "@/myData.json";
import type { PortfolioData } from "./portfolioData";

const PORTFOLIO_DATABASE_URL =
  "https://portfolio-mohit8181-default-rtdb.firebaseio.com/.json";

export async function fetchPortfolioDataFromFirebase(): Promise<PortfolioData> {
  try {
    const response = await fetch(PORTFOLIO_DATABASE_URL, { cache: "no-store" });

    if (!response.ok) {
      return portfolioJson;
    }

    const data = (await response.json()) as PortfolioData | null;
    return data ?? portfolioJson;
  } catch {
    return portfolioJson;
  }
}
