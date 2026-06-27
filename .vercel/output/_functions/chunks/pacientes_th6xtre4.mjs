import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
//#region src/pages/api/pacientes.ts
var pacientes_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	prerender: () => false
});
var GET = async () => {
	const sheetId = process.env.GOOGLE_SHEETS_ID ?? void 0;
	const apiKey = process.env.GOOGLE_SHEETS_API_KEY ?? void 0;
	const range = process.env.GOOGLE_SHEETS_RANGE ?? void 0 ?? "Pacientes!A:H";
	if (!sheetId || !apiKey) return new Response(JSON.stringify([]), {
		status: 200,
		headers: { "Content-Type": "application/json" }
	});
	try {
		const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(range)}?key=${apiKey}`;
		const res = await fetch(url);
		if (!res.ok) {
			const text = await res.text();
			console.error("[/api/pacientes] Sheets error:", res.status, text);
			return new Response(JSON.stringify([]), {
				status: 200,
				headers: { "Content-Type": "application/json" }
			});
		}
		const patients = ((await res.json()).values || []).slice(1).filter((row) => row[2]?.trim()).map((row, i) => ({
			n: i + 1,
			h: (row[1] || "").trim(),
			nm: (row[2] || "").trim().toUpperCase(),
			e: (row[3] || "").trim(),
			c: (row[4] || "").trim(),
			t: (row[5] || "").trim(),
			d: (row[6] || "").trim(),
			o: (row[7] || "").trim()
		}));
		return new Response(JSON.stringify(patients), {
			status: 200,
			headers: {
				"Content-Type": "application/json",
				"Cache-Control": "s-maxage=300, stale-while-revalidate=60"
			}
		});
	} catch (err) {
		console.error("[/api/pacientes]", err);
		return new Response(JSON.stringify([]), {
			status: 200,
			headers: { "Content-Type": "application/json" }
		});
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/pacientes@_@ts
var page = () => pacientes_exports;
//#endregion
export { page };
