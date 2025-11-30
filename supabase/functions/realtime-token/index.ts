import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set');
    }

    console.log('Creating ephemeral token for Realtime API...');

    const response = await fetch("https://api.openai.com/v1/realtime/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-realtime-preview-2024-12-17",
        voice: "alloy",
        instructions: `You are a helpful shopping assistant for AccessShop, a voice-first e-commerce platform designed for blind users. 
        
You can help users:
- Learn about products (features, price, reviews)
- Add products to their cart
- Navigate to different pages (cart, checkout, home, search)
- Answer shopping questions
- Provide recommendations

When users ask you to perform actions, use the available tools to help them. Always confirm actions after completing them.

Be conversational, helpful, and concise. Remember this is a voice interface, so keep responses brief and natural.`,
        tools: [
          {
            type: "function",
            name: "add_to_cart",
            description: "Add the current product to the user's shopping cart",
            parameters: {
              type: "object",
              properties: {
                quantity: {
                  type: "number",
                  description: "Number of items to add (default: 1)"
                }
              }
            }
          },
          {
            type: "function", 
            name: "navigate",
            description: "Navigate to a different page in the application",
            parameters: {
              type: "object",
              properties: {
                page: {
                  type: "string",
                  enum: ["home", "cart", "checkout", "search", "wishlist", "orders"],
                  description: "The page to navigate to"
                }
              },
              required: ["page"]
            }
          },
          {
            type: "function",
            name: "get_product_info",
            description: "Get detailed information about the current product being viewed",
            parameters: {
              type: "object",
              properties: {}
            }
          }
        ]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`Failed to create session: ${errorText}`);
    }

    const data = await response.json();
    console.log("Ephemeral session created successfully");

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error creating ephemeral token:", error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
