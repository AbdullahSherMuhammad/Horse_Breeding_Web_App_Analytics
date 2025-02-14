import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const eventId = searchParams.get('eventId');
  const compId = searchParams.get('comp') || '1';

  if (!eventId) {
    return NextResponse.json(
      { error: 'Missing query parameter: eventId (e.g. IS2022LM0191)' },
      { status: 400 }
    );
  }

  try {
    const loginResponse = await fetch('https://sportfengur.com/api/v1/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: process.env.SPORTFENGUR_USER,
        password: process.env.SPORTFENGUR_PASS,
      }),
    });

    if (!loginResponse.ok) {
      throw new Error(`Login failed: ${loginResponse.statusText}`);
    }
    const loginData = await loginResponse.json();
    const token = loginData.token;

    const eventSearchURL = `https://sportfengur.com/api/v1/en/events/search?motsnumer=${eventId}`;
    const eventSearchResponse = await fetch(eventSearchURL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!eventSearchResponse.ok) {
      throw new Error(`Event search failed: ${eventSearchResponse.statusText}`);
    }
    const eventSearchData = await eventSearchResponse.json();
    const eventNumer = eventSearchData?.tournaments?.[0]?.numer;
    if (!eventNumer) {
      throw new Error(`No internal event numer found for ev+1 entId: ${eventId}`);
    }

    const startingListURL = `https://sportfengur.com/api/v1/en/startinglist/${eventNumer}/${compId}`;
    const startingListResponse = await fetch(startingListURL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!startingListResponse.ok) {
      throw new Error(`Starting list fetch failed: ${startingListResponse.statusText}`);
    }
    const startingListData = await startingListResponse.json();

    const raslisti = startingListData.raslisti || [];
    const feifIds = raslisti.map((entry: { hross_faedingarnumer: string }) => entry.hross_faedingarnumer);

    return NextResponse.json({ feifIds }, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
