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
        instructions: `You are an AI shopping assistant for AccessShop, a voice-first e-commerce platform designed for blind users.

**Your Complete Capabilities:**
- Browse, search, filter, and sort products
- Read product details, reviews, and specs
- Manage cart (add, remove, update quantities, view contents)
- Manage wishlist (add, remove, view)
- Navigate to any page
- Complete checkout process including address entry and order placement
- View order history
- Compare products
- Recommend products based on preferences
- Check deals and promotions
- Adjust user preferences (high contrast, text size)
- Help with any shopping task

**Interaction Guidelines:**
- Be conversational and natural - you're having a voice chat
- Keep responses concise (1-2 sentences) - this is audio
- Always confirm actions ("I've added that to your cart")
- Proactively offer help ("Would you like to checkout now?")
- Handle errors gracefully ("I couldn't find that product, try another search")
- Use tools immediately when users request actions

**Address Entry (IMPORTANT):**
When users provide shipping information, carefully extract:
- Full street address with numbers (e.g., "123 Main Street")
- City name (e.g., "New York")
- ZIP code (e.g., "10001")
Call update_shipping_address with the extracted fields. Users may provide all at once or one field at a time.

Remember: Users are blind and using voice. Be their eyes and hands.`,
        tools: [
          {
            type: "function",
            name: "search_products",
            description: "Search for products by name, category, or features. Use this when users ask to find or look for something.",
            parameters: {
              type: "object",
              properties: {
                query: {
                  type: "string",
                  description: "Search query (e.g., 'wireless headphones', 'laptop', 'gaming')"
                },
                category: {
                  type: "string",
                  description: "Optional category filter (e.g., 'Electronics', 'Computing', 'Gaming')"
                }
              },
              required: ["query"]
            }
          },
          {
            type: "function",
            name: "get_products",
            description: "Get a list of products with optional filters. Use for browsing, filtering by price/rating, or sorting.",
            parameters: {
              type: "object",
              properties: {
                category: {
                  type: "string",
                  description: "Filter by category"
                },
                minPrice: {
                  type: "number",
                  description: "Minimum price filter"
                },
                maxPrice: {
                  type: "number",
                  description: "Maximum price filter"
                },
                minRating: {
                  type: "number",
                  description: "Minimum rating filter (0-5)"
                },
                sortBy: {
                  type: "string",
                  enum: ["price_asc", "price_desc", "rating", "name"],
                  description: "Sort order"
                },
                limit: {
                  type: "number",
                  description: "Number of products to return (default: 10)"
                },
                onlyDeals: {
                  type: "boolean",
                  description: "Show only products with discounts"
                }
              }
            }
          },
          {
            type: "function",
            name: "view_product",
            description: "Open and navigate to a product's detail page. Use this when user says 'open this product', 'show me this product', 'go to this product', etc.",
            parameters: {
              type: "object",
              properties: {
                productId: {
                  type: "string",
                  description: "Product ID"
                },
                productName: {
                  type: "string",
                  description: "Product name to search for (alternative to productId)"
                }
              }
            }
          },
          {
            type: "function",
            name: "get_product_details",
            description: "Get full details about a specific product by ID or get the current product being viewed",
            parameters: {
              type: "object",
              properties: {
                productId: {
                  type: "string",
                  description: "Product ID (leave empty to get current product)"
                }
              }
            }
          },
          {
            type: "function",
            name: "add_to_cart",
            description: "Add a product to shopping cart. Can specify product by ID, name, or use current product.",
            parameters: {
              type: "object",
              properties: {
                productId: {
                  type: "string",
                  description: "Product ID (leave empty for current product)"
                },
                productName: {
                  type: "string",
                  description: "Product name to search for (alternative to productId)"
                },
                quantity: {
                  type: "number",
                  description: "Quantity to add (default: 1)"
                }
              }
            }
          },
          {
            type: "function",
            name: "view_cart",
            description: "Get all items in the shopping cart with prices and quantities",
            parameters: {
              type: "object",
              properties: {}
            }
          },
          {
            type: "function",
            name: "update_cart_quantity",
            description: "Update the quantity of a product in the cart or remove it",
            parameters: {
              type: "object",
              properties: {
                productId: {
                  type: "string",
                  description: "Product ID in cart"
                },
                quantity: {
                  type: "number",
                  description: "New quantity (use 0 to remove)"
                }
              },
              required: ["productId", "quantity"]
            }
          },
          {
            type: "function",
            name: "add_to_wishlist",
            description: "Add a product to wishlist. Can specify product by ID or use current product.",
            parameters: {
              type: "object",
              properties: {
                productId: {
                  type: "string",
                  description: "Product ID (leave empty for current product)"
                }
              }
            }
          },
          {
            type: "function",
            name: "remove_from_wishlist",
            description: "Remove a product from wishlist",
            parameters: {
              type: "object",
              properties: {
                productId: {
                  type: "string",
                  description: "Product ID to remove"
                }
              },
              required: ["productId"]
            }
          },
          {
            type: "function",
            name: "view_wishlist",
            description: "Get all items in the wishlist",
            parameters: {
              type: "object",
              properties: {}
            }
          },
          {
            type: "function",
            name: "navigate",
            description: "Navigate to a specific page or open a product",
            parameters: {
              type: "object",
              properties: {
                destination: {
                  type: "string",
                  enum: ["home", "cart", "checkout", "wishlist", "orders", "account"],
                  description: "Page to navigate to"
                },
                productId: {
                  type: "string",
                  description: "Product ID if navigating to a product page"
                }
              },
              required: ["destination"]
            }
          },
          {
            type: "function",
            name: "get_reviews",
            description: "Get customer reviews for a product",
            parameters: {
              type: "object",
              properties: {
                productId: {
                  type: "string",
                  description: "Product ID (leave empty for current product)"
                },
                minRating: {
                  type: "number",
                  description: "Filter by minimum rating"
                }
              }
            }
          },
          {
            type: "function",
            name: "compare_products",
            description: "Compare features and prices of multiple products",
            parameters: {
              type: "object",
              properties: {
                productIds: {
                  type: "array",
                  items: { type: "string" },
                  description: "Array of product IDs to compare"
                }
              },
              required: ["productIds"]
            }
          },
          {
            type: "function",
            name: "get_recommendations",
            description: "Get product recommendations based on current product or category",
            parameters: {
              type: "object",
              properties: {
                category: {
                  type: "string",
                  description: "Category for recommendations"
                },
                maxPrice: {
                  type: "number",
                  description: "Maximum price range"
                }
              }
            }
          },
          {
            type: "function",
            name: "update_shipping_address",
            description: "Update shipping address fields during checkout. Extract address components from user's speech. Examples: 'My address is 123 Main Street' -> address='123 Main Street', 'I live in New York' -> city='New York', 'zip code is 10001' -> zipCode='10001'. Can update all fields at once or individually.",
            parameters: {
              type: "object",
              properties: {
                address: {
                  type: "string",
                  description: "Street address including house/apt number and street name (e.g., '123 Main Street', '456 Oak Avenue Apt 2B')"
                },
                city: {
                  type: "string",
                  description: "City name (e.g., 'New York', 'Los Angeles', 'Chicago')"
                },
                zipCode: {
                  type: "string",
                  description: "ZIP or postal code (e.g., '10001', '90210')"
                }
              }
            }
          },
          {
            type: "function",
            name: "place_order",
            description: "Complete the checkout and place the order",
            parameters: {
              type: "object",
              properties: {}
            }
          },
          {
            type: "function",
            name: "view_orders",
            description: "Get user's order history",
            parameters: {
              type: "object",
              properties: {
                limit: {
                  type: "number",
                  description: "Number of recent orders to show (default: 5)"
                }
              }
            }
          },
          {
            type: "function",
            name: "update_preferences",
            description: "Update accessibility preferences like contrast and text size",
            parameters: {
              type: "object",
              properties: {
                highContrast: {
                  type: "boolean",
                  description: "Enable/disable high contrast mode"
                },
                textSize: {
                  type: "string",
                  enum: ["small", "medium", "large", "xl"],
                  description: "Set text size"
                }
              }
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
