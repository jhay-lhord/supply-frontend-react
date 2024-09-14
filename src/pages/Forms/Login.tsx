import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import ErrorCard from "@/components/ErrorCard";
import { InputOTPForm } from "@/pages/Forms/InputOTPForm";

import api from "../../api";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsloading] = useState<boolean>(false);
  const [isOTPSent, setIsOTPSent] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

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
        setIsloading(true);
        if (response.status === 200) setIsOTPSent(true)
        localStorage.setItem("email", email);

      })
      .catch((error) => {
        console.error(error);
        if(error.code === 'ERR_NETWORK'){
          setError(`${error.message}, Please check your Internet Connection`)
        }

        if(error.code === 'ERR_BAD_REQUEST'){
          setError('No active account found with the given credentials')
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

  return (
    <>
      {!isOTPSent ? (
        <div className=" h-screen rounded border-2 border-slate flex justify-center items-center ">
          <div className=" p-7 border-2 border-slate rounded  w-1/4 ">
            <p className="font-extrabold text-xl">Login</p>
            <p className="mt-2 mb-5 text-gray-600">
              Enter your Email and Password to Login your account
            </p>
            {error && <ErrorCard description={error.toString()} />}
            <Label htmlFor="username" className="my-2">
              Email
            </Label>
            <Input
              id="email"
              className="mb-4"
              onChange={handleEmailChange}
              value={email}
            />
            <Label htmlFor="password" className="">
              Password
            </Label>
            <Input
              type="password"
              id="password"
              className=""
              onChange={handlePasswordChange}
              value={password}
            ></Input>
            {}

            <Button className="w-full mt-4" onClick={handleSubmit}>
              {isLoading ? <Loader2 className=" animate-spin" /> : "Login"}
            </Button>
            <p>
              Don't Have an account?
              <span className="px-1 text-sky-500">
                <Link to="/register">Register</Link>
              </span>
            </p>
          </div>
        </div>
      ) : (
        <InputOTPForm />
      )}
    </>
  );
};

export default Login;
