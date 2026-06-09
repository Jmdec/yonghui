import { NextRequest, NextResponse } from "next/server";

const LARAVEL_API = process.env.LARAVEL_API_URL ?? "http://localhost:8000";

export async function GET(req: NextRequest) {
  try {
    // Get all destinations first
    const destRes = await fetch(`${LARAVEL_API}/api/destinations`);
    const destText = await destRes.text();
    const destinations = JSON.parse(destText);

    // Fetch plans for each destination
    const allPlans = [];
    for (const destination of destinations.data || destinations) {
      const plansRes = await fetch(
        `${LARAVEL_API}/api/destinations/${destination.id}/plans`,
      );
      const plansText = await plansRes.text();
      const plans = JSON.parse(plansText);

      const plansList = Array.isArray(plans) ? plans : plans.data || [];
      allPlans.push(
        ...plansList.map((plan: any) => ({
          ...plan,
          destination_name: destination.name,
          destination_slug: destination.slug,
        })),
      );
    }

    return NextResponse.json({ data: allPlans });
  } catch (err) {
    console.error("PLANS API ERROR:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
