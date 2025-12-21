import { streamText, UIMessage, convertToModelMessages } from 'ai';

import { google } from '@ai-sdk/google';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages = [], model = 'gemini-1.5-flash' } = body;
    
    console.log('Received messages:', messages);
    console.log('Selected model:', model);
    
    // Ensure messages is an array and has valid structure
    if (!Array.isArray(messages)) {
      return new Response('Invalid messages format', { status: 400 });
    }
    
    // Convert messages to the correct format
    const formattedMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content || msg.text || ''
    }));
    
    console.log('Formatted messages:', formattedMessages);
    
    const result = streamText({
      model: google(model),
      messages: formattedMessages,
      system:
        'You are a helpful assistant that can answer questions and help with tasks',
    });
    
    return result.toUIMessageStreamResponse({
      sendSources: true,
      sendReasoning: true,
    });
  } catch (error) {
    console.error('API Error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}