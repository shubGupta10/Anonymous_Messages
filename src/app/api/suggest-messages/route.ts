import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

// Initialize the API key
const geminiApiKey = process.env.API_KEY;

if (!geminiApiKey) {
  throw new Error("API key is missing. Please set the API_KEY environment variable.");
}

const googleAI = new GoogleGenerativeAI(geminiApiKey);
const geminiModel = googleAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    // Default prompt if none is provided
    const defaultPrompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction.";

    let prompt;
    
    // Try to parse the request body, use default if parsing fails
    try {
      const body = await req.json();
      prompt = body.prompt || defaultPrompt;
    } catch (error) {
      prompt = defaultPrompt;
    }

    // Generate content using Gemini
    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Validate the response
    if (!text) {
      throw new Error('No content generated');
    }

    // Return the formatted response
    return NextResponse.json(
      { 
        content: text,
        status: 'success' 
      },
      { status: 200 }
    );

  } catch (error) {
    // Log the error for debugging
    console.error('Error in suggest-messages API:', error);

    // Return a structured error response
    return NextResponse.json(
      { 
        error: 'Failed to generate messages',
        details: error instanceof Error ? error.message : 'Unknown error',
        status: 'error'
      },
      { status: 500 }
    );
  }
}