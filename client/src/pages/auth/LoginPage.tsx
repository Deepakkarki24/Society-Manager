import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { login } from '@/store/slices/authSlice';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';
import { Building2 } from 'lucide-react';
import loginPageImage from '@/assets/images/login-img.png'

interface LoginForm {
  email: string;
  password: string;
}

export const LoginPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading } = useAppSelector((s) => s.auth);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    const result = await dispatch(login(data));
    if (login.fulfilled.match(result)) {
      toast.success('Welcome back!');
      navigate('/dashboard');
    } else {
      toast.error(result.payload as string);
    }
  };

  return (
    <div className="relative flex h-dvh">
      <img className='absolute top-0 left-0 -z-2 w-full h-full object-cover brightness-[0.60]' src={loginPageImage} alt="image" />
      <div className="absolute inset-0 -z-1 backdrop-blur-sm bg-linear-to-br from-surface/80 via-surface/60 to-primary-900/40" />
      <div className="hidden flex-1 items-center justify-center lg:flex">
        <div className="max-w-md px-8">
          <div className='flex gap-3 items-center justify-start w-fit'>
            <Building2 className="h-16 w-16 text-primary-400" />
            <h1 className="text-4xl font-bold text-gradient-primary">SIMP</h1>
          </div>
          <p className="mt-4 text-xl tracking-wide text-primary-200">
            <span className='font-semibold'>Society Issues Management Platform</span>
          </p>
          <p className="mt-4 text-lg text-text-secondary">
            AI-powered complaints, maintenance, announcements, and resident management.
          </p>
        </div>
      </div>
      <div className="relative flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-md glass-strong rounded-2xl p-8 ai-glow">
          <h2 className="text-2xl font-bold text-text-primary">Sign in</h2>
          <p className="mt-1 text-sm text-text-secondary">Enter your credentials to access your account</p>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
            <Input
              label="Email"
              type="email"
              {...register('email', { required: 'Email is required' })}
              error={errors.email?.message}
            />
            <Input
              label="Password"
              type="password"
              {...register('password', { required: 'Password is required' })}
              error={errors.password?.message}
            />
            <Button type="submit" loading={loading} className="w-full">
              Sign in
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-text-secondary">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="font-semibold text-primary-400 hover:text-primary-300 hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
