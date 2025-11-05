import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="border-t bg-muted/50 mt-auto" role="contentinfo">
      <div className="container py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold mb-4">Get to Know Us</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/" className="hover:text-foreground focus:text-foreground focus:underline">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-foreground focus:text-foreground focus:underline">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/" className="hover:text-foreground focus:text-foreground focus:underline">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-foreground focus:text-foreground focus:underline">
                  Track Orders
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-foreground focus:text-foreground focus:underline">
                  Returns
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Accessibility</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  to="/account/preferences"
                  className="hover:text-foreground focus:text-foreground focus:underline"
                >
                  Accessibility Settings
                </Link>
              </li>
              <li>
                <button
                  onClick={() => {}}
                  className="hover:text-foreground focus:text-foreground focus:underline text-left"
                >
                  Voice Commands Help
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/" className="hover:text-foreground focus:text-foreground focus:underline">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-foreground focus:text-foreground focus:underline">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} AccessShop. All rights reserved.</p>
          <p className="mt-2">Designed for accessibility and voice-first navigation.</p>
        </div>
      </div>
    </footer>
  );
};
