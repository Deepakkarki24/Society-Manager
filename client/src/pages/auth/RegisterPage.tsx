import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { register as registerUser } from "@/store/slices/authSlice";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import api from "@/services/api";
import toast from "react-hot-toast";
import type { Society } from "@/types";

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  societyId: string;
  flatNumber: string;
  block: string;
}

export const RegisterPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading } = useAppSelector((s) => s.auth);
  const [societies, setSocieties] = useState<Society[]>([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>();

  useEffect(() => {
    api
      .get("/societies/public")
      .then(({ data }) => {
        setSocieties(data.data || []);
      })
      .catch(() => {});
  }, []);

  const onSubmit = async (data: RegisterForm) => {
    const result = await dispatch(registerUser(data));
    if (registerUser.fulfilled.match(result)) {
      toast.success("Account created!");
      navigate("/dashboard");
    } else {
      toast.error(result.payload as string);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-bold dark:text-white">Create account</h2>
        <p className="mt-1 text-sm text-gray-500">Register as a resident</p>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
          <Input
            label="Full Name"
            {...register("name", { required: true })}
            error={errors.name && "Required"}
          />
          <Input
            label="Email"
            type="email"
            {...register("email", { required: true })}
          />
          <Input
            label="Password"
            type="password"
            {...register("password", { required: true, minLength: 6 })}
          />
          <Select
            label="Society"
            options={[
              { value: "", label: "Select society" },
              ...societies.map((s) => ({ value: s._id, label: s.name })),
            ]}
            {...register("societyId", { required: true })}
          />
          <Input
            label="Flat Number"
            {...register("flatNumber", { required: true })}
          />
          <Input label="Block" {...register("block")} />
          <Button type="submit" loading={loading} className="w-full">
            Register
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="text-primary-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};
