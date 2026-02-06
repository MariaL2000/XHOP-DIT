import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText } from "ai";
import { prisma } from "@/lib/prisma";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const stock = await prisma.product.findMany({
      where: { inStock: { gt: 0 } },
      select: { title: true, price: true, sizes: true },
      take: 5,
    });

    const context = stock
      .map((p) => `${p.title}: $${p.price} (Tallas: ${p.sizes.join(",")})`)
      .join("\n");

    const result = await streamText({
      model: google("gemini-2.5-flash"),
      messages: [
        {
          role: "system",
          content: `Eres un asistente de ventas de XHOP'DIT. Productos: \n${context}`,
        },
        ...messages,
      ],
    });

    return result.toTextStreamResponse();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("ERROR API:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
