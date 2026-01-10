export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        // Get password from environment variable
        const APP_PASSWORD = env.APP_PASSWORD;

        // If APP_PASSWORD is not set or empty, allow all requests
        if (!APP_PASSWORD) {
            return fetch(request);
        }

        // Logic for authentication endpoint
        if (url.pathname === '/api/auth') {
            if (request.method !== 'POST') {
                return new Response(JSON.stringify({ error: 'Method not allowed' }), {
                    status: 405,
                    headers: { 'Content-Type': 'application/json' }
                });
            }

            try {
                const body = await request.json();
                if (body.password === APP_PASSWORD) {
                    return new Response(JSON.stringify({ success: true }), {
                        headers: { 'Content-Type': 'application/json' }
                    });
                }
                return new Response(JSON.stringify({ success: false, message: 'Invalid password' }), {
                    status: 401,
                    headers: { 'Content-Type': 'application/json' }
                });
            } catch (err) {
                return new Response(JSON.stringify({ error: 'Invalid body' }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
        }

        // Default: proxy to the static assets (standard ESA behavior)
        return fetch(request);
    }
};
