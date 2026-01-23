// src/index.js
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // =========================
    // API: POST /api/contact
    // =========================
    if (url.pathname === "/api/contact") {

      if (request.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders(request) });
      }

      if (request.method !== "POST") {
        return json(
          { ok: false, error: "Method not allowed" },
          405,
          corsHeaders(request)
        );
      }

      let payload;
      try {
        payload = await request.json();
      } catch {
        return json(
          { ok: false, error: "Invalid JSON body" },
          400,
          corsHeaders(request)
        );
      }

      const email = String(payload?.email || "").trim().toLowerCase();

      if (!isValidEmail(email)) {
        return json(
          { ok: false, error: "Invalid email" },
          400,
          corsHeaders(request)
        );
      }

      try {
        await env.DB1.prepare(
          "INSERT INTO emails (email) VALUES (?1)"
        ).bind(email).run();

        return json({ ok: true }, 200, corsHeaders(request));
      } catch (e) {
        // Si ya existe, lo tratamos como éxito (idempotente)
        const msg = String(e?.message || "");
        if (msg.includes("UNIQUE") || msg.includes("constraint")) {
          return json({ ok: true, alreadyExists: true }, 200, corsHeaders(request));
        }

        // Error real de BD
        return json({ ok: false, error: "Database error" }, 500, corsHeaders(request));
      }
    }

    // =========================
    // Assets: todo lo demás
    // =========================
    // Sirve index.html, proyects.html, style.css, app.js, etc. desde /dist
    const assetResponse = await env.ASSETS.fetch(request);

    // Fallback opcional: si alguien pide una ruta que no existe y acepta HTML, devuelve index.html
    // (No es imprescindible para mi web multi-página, pero no molesta)
    if (assetResponse.status === 404 && acceptsHtml(request)) {
      return env.ASSETS.fetch(new Request(new URL("/index.html", request.url), request));
    }

    return assetResponse;
  },
};

// -------------------------
// Helpers
// -------------------------
function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...extraHeaders,
    },
  });
}

function isValidEmail(email) {
  // Validación práctica (no perfecta, pero adecuada para captación de emails)
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

function acceptsHtml(request) {
  const accept = request.headers.get("accept") || "";
  return accept.includes("text/html");
}

function corsHeaders(request) {
  const origin = request.headers.get("origin") || "*";
  return {
    "access-control-allow-origin": origin,
    "access-control-allow-methods": "POST, OPTIONS",
    "access-control-allow-headers": "content-type",
    "access-control-max-age": "86400",
    "vary": "Origin",
  };
}
