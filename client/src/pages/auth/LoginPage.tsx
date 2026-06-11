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
      <img className='absolute top-0 left-0 -z-2 w-full h-full object-cover brightness-30' src={loginPageImage} alt="image" />
      <div className="hidden flex-1 items-center justify-center backdrop-blur-lg lg:flex">
        <div className="max-w-md px-8 text-white">
          <div className='flex gap-2 items-center justify-start w-fit'>
            <Building2 className="h-16 w-16" />
            <h1 className="text-4xl font-bold">SIMP</h1>
          </div>
          <p className="mt-4 text-xl tracking-wider text-primary-100">
            <span className='font-semibold'>Society Issues Management Platform</span>
          </p>
          <p className="mt-4 text-lg italic tracking-wider text-primary-100">
            AI-powered complaints, maintenance, announcements, and resident management.
          </p>
        </div>
      </div>
      <div className="relative flex flex-1 items-center justify-center p-8">
        {/* dark overlay */}
        {/* <div className='w-full h-full absolute bg-black/70 -z-2 top-0 right-0' /> */}
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Sign in</h2>
          <p className="mt-1 text-sm text-white/80 font-semibold">Enter your credentials to access your account</p>
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
          <p className="mt-6 text-center text-sm font-semibold text-white/80">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="font-semibold text-primary-500 hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
