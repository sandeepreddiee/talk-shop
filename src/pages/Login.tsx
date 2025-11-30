import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { speechService } from '@/services/speechService';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required')
});

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate inputs
    const validation = loginSchema.safeParse({ email, password });
    if (!validation.success) {
      const errorMessage = validation.error.issues[0].message;
      toast.error(errorMessage);
      speechService.speak(errorMessage);
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Invalid email or password. Please try again.');
        }
        throw error;
      }

      toast.success('Signed in successfully!');
      speechService.speak('Signed in successfully. Welcome back!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message);
      speechService.speak('Sign in failed. ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main id="main-content" className="container py-16 px-4 flex items-center justify-center min-h-[80vh]">
      <Card className="max-w-md w-full p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Sign In</h1>
        <form onSubmit={handleLogin} className="space-y-4">
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
              aria-required="true"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/signup')}
              className="text-primary hover:underline"
            >
              Sign Up
            </button>
          </p>
        </form>
      </Card>
    </main>
  );
}
