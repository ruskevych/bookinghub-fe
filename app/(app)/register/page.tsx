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
import { UserPlus, Mail, Lock, User, Phone } from 'lucide-react';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().optional().refine((val) => !val || val.length >= 10, { message: 'Please enter a valid phone number' }),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type RegisterValues = z.infer<typeof registerSchema>;

import { TopNavbar } from '@/components/top-navbar';

export default function RegisterPage() {
  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
    },
  });

  const { register, isLoading, user, isAuthenticated } = useAuth();
  const router = useRouter();

  const onSubmit: SubmitHandler<RegisterValues> = async (data) => {
    try {
      await register({
        name: data.name.trim(),
        email: data.email,
        password: data.password,
        phone: data.phone || undefined,
      });
      router.push('/dashboard');
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <>
      <TopNavbar user={user ? { name: user.name } : undefined} isAuthenticated={!!isAuthenticated} />
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 bg-background pt-[64px] px-1 sm:px-2 lg:px-4">
        <Card className="w-full max-w-lg shadow-lg rounded-xl max-h-[calc(100vh-64px)] overflow-auto">
          <CardContent className="p-6 sm:p-10">
            <div className="flex flex-col items-center">
              <Link href="/" className="flex items-center mb-4 space-x-2 hover:opacity-80 transition-opacity cursor-pointer">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <UserPlus className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="font-bold text-2xl text-foreground">BookingHub</span>
              </Link>
              <h2 className="text-3xl font-bold text-foreground mb-2">Create your account</h2>
              <p className="text-md text-muted-foreground mb-4">
                Or{' '}
                <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                  sign in to your existing account
                </Link>
              </p>
              <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-2">

                <Label htmlFor="name">Full Name</Label>
                <div className="mt-1 relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="name"
                    type="text"
                    autoComplete="name"
                    className="pl-10"
                    placeholder="Enter your full name"
                    {...formRegister('name')}
                    disabled={isLoading}
                  />
                </div>
                {errors.name?.message && (
                  <p className="mt-1 text-sm text-red-600">{errors.name?.message}</p>
                )}

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
                    <p className="mt-1 text-sm text-red-600">{errors.email?.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number (optional)</Label>
                  <div className="mt-1 relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="phone"
                      type="tel"
                      autoComplete="tel"
                      className="pl-10"
                      placeholder="Enter your phone number"
                      {...formRegister('phone')}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.phone?.message && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone?.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="mt-1 relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="password"
                      type="password"
                      autoComplete="new-password"
                      className="pl-10"
                      placeholder="Create a password"
                      {...formRegister('password')}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.password?.message && (
                    <p className="mt-1 text-sm text-red-600">{errors.password?.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="mt-1 relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      className="pl-10"
                      placeholder="Confirm your password"
                      {...formRegister('confirmPassword')}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.confirmPassword?.message && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword?.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full mt-4"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating account...' : 'Create account'}
                </Button>
              </form>
              <div className="mt-4 w-full">
                <Link href="/" className="block">
                  <Button variant="outline" className="w-full">
                    ← Back to booking
                  </Button>
                </Link>
              </div>
            </div> {/* Close main content wrapper */}
          </CardContent>
        </Card>
      </div>
    </>
  );
}