import useAuthStore from "@/components/Auth/AuthStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGetUserInformation } from "@/services/userProfile";
import { userUpdateSchema, userUpdateType } from "@/types/request/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { FieldErrors, useForm } from "react-hook-form";
import { MessageDialog } from "./MessageDialog";

interface messageDialogProps {
  open: boolean;
  message: string;
  title: string;
  type: "success" | "error" | "info";
}

const UserUpdateForm = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [messageDialog, setMessageDialog] = useState<messageDialogProps>({
    open: false,
    message: "",
    title: "",
    type: "success" as const,
  });

  const { userEmail, userFirstName, userLastName, trimmedUserRole, userRole } =
    useGetUserInformation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(userUpdateSchema),
    defaultValues: {
      first_name: userFirstName ?? "",
      last_name: userLastName ?? "",
      email: userEmail ?? "",
    },
  });

  const { updateUser, user } = useAuthStore();

  const handleUpdateProfile = async (data: userUpdateType) => {
    setIsLoading(true);
    if (!user) {
      setIsLoading(false);
      setMessageDialog({
        open: true,
        message: "User not found",
        title: "Error",
        type: "error",
      });
      return;
    }
    await updateUser(
      user.id,
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

  type userUpdateFields = "first_name" | "last_name" | "email";

  interface RenderFieldProps {
    label: string;
    field_name: userUpdateFields;
    errors: FieldErrors<userUpdateType>;
  }

  const renderField = ({ label, field_name, errors }: RenderFieldProps) => {
    return (
      <div className="w-full">
        <Label>{label}</Label>
        <Input {...register(field_name)} />
        {errors && errors[field_name as keyof typeof errors] && (
          <span className="text-xs text-red-500">
            {errors[field_name as keyof typeof errors]?.message}
          </span>
        )}
      </div>
    );
  };

  return (
    <>
      <form onSubmit={handleSubmit(handleUpdateProfile)}>
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>
              Manage your profile information here.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src="/placeholder.svg?height=80&width=80"
                  alt="Profile picture"
                />
                <AvatarFallback>{trimmedUserRole(userRole)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-2xl font-semibold">
                  {userFirstName} {userLastName}
                </h3>
                <p className="text-sm text-muted-foreground">{userEmail}</p>
              </div>
            </div>
            {renderField({
              label: "First Name",
              field_name: "first_name",
              errors,
            })}
            {renderField({
              label: "Last Name",
              field_name: "last_name",
              errors,
            })}
            {renderField({ label: "Email", field_name: "email", errors })}
          </CardContent>
          <CardFooter>
            <Button type="submit">
              {isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Save Changes"
              )}
            </Button>
          </CardFooter>
        </Card>
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

export default UserUpdateForm;
