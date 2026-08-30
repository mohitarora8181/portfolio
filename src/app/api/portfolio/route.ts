import { NextResponse } from "next/server";
import { fetchPortfolioDataFromFirebase } from "@/src/services/firebasePortfolio";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await fetchPortfolioDataFromFirebase();

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Failed to load portfolio data for the launch page.", error);

    return NextResponse.json(
      { error: "Unable to load portfolio data." },
      { status: 502 },
    );
  }
}
