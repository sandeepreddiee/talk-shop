import { PreferencesPanel } from '@/components/PreferencesPanel';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';

export default function Account() {
  return (
    <main id="main-content" className="container py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Account Settings</h1>
      
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <h3 className="font-semibold mb-2">Orders</h3>
          <p className="text-sm text-muted-foreground mb-4">
            View your order history and track shipments
          </p>
          <Button asChild variant="outline" className="w-full">
            <Link to="/orders">View Orders</Link>
          </Button>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-2">Shopping Cart</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Review items in your cart
          </p>
          <Button asChild variant="outline" className="w-full">
            <Link to="/cart">View Cart</Link>
          </Button>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-2">Accessibility Metrics</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Track your accessibility usage patterns
          </p>
          <Button asChild variant="outline" className="w-full">
            <Link to="/metrics">View Metrics</Link>
          </Button>
        </Card>
      </div>

      <h2 className="text-2xl font-bold mb-4">Accessibility Preferences</h2>
      <PreferencesPanel />
    </main>
  );
}
