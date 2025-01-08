import { useState } from "react";
import { Link } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { InputOTPForm } from "@/pages/Forms/InputOTPForm";
import { FieldErrors, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userLoginSchema, userLoginType } from "@/types/request/user";
import { useToast } from "@/hooks/use-toast";
import useAuthStore from "@/components/Auth/AuthStore";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Login = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const { checkUser, errorMessage, otpSent } = useAuthStore();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(userLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: userLoginType) => {
    setIsLoading(true);
    await checkUser(
      data.email,
      data.password,
      (successMessage) => {
        toast({
          title: "Success",
          description: successMessage,
        });
      },
      (errorMessage) => {
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    );
    setIsLoading(false);
  };

  interface RenderFieldProps {
    label: string;
    field_name: "email" | "password";
    errors: FieldErrors<userLoginType>;
  }

  const renderField = ({ label, field_name, errors }: RenderFieldProps) => (
    <div className="w-full relative">
      <Label>{label}</Label>
      <div className="relative">
        <Input
          type={
            field_name === "password" && !showPassword ? "password" : "text"
          }
          {...register(field_name)}
          className="w-full pr-10"
        />
        {field_name === "password" && (
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
            onClick={togglePasswordVisibility}
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5 text-gray-500" />
            ) : (
              <Eye className="w-5 h-5 text-gray-500" />
            )}
          </button>
        )}
      </div>
      {errors && errors[field_name as keyof typeof errors] && (
        <span className="text-xs text-red-500">
          {errors[field_name as keyof typeof errors]?.message}
        </span>
      )}
    </div>
  );

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <div className="relative flex h-screen justify-center items-center">
      <div
        className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
        style={{
          backgroundImage: "url('/image2.jpg')",
          filter: "blur(8px )",
        }}
      ></div>

      <div className="relative flex border border-[#FDE3CF] rounded-lg w-[800px] shadow-lg bg-white z-10">
        <div className="flex justify-center items-center w-1/2 border-r border-[#FDE3CF] p-5 shadow-lg bg-blue-50">
          <img
            src="/CTU_new_logotransparent.svg"
            alt="Illustration"
            className="w-full h-auto object-contain"
          />
        </div>
        <div className="flex justify-center items-center w-1/2 p-7">
          {!otpSent ? (
            <div className="w-full flex flex-col justify-between space-y-4">
              <div>
                <p className="text-3xl font-normal text-gray-900 text-center mt-0 mb-6">
                  Sign in to Supply Office
                </p>

                {errorMessage && (
                  <Alert variant={"destructive"}>
                    <AlertDescription>
                      <p className="text-red-500">{errorMessage}</p>
                    </AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit(onSubmit)}>
                  {renderField({ label: "Email", field_name: "email", errors })}
                  {renderField({
                    label: "Password",
                    field_name: "password",
                    errors,
                  })}
                  <Button
                    type="submit"
                    className="w-full mt-4"
                    disabled={isLoading}
                  >
                    {isLoading ? <Loader2 className="animate-spin" /> : "Login"}
                  </Button>
                </form>
              </div>

              <p className="mt-4 text-center">
                Don't have an account?{" "}
                <span className="text-orange-300">
                  <Link to="/register">Register</Link>
                </span>
              </p>
            </div>
          ) : (
            <InputOTPForm />
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
