import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText, createUIMessageStreamResponse } from 'ai';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

function logToFile(msg: string) {
    const logPath = path.join(process.cwd(), 'api-debug.log');
    const timestamp = new Date().toISOString();
    try {
        fs.appendFileSync(logPath, `[${timestamp}] ${msg}\n`);
    } catch (e) {
        console.error('Log failed:', e);
    }
}

export async function POST(req: Request) {
    console.log('[API] POST Request Triggered');
    try {
        const body = await req.json();
        const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
        const cwd = process.cwd();

        logToFile(`[START] Protocol V3.0+ - API Key Present: ${!!apiKey} - CWD: ${cwd}`);
        console.log(`[API] API Key Present: ${!!apiKey} - CWD: ${cwd}`);

        const { messages } = body;

        // Standard initialization as verified by test-route.js
        const google = createGoogleGenerativeAI({
            apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
        });

        logToFile(`[MODEL] Initializing stream with confirmed ID: gemini-flash-latest...`);
        const result = await streamText({
            model: google('gemini-flash-latest'),
            system: `You are the Arca Prestige Curator, an elite AI assistant for a high-end real estate platform. 
            Your goal is to assist users in acquiring exceptional assets. 
            Be professional, sophisticated, and helpful. 
            Use vocabulary like "exceptional," "prestige," "curator," "acquisition," and "asset."
            If a user asks about properties, guide them to use the search page or provide general advice on high-end real estate acquisitions in luxury neighborhoods.`,
            messages,
            onFinish(event) {
                logToFile(`[STREAM] Finished. Usage: ${JSON.stringify(event.usage)}`);
                logToFile(`[STREAM] Full Text First 100: ${event.text.substring(0, 100)}...`);
            },
            onError(error) {
                logToFile(`[STREAM] Error callback: ${error}`);
            }
        });

        logToFile(`[SUCCESS] Mapping to Text Stream Response...`);
        // Fallback to text stream as data stream is unavailable
        return result.toTextStreamResponse();
    } catch (error) {
        logToFile(`[CRITICAL] POST Error: ${error}`);
        if (error instanceof Error) {
            logToFile(`[STACK] ${error.stack}`);
        }
        return new Response(JSON.stringify({ error: (error as any).message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
