import { Label } from "@/components/ui/label";
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
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";


import { registerFormSchema, type RegisterInputData } from "@/types/request/input";
import api from "@/api";

const Register = () => {
  const [loading, setIsloading] = useState<boolean>(false);
  const [role, setRole] = useState<string>("")
  const [emailError, setEmailError] = useState<string>("")

  const navigate = useNavigate()

  const { register, formState: {errors}, handleSubmit, setValue} = useForm<RegisterInputData>({
    resolver: zodResolver(registerFormSchema)
  });

  const onSubmit = async (data: RegisterInputData) => {
    setIsloading(true)
    setEmailError("")

    api.post('api/user/register/', {
      first_name: data.first_name, 
      last_name: data.last_name,
      role: data.role,
      email: data.email,
      password: data.password,
      password2: data.password2
    }).then((response) => {
      console.log(response)
      navigate('/')
    }).catch((error) => {
      console.log(error)
      setEmailError(error?.response?.data?.email || "An error occured")
    }).finally(() => {
      setIsloading(false)
    })
  }

  const handleRoleChange = (roleValue: string) => {
    setRole(roleValue);
    setValue('role',roleValue)
  }
  

  return (
    <>
      <div className=" h-screen flex justify-center items-center ">
        <form className=" p-7 rounded border-2 border-slate w-1/4 " onSubmit={handleSubmit(onSubmit)}>
          {errors.email && (<p className="text-red-500 ">{errors.email.message}</p>)}
          {emailError && (<p className="text-red-500 ">{emailError}</p>)}

          <p className="font-extrabold text-xl">Account</p>
          <p className="mt-2 mb-5 text-gray-600">Create an account</p>
          <Label htmlFor="first-name" className="my-2">
            First Name
          </Label>
          <Input
            id="first-name"
            className="mb-4"
            {...register("first_name")}
          />
          {errors.first_name && (<p className="text-red-500 ">{errors.first_name.message}</p>)}


          <Label htmlFor="last-name" className="my-2">
            Last Name
          </Label>
          <Input
            id="last-name"
            className="mb-4"
            {...register("last_name")}
          />
          {errors.last_name && (<p className="text-red-500 ">{errors.last_name.message}</p>)}


          <Label htmlFor="email" className="my-2">
            Role
          </Label>
          <Select onValueChange={handleRoleChange}>
            <SelectTrigger className="w-full mb-4">
              <SelectValue placeholder="Select Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Supply Officer" {...register("role")}>Supply Officer</SelectItem>
              <SelectItem value="Budget Officer" {...register("role")}>Budget Officer</SelectItem>
              <SelectItem value="BAC Officer" {...register("role")}>BAC Officer</SelectItem>
              <SelectItem value="Admin" {...register("role")}>Admin</SelectItem>
            </SelectContent>
          </Select>
          {errors.role && (<p className="text-red-500 ">{errors.role.message}</p>)}

          <Label htmlFor="email" className="my-2">
            Email
          </Label>
          <Input
            id="email"
            className="mb-4"
            {...register("email")}
            placeholder="example@gmail.com"
          />
          {errors.email && (<p className="text-red-500 ">{errors.email.message}</p>)}

          <Label htmlFor="password" className="">
            Password
          </Label>
          <Input
            type="password"
            id="password"
            className="mb-4"
            {...register("password")}
          ></Input>
          {errors.password && (<p className="text-red-500 ">{errors.password.message}</p>)}

          <Label htmlFor="password" className="">
            Confirm Password
          </Label>
          <Input
            type="password"
            id="confirm-password"
            className=""  
            {...register("password2")}
          ></Input>
          {errors.password2 && (<p className="text-red-500 ">{errors.password2.message}</p>)}


          <Button type="submit" className="w-full mt-4" >
            {loading ? <Loader2 className="animate-spin" /> : "Register"}
          </Button>
          <p>
            Already have an Account?{" "}
            <span className="text-sky-500">
              <Link to="/">Login</Link>
            </span>
          </p>
        </form>
      </div>
    </>
  );
};

export default Register;
