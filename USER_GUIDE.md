# AccessShop - Your Voice-First Shopping Experience

## 🚀 Getting Started with Docker

### Why Docker?
Docker packages our entire application (code, dependencies, and web server) into a single container that works the same way on any computer. This means:
- ✅ No installation headaches - everything just works
- ✅ Same experience on Windows, Mac, or Linux
- ✅ Easy to share and run on any laptop
- ✅ Isolated from your system - won't mess with other software

### How to Run the Application

#### Option 1: Running from Docker Hub (Easiest)
```bash
# Pull and run the app in one command
docker run -d -p 8080:80 yourusername/accessshop:latest
```

#### Option 2: Building from Source
```bash
# Clone the repository
git clone <repository-url>
cd accessshop

# Build and run using docker-compose
docker compose up -d

# Or build manually
docker build -t accessshop .
docker run -d -p 8080:80 accessshop
```

### Accessing the Website
Once the Docker container is running, open your web browser and go to:
```
http://localhost:8080
```

That's it! The website will load and you're ready to shop.

### Stopping the Application
```bash
# If using docker-compose
docker compose down

# If using docker run
docker ps  # Find the container ID
docker stop <container-id>
```

---

## ⌨️ Keyboard Shortcuts

AccessShop is designed to be fully keyboard accessible. Here are the shortcuts you can use:

| Shortcut | What it does |
|----------|-------------|
| **Ctrl+V** | Toggle voice input (works everywhere except text fields) |
| **Ctrl+Shift+V** | Force toggle voice input (works even in text fields) |
| **?** | Show help dialog with all commands |

---

## 🎤 Voice Commands

AccessShop is voice-first! Just press **Ctrl+V** and speak any of these commands:

### Navigation Commands
- "Go to home" / "Go home" / "Home page"
- "Go to cart" / "Show cart" / "View cart"
- "Go to orders" / "Show orders" / "My orders"
- "Go to account" / "My account"
- "Go to checkout" / "Checkout"

### Search Commands
- "Search for [product]" - Example: "Search for laptops"
- "Find [product]" - Example: "Find wireless headphones"

### Cart Commands
- "Add to cart" - Adds current product to cart
- "Remove from cart" - Removes current product from cart
- "Clear cart" - Empties your entire cart

### Product Commands
- "Show product details" / "Product information"
- "Read description" - Hear the product description
- "What's the price?" - Hear the current product price

### Page Navigation
- "Read page" / "What's on this page?" - Hear a summary of the current page
- "Scroll down" / "Scroll up" - Navigate the page hands-free

### Preference Commands
- "Increase font size" / "Make text bigger"
- "Decrease font size" / "Make text smaller"
- "High contrast mode" - Toggle high contrast for better visibility
- "Enable screen reader mode"

### Help & Assistance
- "Help" / "What can I say?" - Opens the help dialog
- "Show shortcuts" - Display all keyboard shortcuts

---

## ♿ Accessibility Features

AccessShop is built with accessibility as a priority:

- **Screen Reader Support** - Fully compatible with NVDA, JAWS, and VoiceOver
- **Keyboard Navigation** - Navigate the entire site without a mouse
- **Voice Control** - Shop completely hands-free using voice commands
- **High Contrast Mode** - Better visibility for low vision users
- **Adjustable Font Sizes** - Customize text size to your preference
- **ARIA Labels** - Proper labels for assistive technologies
- **Skip Links** - Jump directly to main content

---

## 💡 Pro Tips

1. **Voice commands work on any page** - You don't need to be on a specific page to use navigation commands

2. **Natural language works** - The system understands variations. "Take me to my shopping cart" works just as well as "Go to cart"

3. **Use 'Read page' when lost** - If you're unsure where you are, say "Read page" to hear a summary

4. **Keyboard is faster for power users** - Learn the shortcuts for quick navigation

5. **Combine voice and keyboard** - Use **Ctrl+V** to quickly toggle voice mode, then speak your command

---

## 🛠️ Technical Details

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS with custom accessibility themes
- **Voice**: Web Speech API
- **Backend**: Supabase (authentication, database, storage)
- **Container**: Docker with Nginx web server
- **Port**: Runs on port 8080 by default

---

## 🆘 Troubleshooting

### Can't access http://localhost:8080
- Make sure the Docker container is running: `docker ps`
- Check if port 8080 is already in use on your system
- Try restarting the container

### Voice commands not working
- Check browser permissions for microphone access
- Try using Chrome or Edge (best browser support)
- Make sure you press **Ctrl+V** before speaking

### Container won't start
- Make sure Docker Desktop is running
- Check Docker logs: `docker logs <container-id>`
- Try rebuilding: `docker compose down && docker compose up --build`

---

## 📞 Need Help?

If you run into issues or have questions, open the help dialog by pressing **?** or saying "Help" while in voice mode.

---

**Happy Shopping! 🛍️**
