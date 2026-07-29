export interface Env {
	BREVO_API_KEY: string;
}

const ALLOWED_ORIGINS = new Set(["https://skyxperts.com", "https://www.skyxperts.com"]);

const REASON_LABELS: Record<string, string> = {
	general: "General",
	sponsorship: "Sponsorship",
	partnership: "Partnership",
	media: "Media",
	"join-team": "Join the Team",
	other: "Other",
};

const RECIPIENT_EMAIL = "SkyXperts@aast.edu";

interface ContactPayload {
	name: string;
	email: string;
	reason: string;
	message: string;
}

function corsHeaders(origin: string | null): Record<string, string> {
	const allowOrigin = origin && ALLOWED_ORIGINS.has(origin) ? origin : "";
	return {
		"Access-Control-Allow-Origin": allowOrigin,
		"Access-Control-Allow-Methods": "POST, OPTIONS",
		"Access-Control-Allow-Headers": "Content-Type",
		Vary: "Origin",
	};
}

function jsonResponse(body: unknown, status: number, origin: string | null): Response {
	return new Response(JSON.stringify(body), {
		status,
		headers: {
			"Content-Type": "application/json",
			...corsHeaders(origin),
		},
	});
}

function isValidPayload(body: unknown): body is ContactPayload {
	if (typeof body !== "object" || body === null) return false;
	const b = body as Record<string, unknown>;
	return (
		typeof b.name === "string" &&
		b.name.trim().length > 0 &&
		typeof b.email === "string" &&
		/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email) &&
		typeof b.reason === "string" &&
		b.reason in REASON_LABELS &&
		typeof b.message === "string" &&
		b.message.trim().length > 0
	);
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const origin = request.headers.get("Origin");

		if (request.method === "OPTIONS") {
			return new Response(null, { status: 204, headers: corsHeaders(origin) });
		}

		if (request.method !== "POST") {
			return jsonResponse({ success: false, error: "Method not allowed" }, 405, origin);
		}

		let body: unknown;
		try {
			body = await request.json();
		} catch {
			return jsonResponse({ success: false, error: "Invalid JSON body" }, 400, origin);
		}

		if (!isValidPayload(body)) {
			return jsonResponse({ success: false, error: "Missing or invalid required fields" }, 400, origin);
		}

		const reasonLabel = REASON_LABELS[body.reason];
		const textContent = `New contact form submission\n\nName: ${body.name}\nEmail: ${body.email}\nReason: ${reasonLabel}\n\nMessage:\n${body.message}`;

		const brevoResponse = await fetch("https://api.brevo.com/v3/smtp/email", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
				"api-key": env.BREVO_API_KEY,
			},
			body: JSON.stringify({
				sender: { email: body.email, name: body.name },
				to: [{ email: RECIPIENT_EMAIL }],
				subject: `[SkyXperts] ${reasonLabel} — ${body.name}`,
				textContent,
			}),
		});

		if (!brevoResponse.ok) {
			const errorText = await brevoResponse.text();
			return jsonResponse(
				{ success: false, error: "Failed to send email", details: errorText },
				502,
				origin,
			);
		}

		return jsonResponse({ success: true }, 200, origin);
	},
};
