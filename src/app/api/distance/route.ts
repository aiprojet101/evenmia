import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const origin = searchParams.get("origin");
  const destination = searchParams.get("destination");

  if (!origin || !destination) {
    return NextResponse.json({ error: "origin and destination required" }, { status: 400 });
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Google Maps API key not configured" }, { status: 500 });
  }

  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&language=fr&key=${apiKey}`;

  const res = await fetch(url);
  const data = await res.json();

  if (data.rows?.[0]?.elements?.[0]?.status === "OK") {
    const element = data.rows[0].elements[0];
    return NextResponse.json({
      distanceKm: Math.round(element.distance.value / 1000),
      duration: element.duration.text,
    });
  }

  return NextResponse.json({ error: "Could not calculate distance" }, { status: 400 });
}
