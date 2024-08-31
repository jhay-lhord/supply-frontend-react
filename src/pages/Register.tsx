import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import ErrorCard from "@/components/ErrorCard";
import api from "../api";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [first_name, setFirstname] = useState<string>("");
  const [last_name, setLastname] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setIsloading] = useState<boolean>(false);
  const [usernameError, setUsernameError] = useState<string>("");

  const navigate = useNavigate()


  const handleSubmit = async (event: React.FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsloading(true);
    setUsernameError("")
    console.log(first_name, last_name, username, email, password);

    api
      .post("/api/user/register/", {
        first_name,
        last_name,
        username,
        email,
        password,
      })
      .then((response) => {
        setIsloading(true);
        console.log(response);
        navigate("/login")
      })
      .catch((error) => {
        console.log(error.response.data);
        setUsernameError(error.response.data.username);
      })
      .finally(() => {
        setIsloading(false);
      });
  };

  console.log(usernameError.toString());

  const handleFirstnameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFirstname(event.target.value);
  };

  const handleLastnameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLastname(event.target.value);
  };

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
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

          {usernameError && (
            <ErrorCard description={usernameError.toString()} />
          )}

          <p className="font-extrabold text-xl">Account</p>
          <p className="mt-2 mb-5 text-gray-600">Create an account</p>
          <Label htmlFor="first-name" className="my-2">
            First Name
          </Label>
          <Input
            id="first-name"
            className="mb-4"
            onChange={handleFirstnameChange}
            value={first_name}
          />

          <Label htmlFor="last-name" className="my-2">
            Last Name
          </Label>
          <Input
            id="last-name"
            className="mb-4"
            onChange={handleLastnameChange}
            value={last_name}
            placeholder=""
          />

          <Label htmlFor="username" className="my-2">
            Username
          </Label>
          <Input
            id="username"
            className={`mb-4 ${usernameError && "border-red-500"}`}
            onChange={handleUsernameChange}
            value={username}
            placeholder=""
          />

          <Label htmlFor="email" className="my-2">
            Email
          </Label>
          <Input
            id="email"
            className="mb-4"
            onChange={handleEmailChange}
            value={email}
            placeholder="example@gmail.com"
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

          <Button className="w-full mt-4" onClick={handleSubmit}>
            {loading ? <Loader2 className="animate-spin"/> : "Register"}
          </Button>
          <p>
            Already have an Account?{" "}
            <span className="text-sky-500">
              <Link to="/login">Login</Link>
            </span>
          </p>
        </div>
      </div>
    </>
  );
};

export default Register;
