import useAuthStore from "@/components/Auth/AuthStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  userUpdatePasswordSchema,
  userUpdatePasswordType,
} from "@/types/request/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { FieldErrors, useForm } from "react-hook-form";
import { MessageDialog } from "./MessageDialog";

interface messageDialogProps {
  open: boolean;
  message: string;
  title: string;
  type: "success" | "error" | "info";
}

const UserUpdatePasswordForm = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [messageDialog, setMessageDialog] = useState<messageDialogProps>({
    open: false,
    message: "",
    title: "",
    type: "success" as const,
  });
  const { updateUserPassword } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<userUpdatePasswordType>({
    resolver: zodResolver(userUpdatePasswordSchema),
  });

  const handleUpdatePassword = async (data: userUpdatePasswordType) => {
    setIsLoading(true);

    await updateUserPassword(
      data,
      (onSuccess) => {
        setIsLoading(false);
        setMessageDialog({
          open: true,
          message: onSuccess,
          title: "Success",
          type: "success",
        });
      },
      (onError) => {
        setIsLoading(false);
        setMessageDialog({
          open: true,
          message: onError,
          title: "Error",
          type: "error",
        });
      }
    );
  };

  type userUpdatePasswordFields =
    | "old_password"
    | "new_password"
    | "confirm_password";

  interface RenderFieldProps {
    label: string;
    field_name: userUpdatePasswordFields;
    errors: FieldErrors<userUpdatePasswordType>;
  }

  const PasswordField = ({ label, field_name, errors }: RenderFieldProps) => {
    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => {
      setShowPassword(!showPassword);
    };

    return (
      <div className="w-full space-y-2">
        <Label htmlFor={field_name}>{label}</Label>
        <div className="relative">
          <Input
            {...register(field_name)}
            id={field_name}
            type={showPassword ? "text" : "password"}
            className="pr-10"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={toggleShowPassword}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-gray-500" />
            ) : (
              <Eye className="h-4 w-4 text-gray-500" />
            )}
          </button>
        </div>
        {errors && errors[field_name] && (
          <span className="text-xs text-red-500">
            {errors[field_name].message}
          </span>
        )}
      </div>
    );
  };
  return (
    <>
      <form onSubmit={handleSubmit(handleUpdatePassword)} className="space-y-4">
        {PasswordField({
          label: "Current Password",
          field_name: "old_password",
          errors,
        })}
        {PasswordField({
          label: "New Password",
          field_name: "new_password",
          errors,
        })}
        {PasswordField({
          label: "Confirm Password",
          field_name: "confirm_password",
          errors,
        })}
        <Button type="submit">
          {isLoading ? <Loader2 className="animate-spin" /> : "Change Password"}
        </Button>
      </form>
      <MessageDialog
        open={messageDialog.open}
        message={messageDialog.message}
        title={messageDialog.title}
        type={messageDialog.type}
        onOpenChange={(open) => setMessageDialog((prev) => ({ ...prev, open }))}
      />
    </>
  );
};

export default UserUpdatePasswordForm;
