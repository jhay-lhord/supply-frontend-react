import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Eye, EyeOff } from "lucide-react"; // Import icons for visibility toggle
import ErrorCard from "@/components/ErrorCard";
import { InputOTPForm } from "@/pages/Forms/InputOTPForm";

import api from "../../api";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsloading] = useState<boolean>(false);
  const [isOTPSent, setIsOTPSent] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false); // State for toggling password visibility

  const handleSubmit = async (event: React.FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsloading(true);
    setError("");

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
    <div className="flex h-screen">
      {/* Image Section */}
      <div className="w-2/5 flex justify-center items-center">
        <img
          src="image1.svg"
          alt="Illustration"
          className="w-4/5 h-auto object-contain"
        />
      </div>

      {/* Form Section */}
      {!isOTPSent ? (
        <div className="flex justify-center items-center w-3/5 bg-white">
          <div className="p-7 border border-slate rounded-lg w-96 flex flex-col justify-between space-y-4">
            <div>
              <p className="font-extrabold text-xl">Login</p>
              <p className="mt-2 mb-5 text-gray-600">
                Enter your Email and Password to log into your account.
              </p>

              {/* Error Display */}
              {error && <ErrorCard description={error} />}

              {/* Email Input */}
              <div className="mb-4">
                <Label htmlFor="email" className="my-2">
                  Email
                </Label>
                <Input
                  id="email"
                  className="w-full"
                  placeholder="email@example.com"
                  onChange={handleEmailChange}
                  value={email}
                />
              </div>

              {/* Password Input with Toggle */}
              <div className="mb-4 relative">
                <Label htmlFor="password">Password</Label>
                <Input
                  type={showPassword ? "text" : "password"} // Toggle between text and password
                  id="password"
                  className="w-full pr-10" // Ensure padding for the toggle button
                  placeholder="Your password"
                  onChange={handlePasswordChange}
                  value={password}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center" // Center the icon vertically
                  onClick={togglePasswordVisibility}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button className="w-full mt-4" onClick={handleSubmit}>
              {isLoading ? <Loader2 className="animate-spin" /> : "Login"}
            </Button>

            {/* Register Link */}
            <p className="mt-4 text-center">
              Don't have an account?{" "}
              <span className="text-sky-500">
                <Link to="/register">Register</Link>
              </span>
            </p>
          </div>
        </div>
      ) : (
        // OTP Form
        <InputOTPForm />
      )}
    </div>
  );
};

export default Login;
