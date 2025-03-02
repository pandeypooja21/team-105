
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { LogIn, UserPlus } from 'lucide-react';

type AuthMode = 'login' | 'signup';

const AuthForm = ({ mode }: { mode: AuthMode }) => {
  const navigate = useNavigate();
  const { login, signup, isLoading, isAuthenticated, error, initAuth } = useAuthStore();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Initialize auth state when component mounts
  useEffect(() => {
    initAuth();
  }, [initAuth]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Show error toast when error changes
  useEffect(() => {
    if (error) {
      toast({
        title: "Authentication error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (mode === 'signup') {
        if (formData.password !== formData.confirmPassword) {
          toast({
            title: "Passwords don't match",
            description: "Please make sure your passwords match",
            variant: "destructive",
          });
          return;
        }
        
        const user = await signup(formData.name, formData.email, formData.password);
        if (user) {
          toast({
            title: "Account created",
            description: "You have successfully signed up",
          });
          navigate('/dashboard');
        }
      } else {
        const user = await login(formData.email, formData.password);
        if (user) {
          toast({
            title: "Welcome back",
            description: "You have successfully logged in",
          });
          navigate('/dashboard');
        }
      }
    } catch (error) {
      // Error is already handled in the store
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto glass-card animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          {mode === 'login' ? 'Login to CodeHuddle' : 'Create an Account'}
        </CardTitle>
        <CardDescription className="text-center">
          {mode === 'login' 
            ? 'Enter your credentials to access your account' 
            : 'Sign up to start collaborating with your team'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
                className="glass-input"
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="glass-input"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              className="glass-input"
            />
          </div>
          
          {mode === 'signup' && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="glass-input"
              />
            </div>
          )}
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <span className="animate-pulse">Processing...</span>
            ) : mode === 'login' ? (
              <>
                <LogIn size={16} className="mr-2" />
                Login
              </>
            ) : (
              <>
                <UserPlus size={16} className="mr-2" />
                Sign Up
              </>
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
          <Button
            variant="link"
            className="p-0 h-auto font-normal"
            onClick={() => navigate(mode === 'login' ? '/signup' : '/login')}
          >
            {mode === 'login' ? 'Sign up' : 'Login'}
          </Button>
        </p>
      </CardFooter>
    </Card>
  );
};

export default AuthForm;
