import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Eye, EyeOff } from "lucide-react"; // Import eye icons
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  registerFormSchema,
  type RegisterInputData,
} from "@/types/request/input";
import { useRegisterUser } from "@/services/registerUserServices";

const Register = () => {
  const [isloading, setIsloading] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false); // State for password visibility
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false); // State for confirm password visibility

  const navigate = useNavigate();
  const { mutate } = useRegisterUser();

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm<RegisterInputData>({
    resolver: zodResolver(registerFormSchema),
  });

  const onSubmit = async (data: RegisterInputData) => {
    setIsloading(true);
    setEmailError("");

    const result = registerFormSchema.safeParse(data);

    if (result.success) {
      mutate(data, {
        onSuccess: () => {
          setIsloading(false);
          navigate("/");
        },
      });
    }
  };

  const handleRoleChange = (roleValue: string) => {
    setValue("role", roleValue);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  return (
    <div className="relative flex h-screen justify-center items-center">
      <div
        className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
        style={{
          backgroundImage: "url('/image2.jpg')",
          filter: "blur(8px)",
        }}
      ></div>

      <div className="relative flex border border-slate rounded-lg w-[800px] shadow-lg border-[#FDE3CF] bg-white z-10">
        <div className="flex justify-center items-center w-1/2 border-r border-slate p-5 shadow-lg border-[#FDE3CF] bg-blue-50">
          <img
            src="/CTU_new_logotransparent.svg"
            alt="Illustration"
            className="w-full h-auto object-contain"
          />
        </div>

        <div className="flex justify-center items-center w-1/2 p-7">
          <form
            className="w-full flex flex-col justify-between space-y-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            {emailError && <p className="text-red-500">{emailError}</p>}

            <p className="font-normal text-3xl mt-0 mb-6 text-gray-900 text-center">
              Create an Account
            </p>

            <div>
              <Input placeholder="Employee ID" {...register("employee_id")} />
              {errors.employee_id && (
                <p className="text-red-500">{errors.employee_id.message}</p>
              )}
            </div>

            <div className="flex gap-4">
              <div className="w-full">
                <Input placeholder="First Name" {...register("first_name")} />
                {errors.first_name && (
                  <p className="text-red-500">{errors.first_name.message}</p>
                )}
              </div>
              <div className="w-full">
                <Input placeholder="Last Name" {...register("last_name")} />
                {errors.last_name && (
                  <p className="text-red-500">{errors.last_name.message}</p>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-full">
                <Input placeholder="email@gmail.com" {...register("email")} />
                {errors.email && (
                  <p className="text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="w-full">
                <Select onValueChange={handleRoleChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Supply Officer">
                      Supply Officer
                    </SelectItem>
                    <SelectItem value="BAC Officer">BAC Officer</SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && (
                  <p className="text-red-500">{errors.role.message}</p>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <div className="relative w-full">
                <Input
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-red-500">{errors.password.message}</p>
                )}
                <button
                  type="button"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={togglePasswordVisibility}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              <div className="relative w-full">
                <Input
                  placeholder="Confirm Password"
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("password2")}
                />
                {errors.password2 && (
                  <p className="text-red-500">{errors.password2.message}</p>
                )}
                <button
                  type="button"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={toggleConfirmPasswordVisibility}
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full mt-4">
              {isloading ? <Loader2 className="animate-spin" /> : "Register"}
            </Button>

            <p className="mt-4 text-center">
              Already have an Account?{" "}
              <span className="text-sky-500">
                <Link to="/">Login</Link>
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
