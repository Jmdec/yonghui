import { NextRequest, NextResponse } from "next/server";

const LARAVEL_API = process.env.LARAVEL_API_URL ?? "http://localhost:8000";

export async function GET(req: NextRequest) {
  try {
    const destRes = await fetch(`${LARAVEL_API}/api/destinations`);
    const destinations = await destRes.json();

    const destList = destinations.data || destinations;
    const allPlans = [];

    for (const destination of destList) {
      const plansRes = await fetch(
        `${LARAVEL_API}/api/destinations/${destination.slug}/plans`,
      );

      if (!plansRes.ok) continue;

      const plans = await plansRes.json();

      // ✅ Laravel returns { destination: {...}, plans: [...] }
      const plansList =
        plans.plans || plans.data || (Array.isArray(plans) ? plans : []);

      allPlans.push(
        ...plansList.map((plan: any) => ({
          ...plan,
          destination_id: destination.id,
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
