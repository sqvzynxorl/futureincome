import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {
    const { prompt, template } = await req.json()

    if (!prompt || typeof prompt !== "string") {
      return Response.json({ error: "Prompt is required" }, { status: 400 })
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert marketing copywriter. Create clear, engaging, high-converting marketing content.",
        },
        {
          role: "user",
          content: `Create ${template || "marketing"} content for: ${prompt}`,
        },
      ],
      temperature: 0.8,
    })

    return Response.json({
      content: completion.choices[0]?.message?.content || "No content generated.",
      result: completion.choices[0]?.message?.content || "No content generated.",
    })
  } catch (error) {
    console.error("Generate API error:", error)

    return Response.json(
      { error: "Generation failed. Check your OpenAI key, billing, and model access." },
      { status: 500 }
    )
  }
}
