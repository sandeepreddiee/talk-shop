import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, product } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Build system prompt with product context
    const systemPrompt = `You are a friendly, helpful AI shopping assistant for AccessShop. You're knowledgeable, conversational, and can discuss anything - not just products!

CURRENT PRODUCT CONTEXT:
- Name: ${product.name}
- Price: $${product.price}
${product.originalPrice ? `- Original Price: $${product.originalPrice} (ON SALE!)` : ''}
- Rating: ${product.rating} stars (${product.reviewCount} reviews)
- Description: ${product.description}
- Features: ${product.features.join(', ')}
- In Stock: ${product.inStock ? 'Yes' : 'No'}

GUIDELINES:
- Answer ANY question naturally - jokes, stories, general knowledge, creative requests, etc.
- When asked about product features, use the context above
- Be conversational, friendly, and helpful
- Keep responses concise (2-4 sentences) since this is voice-first
- If asked for jokes or creative content, be entertaining!
- If asked to compare products or discuss things outside current product, do your best with general knowledge

Examples:
- "Tell me a joke about these headphones" → Make a funny joke!
- "What's the price?" → Answer from context
- "Would these be good for traveling?" → Give thoughtful advice
- "Tell me a fun fact" → Share something interesting!`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        temperature: 0.8,
        max_tokens: 200
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ 
          error: 'Rate limit exceeded. Please try again in a moment.' 
        }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ 
          error: 'AI service requires payment. Please contact support.' 
        }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error('AI service error');
    }

    const data = await response.json();
    const assistantMessage = data.choices?.[0]?.message?.content;

    if (!assistantMessage) {
      throw new Error('No response from AI');
    }

    return new Response(
      JSON.stringify({ message: assistantMessage }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Product assistant error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
