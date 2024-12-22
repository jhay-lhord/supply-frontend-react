import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";

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
import useAuthStore from "@/components/Auth/authStore";
import { useToast } from "@/hooks/use-toast";

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
  const [otpError, setOtpError] = useState<string>("");
  const { verifyOTP, email } = useAuthStore();

  const navigate = useNavigate();
  const { toast } = useToast();

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const otp_code = data.otp_code;
    setIsloading(true);
    setOtpError("");
    await verifyOTP(
      email!,
      otp_code,
      (successMessage) => {
        toast({
          title: successMessage,
          description: " Welcome back, CTU AC Supply Management System",
        });
        navigate("/")
      },
      (errorMessage) => {
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    );
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="otp_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-1xl font-normal text-gray-900 text-center mt-0 mb-6">
                  One-Time Password
                </FormLabel>
                <FormControl>
                  <InputOTP maxLength={6} {...field}>
                    <InputOTPGroup className="w-full flex">
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
                  Please enter the one-time password sent to your email.
                </FormDescription>
                <FormMessage />
                {otpError && <p className="text-red-500 text-sm">{otpError}</p>}
              </FormItem>
            )}
          />

          <Button className="w-full mt-4 rounded-full">
            {isLoading ? <Loader2 className="animate-spin" /> : "Submit"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
