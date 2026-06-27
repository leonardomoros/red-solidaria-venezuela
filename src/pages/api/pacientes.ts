import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async () => {
  const sheetId = process.env.GOOGLE_SHEETS_ID ?? import.meta.env.GOOGLE_SHEETS_ID;
  const apiKey = process.env.GOOGLE_SHEETS_API_KEY ?? import.meta.env.GOOGLE_SHEETS_API_KEY;
  const range = process.env.GOOGLE_SHEETS_RANGE ?? import.meta.env.GOOGLE_SHEETS_RANGE ?? 'Pacientes!A:H';

  if (!sheetId || !apiKey) {
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(range)}?key=${apiKey}`;
    const res = await fetch(url);

    if (!res.ok) {
      const text = await res.text();
      console.error('[/api/pacientes] Sheets error:', res.status, text);
      return new Response(JSON.stringify([]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const data = await res.json();
    const rows = (data.values || []) as string[][];

    const patients = rows
      .slice(1)
      .filter(row => row[2]?.trim())
      .map((row, i) => ({
        n: i + 1,
        h: (row[1] || '').trim(),
        nm: (row[2] || '').trim().toUpperCase(),
        e: (row[3] || '').trim(),
        c: (row[4] || '').trim(),
        t: (row[5] || '').trim(),
        d: (row[6] || '').trim(),
        o: (row[7] || '').trim(),
      }));

    return new Response(JSON.stringify(patients), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 's-maxage=300, stale-while-revalidate=60',
      }
    });
  } catch (err) {
    console.error('[/api/pacientes]', err);
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
