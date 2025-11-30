import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { speechService } from '@/services/speechService';
import { z } from 'zod';
import { Alert, AlertDescription } from '@/components/ui/alert';

const signupSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .max(72, 'Password must be less than 72 characters')
});

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [userPin, setUserPin] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    const validation = signupSchema.safeParse({ email, password });
    if (!validation.success) {
      const errorMessage = validation.error.issues[0].message;
      toast.error(errorMessage);
      speechService.speak(errorMessage);
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        if (error.message.includes('already registered')) {
          throw new Error('This email is already registered. Please sign in instead.');
        }
        throw error;
      }

      // Wait for profile to be created and fetch PIN
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('login_pin')
          .eq('id', user.id)
          .single();

        if (profile?.login_pin) {
          setUserPin(profile.login_pin);
          const pinMessage = `Account created successfully! Your login PIN is: ${profile.login_pin.split('').join(', ')}. Please write this down. You can use this PIN to login quickly.`;
          toast.success('Account created! Check your PIN below.');
          speechService.speak(pinMessage);
        }
      }
    } catch (error: any) {
      toast.error(error.message);
      speechService.speak('Sign up failed. ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main id="main-content" className="container py-16 px-4 flex items-center justify-center min-h-[80vh]">
      <Card className="max-w-md w-full p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Create Account</h1>
        
        {userPin && (
          <Alert className="mb-6 bg-primary/10 border-primary">
            <AlertDescription className="text-center">
              <p className="font-bold text-lg mb-2">Your Login PIN</p>
              <p className="text-4xl font-mono tracking-widest mb-2" aria-live="polite">
                {userPin}
              </p>
              <p className="text-sm">Save this PIN - you can use it to login quickly!</p>
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-required="true"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              aria-required="true"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-primary hover:underline"
            >
              Sign In
            </button>
          </p>
        </form>
      </Card>
    </main>
  );
}
