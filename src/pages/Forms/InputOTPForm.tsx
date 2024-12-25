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
import { useEffect, useState } from "react";
import useAuthStore from "@/components/Auth/AuthStore";
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
  const [otpMessage, setOtpMessage] = useState<{
    text: string;
    type: "error" | "success" | null;
  }>({ text: "", type: null });
  const [isResending, setIsResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const { verifyOTP, resendOTP, email } = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const otp_code = data.otp_code;
    setIsloading(true);
    setOtpMessage({ text: "", type: null });
    await verifyOTP(
      email!,
      otp_code,
      (successMessage) => {
        navigate("/");
        toast({
          title: successMessage,
          description: " Welcome back, CTU AC Supply Management System",
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
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0) return;

    setIsResending(true);
    setResendTimer(60)
    await resendOTP(
      email!,
      (successMessage) => {
        setOtpMessage({ text: successMessage, type: "success" });
        setIsResending(false);
      },
      (errorMessage) => {
        setOtpMessage({ text: errorMessage, type: "error" });
        setIsResending(false);
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
                {otpMessage && (
                  <p
                    className={`${
                      otpMessage.type === "error" && "text-red-400"
                    } text-green-400 text-sm`}
                  >
                    {otpMessage.text}
                  </p>
                )}
              </FormItem>
            )}
          />

          <Button
            className="w-full mt-4 rounded-full"
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="animate-spin" /> : "Submit"}
          </Button>
        </form>
        <div className="mt-4 text-center">
          <button
            disabled={isResending || resendTimer > 0}
            className={`text-sm ${
              resendTimer > 0
                ? "text-gray-400 cursor-not-allowed"
                : "text-black"
            } focus:outline-none transition duration-300 ease-in-out`}
          >
            {isResending ? (
              <span className="flex items-center justify-center">
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                Resending...
              </span>
            ) : resendTimer > 0 ? (
              `Resend OTP in ${resendTimer}s`
            ) : (
              <p>
                Didn't receive the code?{" "}
                <span onClick={handleResendOTP}>Resend OTP</span>
              </p>
            )}
          </button>
        </div>
      </Form>
    </div>
  );
}
