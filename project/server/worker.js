export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // AI Chat Proxy
    if (url.pathname === "/api/ai/chat" && request.method === "POST") {
      try {
        const { model, messages, stream } = await request.json();
        
        const response = await env.AI.run(model || "@cf/meta/llama-3.1-8b-instruct", {
          messages,
          stream: stream ?? true,
        });

        if (stream) {
          return new Response(response, {
            headers: { "content-type": "text/event-stream" },
          });
        }

        return Response.json(response);
      } catch (e) {
        return Response.json({ error: e.message }, { status: 500 });
      }
    }

    return new Response("Njirlah AI Worker is running. Send a POST to /api/ai/chat", {
      headers: { "content-type": "text/plain" },
    });
  },
};
