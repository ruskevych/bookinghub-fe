'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitHandler } from 'react-hook-form';


import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/registry/new-york-v4/ui/card';
import { Button } from '@/registry/new-york-v4/ui/button';
import { Input } from '@/registry/new-york-v4/ui/input';
import { Label } from '@/registry/new-york-v4/ui/label';
import { useAuth } from '@/contexts/auth-context';
import { LogIn, Mail, Lock } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginValues = z.infer<typeof loginSchema>;

import { TopNavbar } from '@/components/top-navbar';

export default function LoginPage() {
  /* react-hook-form */
  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  
  const { login, isLoading, user, isAuthenticated } = useAuth();
  const router = useRouter();

  const onSubmit: SubmitHandler<LoginValues> = async (data) => {

    try {
      await login(data);
      router.push('/dashboard');
    } catch (error) {
      // Error handling is done in the auth context
      console.error('Login failed:', error);
    }
  };

  return (
    <>
      <TopNavbar user={user ? { name: user.name } : undefined} isAuthenticated={!!isAuthenticated} />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 bg-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="flex flex-col items-center">
            <Link href="/" className="flex items-center mb-4 space-x-2 hover:opacity-80 transition-opacity cursor-pointer">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <LogIn className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-2xl text-foreground">BookingHub</span>
            </Link>
          <h2 className="text-4xl font-bold text-foreground mb-2">Sign in to your account</h2>
          
          <p className="text-md text-muted-foreground mb-4">
            Or{' '}
            <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">
              create a new account
            </Link>
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LogIn className="w-5 h-5" />
              Login
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="email">Email address</Label>
                <div className="mt-1 relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    className="pl-10"
                    placeholder="Enter your email"
                    {...formRegister('email')}
                    disabled={isLoading}
                  />
                </div>
                {errors.email?.message && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="mt-1 relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    className="pl-10"
                    placeholder="Enter your password"
                    {...formRegister('password')}
                    disabled={isLoading}
                  />
                </div>
                {errors.password?.message && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link href="/">
                <Button variant="outline" className="w-full">
                  ← Back to booking
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </>
  );
}