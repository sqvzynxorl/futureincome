import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { prompt, template } = await req.json();

    const systemPrompt = `
You are an expert marketing copywriter.
Create engaging, professional marketing content.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: template
            ? `Create ${template} content for: ${prompt}`
            : prompt,
        },
      ],
      temperature: 0.8,
    });

    return Response.json({
      result: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error: "Generation failed",
      },
      {
        status: 500,
      }
    );
  }
}
