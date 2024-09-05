import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ErrorCard from "@/components/ErrorCard";

import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/constants";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsloading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsloading(true);
    setError("")

    api
      .post("/api/token/", {
        email,
        password,
      })
      .then((response) => {
        setIsloading(true);
        localStorage.setItem(ACCESS_TOKEN, response.data.access);
        localStorage.setItem(REFRESH_TOKEN, response.data.refresh);

        console.log(response.status);
        if (response.status === 200) {
          navigate("/supply-dashboard");
        } else {
          navigate("/login");
        }
      })
      .catch((error) => {
        console.error(error);
        setError(error.response.data.detail);
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
      <div className=" h-screen flex justify-center items-center ">
        <div className=" p-7 rounded border-2 border-slate w-1/4 ">
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
          {

          }

          <Button className="w-full mt-4" onClick={handleSubmit}>   
            {isLoading ? <Loader2 className=" animate-spin" /> : "Login"}
          </Button>
          <p>
            Don't Have an account?
            <span className="px-1 text-sky-500">
              <Link to="/">Register</Link>
            </span>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
