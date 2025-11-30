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
  const [loginMode, setLoginMode] = useState<'email' | 'pin'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailLogin = async (e: React.FormEvent) => {
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

  const handlePinLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (pin.length !== 6) {
      toast.error('Please enter a 6-digit PIN');
      speechService.speak('Please enter a 6-digit PIN');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('pin-login', {
        body: { pin }
      });

      if (error) throw error;

      if (data.success && data.session) {
        // Use the magic link to sign in
        const url = new URL(data.session.properties.action_link);
        const token = url.searchParams.get('token');
        const type = url.searchParams.get('type');

        if (token && type) {
          const { error: verifyError } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: type as any
          });

          if (verifyError) throw verifyError;

          toast.success('Signed in successfully with PIN!');
          speechService.speak('Signed in successfully. Welcome back!');
          navigate('/');
        }
      } else {
        throw new Error('Invalid PIN');
      }
    } catch (error: any) {
      toast.error(error.message || 'Invalid PIN. Please try again.');
      speechService.speak('Sign in failed. Invalid PIN.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main id="main-content" className="container py-16 px-4 flex items-center justify-center min-h-[80vh]">
      <Card className="max-w-md w-full p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Sign In</h1>
        
        <div className="flex gap-2 mb-6">
          <Button
            type="button"
            variant={loginMode === 'email' ? 'default' : 'outline'}
            onClick={() => {
              setLoginMode('email');
              speechService.speak('Email login mode');
            }}
            className="flex-1"
          >
            Email
          </Button>
          <Button
            type="button"
            variant={loginMode === 'pin' ? 'default' : 'outline'}
            onClick={() => {
              setLoginMode('pin');
              speechService.speak('PIN login mode. Enter your 6-digit PIN.');
            }}
            className="flex-1"
          >
            PIN
          </Button>
        </div>

        {loginMode === 'email' ? (
          <form onSubmit={handleEmailLogin} className="space-y-4">
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
          </form>
        ) : (
          <form onSubmit={handlePinLogin} className="space-y-4">
            <div>
              <label htmlFor="pin" className="block text-sm font-medium mb-2">
                6-Digit PIN
              </label>
              <Input
                id="pin"
                type="text"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                required
                aria-required="true"
                placeholder="000000"
                className="text-center text-2xl tracking-widest font-mono"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In with PIN'}
            </Button>
          </form>
        )}

        <p className="text-center text-sm text-muted-foreground mt-4">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('/signup')}
            className="text-primary hover:underline"
          >
            Sign Up
          </button>
        </p>
      </Card>
    </main>
  );
}
