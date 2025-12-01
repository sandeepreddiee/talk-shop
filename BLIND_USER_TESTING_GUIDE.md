# AccessShop Blind User Testing Guide

## Quick Start

AccessShop is designed **by default for blind users**. Everything works via voice and keyboard.

---

## Two Voice Systems

### 1. Quick Commands (Ctrl+V) - For Fast Actions
**How to use:**
1. **Hold down** Ctrl+V
2. Speak your command clearly
3. **Release** Ctrl+V
4. Action happens immediately

**Best for:** Navigation, adding to cart, quick actions

**Example commands:**
- "go home"
- "search for headphones"  
- "add to cart"
- "go to cart"
- "checkout"
- "what can I say" (for help)

---

### 2. Natural Conversation (Floating Mic Button) - For Questions
**How to use:**
1. Tab to the floating microphone button (bottom-right)
2. Press Enter or Space to start
3. Have a natural conversation
4. Say "stop listening" or click the button to end

**Best for:** Asking questions, getting recommendations, complex interactions

**Example conversations:**
- "Tell me about this product"
- "Which headphones have the best battery life?"
- "Add this to my cart and update my address"
- "What's on sale today?"

---

## Complete Shopping Flow (Voice-First)

### Step 1: Browse Products
```
1. Open AccessShop
2. Screen reader announces: "Welcome to AccessShop..."
3. Hold Ctrl+V, say "go home"
4. Press Tab to navigate through products
5. Screen reader announces each product with price and rating
```

### Step 2: Search for Items
```
1. Hold Ctrl+V, say "search for speaker"
2. Tab through search results
3. Press Enter on any product to view details
```

### Step 3: Add to Cart
```
On product page:
1. Hold Ctrl+V, say "add to cart"
2. Screen reader confirms: "Added to cart"
3. OR: Hold Ctrl+V, say "buy now" (goes straight to checkout)
```

### Step 4: Checkout
```
1. Hold Ctrl+V, say "go to cart"
2. Review items (Tab to navigate)
3. Hold Ctrl+V, say "checkout"
4. Use floating mic button: "My address is 123 Main St, New York, 10001"
5. Use floating mic button: "Place my order"
6. Order confirmed!
```

---

## Keyboard Shortcuts (No Mouse Needed)

| Keys | Action |
|------|--------|
| **Hold Ctrl+V** | Voice commands (push-to-talk) |
| **Tab** | Navigate forward |
| **Shift+Tab** | Navigate backward |
| **Enter** | Activate button/link |
| **Space** | Activate button/checkbox |
| **Ctrl+K** | Focus search box |
| **?** | Show help menu |

---

## Screen Reader Tips

### Stop Speech Anytime
- **Click anywhere** on the page to immediately stop all speech
- Gives you instant control

### Automatic Announcements
- Product pages announce product details when opened
- Cart updates announce item counts
- Status changes announced via live regions

### ARIA Labels
All buttons and links have descriptive labels:
- "Add to cart"
- "Wishlist" 
- "Cart, 3 items"
- "Sign out"

---

## Account Creation (Requires Sighted Assistance Once)

### Initial Signup (with friend's help)
```
1. Navigate to Sign Up
2. Enter email and password
3. System generates a 6-digit PIN
4. Friend reads PIN to you
5. Remember or write down PIN (braille, audio note, etc.)
```

### Future Logins (Completely Voice-Based)
```
1. Hold Ctrl+V, say "login with pin 123456"
2. Automatically logged in!
```

No typing required after initial setup.

---

## Accessibility Preferences (Voice Controlled)

### High Contrast Mode
```
Hold Ctrl+V, say:
- "turn on high contrast"
- "turn off high contrast"
```

### Text Size
```
Hold Ctrl+V, say:
- "increase text size"
- "decrease text size"
```

### Navigate to Settings
```
Hold Ctrl+V, say "open account"
Then Tab to Accessibility Preferences
```

---

## Common Voice Commands Reference

### Navigation
- "go home"
- "open cart" / "go to cart"
- "show orders" / "open orders"
- "open account"
- "go to checkout"

### Search
- "search for [product]"
- "find [product]"
- "look for [product]"

### Product Actions  
- "add to cart"
- "buy now"
- "read product" / "describe product"

### Cart Actions
- "remove item"
- "change quantity to 2"
- "proceed to checkout"

### Help
- "what can I say"
- "show commands"
- "help"

---

## Troubleshooting

### "Voice commands not working"
**Solution:**
- Make sure you're **holding** Ctrl+V, not just pressing it
- Speak clearly while holding the key
- Release when done speaking
- Check microphone permission in browser

### "Nothing happens when I speak"
**Check:**
1. Is microphone icon showing in browser address bar?
2. Did you grant microphone permission?
3. Are you holding Ctrl+V the entire time you speak?
4. Try refreshing page and granting permission again

### "Screen reader reads too much"
**Solution:**
- Click anywhere to stop speech immediately
- We removed auto-read on product cards to reduce conflicts

### "Can't find floating mic button"
**Solution:**
- Tab until you hear "Start voice conversation"
- It's in the bottom-right corner
- You can also use Ctrl+V commands instead

---

## Browser Recommendations

**Best Experience:**
- ✅ **Chrome** (full support)
- ✅ **Edge** (full support)
- ⚠️ **Firefox** (limited voice support)
- ⚠️ **Safari** (partial support)

**Recommendation:** Use Chrome with NVDA (Windows) or VoiceOver (Mac)

---

## Testing Scenarios

### Test 1: Complete Purchase
```
1. Hold Ctrl+V: "search for headphones"
2. Tab through results
3. Press Enter on a product
4. Hold Ctrl+V: "add to cart"
5. Hold Ctrl+V: "checkout"
6. Tab to address fields, fill with keyboard
7. Tab to Place Order, press Enter
8. Success!
```

### Test 2: Natural Conversation
```
1. Tab to floating mic button
2. Press Enter to start
3. Say: "Show me laptops under $1000"
4. Say: "Which one has the best battery life?"
5. Say: "Add that one to my cart"
6. Say: "stop listening"
```

### Test 3: Keyboard-Only Navigation
```
1. Press Tab repeatedly to navigate
2. Use Enter to select
3. Use Ctrl+K to search
4. Complete entire flow without mouse
```

---

## Important Notes

### 1. Click-to-Stop-Speech
**Anywhere you click stops ALL speech immediately.**  
This gives you instant control over announcements.

### 2. Two Voice Systems Are Different
- **Ctrl+V** = Quick single commands
- **Floating mic** = Natural conversation

### 3. Screen Reader Friendly
- All buttons labeled
- Semantic HTML
- Live regions for updates
- Skip to content link

---

## Support

If you encounter issues:
1. Check browser console for error messages
2. Verify microphone permissions
3. Try Chrome if using other browser
4. Refresh page and try again

---

## Conclusion

AccessShop is built from the ground up for blind users. You can:
- ✅ Browse products via keyboard and voice
- ✅ Search using voice commands
- ✅ Add items to cart via voice
- ✅ Complete checkout via voice or keyboard
- ✅ Manage account with voice commands

**No mouse required. No visual reference needed.**

Happy accessible shopping! 🛒
