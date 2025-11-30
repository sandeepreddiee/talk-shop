import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { query, context } = await req.json();
    
    console.log('🔍 Edge Function - Received request:', {
      query,
      hasContext: !!context,
      hasProduct: !!context?.product,
      productName: context?.product?.name,
      productId: context?.product?.id,
      fullProduct: context?.product
    });
    
    if (!query) {
      throw new Error('Query is required');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Build context-aware system prompt
    let systemPrompt = `You are an AI shopping assistant for AccessShop, an accessible e-commerce platform.

Your role:
- Answer questions about products (price, features, reviews, availability)
- Help users navigate and shop
- Provide clear, concise answers
- Be empathetic and helpful
- Always mention voice commands when relevant

When answering:
- Keep responses under 3 sentences unless asked for details
- Always mention the product name when discussing it
- For prices, always say "dollars" not just the number
- Summarize reviews focusing on pros and cons
- Mention Prime availability if relevant

Available voice commands you can mention:
- "Add to cart" - Add current product
- "Go to cart" - View shopping cart
- "Checkout" - Start checkout process
- "Go home" - Return to homepage
- "Search for [item]" - Search products`;

    // Add context-specific information
    if (context?.product) {
      const p = context.product;
      console.log('Product context received:', p);
      
      systemPrompt += `\n\nCurrent product context:
- Name: ${p.name}
- Price: $${p.price}
- Rating: ${p.rating || 'N/A'} stars (${p.reviewCount || p.reviews || 0} reviews)
- Category: ${p.category || 'N/A'}
- In stock: ${p.inStock !== false && p.in_stock !== false ? 'Yes' : 'No'}
- Description: ${p.description || 'No description available'}
- Features: ${p.features && Array.isArray(p.features) ? p.features.join(', ') : 'No features listed'}

IMPORTANT: The user is viewing ${p.name}. Always refer to this specific product in your responses. DO NOT mention any other products.`;
    }

    if (context?.page) {
      systemPrompt += `\n\nCurrent page: ${context.page}`;
    }

    if (context?.cartCount) {
      systemPrompt += `\n\nItems in cart: ${context.cartCount}`;
    }

    // Call Lovable AI
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
          { role: 'user', content: query }
        ],
        temperature: 0.7,
        max_tokens: 200
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Too many requests. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Service temporarily unavailable.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error('AI service error');
    }

    const data = await response.json();
    const assistantMessage = data.choices[0]?.message?.content || 'I apologize, I could not process that request.';

    return new Response(
      JSON.stringify({ 
        response: assistantMessage,
        success: true 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );

  } catch (error) {
    console.error('Voice assistant error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'An error occurred',
        success: false 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});
