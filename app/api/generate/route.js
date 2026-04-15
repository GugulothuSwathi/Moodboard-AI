import { streamObject } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { z } from 'zod';
import { NextResponse } from 'next/server';

export const maxDuration = 30;

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    if (prompt.length > 500) {
      return NextResponse.json({ error: 'Prompt too long (max 500 characters)' }, { status: 400 });
    }

    const google = createGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    });

    const result = await streamObject({
      model: google('gemini-2.5-flash'),
      system: `You are a professional creative director and brand designer with expertise in visual aesthetics, color theory, and typography.
Your task is to generate a complete mood board brief based on a creative concept.
Make your suggestions specific, sophisticated, and genuinely useful for a designer.`,
      prompt: `Generate a comprehensive mood board for: "${prompt.trim()}"`,
      schema: z.object({
        colors: z.array(z.object({
          hex: z.string().describe('Hex code of the color'),
          name: z.string().describe('Evocative name of the color like "Aged Brass"'),
          emotion: z.string().describe('The feeling this color evokes')
        })).length(6).describe('Exactly 6 harmonious color codes'),
        fonts: z.array(z.object({
          name: z.string().describe('Exact Google Font name'),
          role: z.string().describe('e.g., heading, body, accent'),
          reason: z.string()
        })).length(3).describe('Exactly 3 real Google Fonts'),
        keywords: z.array(z.string()).length(8).describe('8 mood words that capture the feeling and aesthetic'),
        textures: z.array(z.string()).length(4).describe('4 material/texture suggestions relevant to the concept'),
        imageSearchTerms: z.array(z.string().describe('Specific Unsplash search terms')).length(5),
        designDirection: z.string().describe('2-3 sentence design brief')
      }),
    });

    return result.toTextStreamResponse();
  } catch (error) {
    if (error?.message?.includes('RESOURCE_EXHAUSTED')) {
      return NextResponse.json({ error: 'AI service quota exhausted.' }, { status: 429 });
    }
    return NextResponse.json({ error: error.message || 'Something went wrong' }, { status: 500 });
  }
}
