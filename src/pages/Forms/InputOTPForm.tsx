import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import api from "../../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/constants";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useState } from "react";

const FormSchema = z.object({
  otp_code: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

export function InputOTPForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      otp_code: "",
    },
  });
  const [isLoading, setIsloading] = useState<boolean>(false);

  const navigate = useNavigate();

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    const email = localStorage.getItem("email");
    const otp_code = data.otp_code;
    setIsloading(true);
    console.log(data.otp_code);
    api
      .post("/api/user/login_verify_otp/", { email, otp_code })
      .then((response) => {
        localStorage.setItem(ACCESS_TOKEN, response.data.access);
        localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
        if (response.status === 200) {
          navigate("/dashboard");
        } else {
          navigate("/login");
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsloading(false);
      });
  };

  return (
    <div className="h-screen  flex justify-center items-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="p-4 rounded border-2 border-slate w-1/4"
        >
          <FormField
            control={form.control}
            name="otp_code"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>One-Time Password</FormLabel>
                <FormControl>
                  <InputOTP maxLength={6} {...field}>
                    <InputOTPGroup className=" w-full flex">
                      <InputOTPSlot className="flex-grow" index={0} />
                      <InputOTPSlot className="flex-grow" index={1} />
                      <InputOTPSlot className="flex-grow" index={2} />
                      <InputOTPSlot className="flex-grow" index={3} />
                      <InputOTPSlot className="flex-grow" index={4} />
                      <InputOTPSlot className="flex-grow" index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormDescription className="text-xs">
                  Please enter the one-time password sent to your phone.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button className="w-full mt-4 rounded-full">
            {isLoading ? <Loader2 className=" animate-spin" /> : "Submit"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
