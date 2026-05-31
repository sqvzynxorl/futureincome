export async function POST(req: Request) {
  try {
    const { prompt, template } = await req.json()

    if (!prompt || typeof prompt !== "string") {
      return Response.json({ error: "Prompt is required" }, { status: 400 })
    }

    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      return Response.json({
        content: `Demo ${template || "Marketing"} Content\n\n${prompt}\n\nCall to action: Start today.`,
      })
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are an expert marketing copywriter." },
          { role: "user", content: `Create ${template || "marketing"} content for: ${prompt}` },
        ],
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      return Response.json({ error: data.error?.message || "OpenAI request failed" }, { status: 500 })
    }

    return Response.json({
      content: data.choices?.[0]?.message?.content || "No content generated.",
      result: data.choices?.[0]?.message?.content || "No content generated.",
    })
  } catch {
    return Response.json({ error: "Server error" }, { status: 500 })
  }
}
