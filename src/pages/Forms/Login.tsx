import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Eye, EyeOff } from "lucide-react";
import ErrorCard from "@/components/ErrorCard";
import { InputOTPForm } from "@/pages/Forms/InputOTPForm";
import api from "../../api";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsloading] = useState<boolean>(false);
  const [isOTPSent, setIsOTPSent] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsloading(true);
    setError("");

    if (!email || !password) {
      setError("Both email and password are required.");
      setIsloading(false);
      return;
    }

    api
      .post("/api/user/login_token/", {
        email,
        password,
      })
      .then((response) => {
        if (response.status === 200) {
          setIsOTPSent(true);
          localStorage.setItem("email", email);
        }
      })
      .catch((error) => {
        console.error(error);
        if (error.code === "ERR_NETWORK") {
          setError(`${error.message}, Please check your Internet Connection`);
        } else if (error.response?.status === 400) {
          setError("No active account found with the given credentials");
        } else {
          setError("An unexpected error occurred. Please try again.");
        }
      })
      .finally(() => {
        setIsloading(false);
      });
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <div className="relative flex h-screen justify-center items-center">
      {/* Background Image with Blur */}
      <div
        className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
        style={{
          backgroundImage: "url('/image2.jpg')", // Replace this with the path to your image
          filter: "blur(8px )", // Adjust blur value if necessary
        }}
      ></div>

      {/* Content Section */}
      <div className="relative flex border border-[#FDE3CF] rounded-lg w-[800px] shadow-lg bg-white z-10">
        {/* Image Section */}
        <div className="flex justify-center items-center w-1/2 border-r border-[#FDE3CF] p-5 shadow-lg bg-blue-50">
          <img
            src="CTU_new_logotransparent.svg"
            alt="Illustration"
            className="w-full h-auto object-contain"
          />
        </div>

        {/* Form Section */}
        <div className="flex justify-center items-center w-1/2 p-7">
          {!isOTPSent ? (
            <div className="w-full flex flex-col justify-between space-y-4">
              <div>
                <p className="text-3xl font-normal text-gray-900 text-center mt-0 mb-6">
                  Sign in to Supply Office
                </p>

                {error && <ErrorCard description={error} />}

                {/* Email Input */}
                <div className="mb-4">
                  <Label
                    htmlFor="email"
                    className="my-2 text-lg font-normal text-gray-900"
                  >
                    Email
                  </Label>
                  <Input
                    id="email"
                    className="w-full"
                    placeholder="email@example.com"
                    onChange={handleEmailChange}
                    value={email}
                    aria-required="true"
                  />
                </div>

                {/* Password Input with Toggle */}
                <div className="mb-4 relative">
                  <Label
                    htmlFor="password"
                    className="my-2 text-lg font-normal text-gray-900"
                  >
                    Password
                  </Label>
                  <Input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className="w-full pr-10"
                    placeholder="Your password"
                    onChange={handlePasswordChange}
                    value={password}
                    aria-required="true"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center"
                    onClick={togglePasswordVisibility}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    aria-pressed={showPassword}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 mt-7" />
                    ) : (
                      <Eye className="w-5 h-5 mt-7" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                className="w-full mt-4"
                onClick={handleSubmit}
                disabled={isLoading || !email || !password}
              >
                {isLoading ? <Loader2 className="animate-spin" /> : "Login"}
              </Button>

              <p className="mt-4 text-center">
                Don't have an account?{" "}
                <span className="text-sky-500">
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