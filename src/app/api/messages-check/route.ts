// pages/api/messages-check.ts
import { NextResponse, NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const geminiApiKey = process.env.API_KEY;
const googleAI = geminiApiKey ? new GoogleGenerativeAI(geminiApiKey) : null;

export async function POST(req: NextRequest) {
    if (!googleAI) {
        console.error("Google AI API key is not provided.");
        return NextResponse.json({ error: "API key missing or invalid" }, { status: 500 });
    }

    try {
        const { prompt } = await req.json();

        if (!prompt) {
            return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
        }

        const geminiModel = googleAI.getGenerativeModel({
            model: "gemini-1.5-flash",
        });

        const result = await geminiModel.generateContent(prompt);
        const responseText = result?.response?.candidates?.[0]?.content?.parts?.[0]?.text || "No content available";

        return NextResponse.json(
            { response: responseText, message: "Response generated successfully" },
            { status: 201 }
        );
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json(
            { error: "Failed to get response from Google AI" },
            { status: 500 }
        );
    }
}
