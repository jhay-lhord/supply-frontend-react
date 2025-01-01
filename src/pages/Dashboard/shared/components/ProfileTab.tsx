"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGetUserInformation } from "@/services/userProfile";
import useAuthStore from "@/components/Auth/AuthStore";
import { userUpdateSchema, userUpdateType } from "@/types/request/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { MessageDialog } from "./MessageDialog";

interface messageDialogProps {
  open: boolean;
  message: string;
  title: string;
  type: "success" | "error" | "info";
}

export const ProfileTab = () => {
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

  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [messageDialog, setMessageDialog] = useState<messageDialogProps>({
    open: false,
    message: "",
    title: "",
    type: "success" as const,
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

  console.log(errors);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword({ ...password, [e.target.name]: e.target.value });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Password change submitted", password);
    // Reset form after submission
    setPassword({ current: "", new: "", confirm: "" });
  };

  return (
    <>
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
        <ScrollArea className="h-[450px]">
          <TabsContent value="profile">
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
                      <AvatarFallback>
                        {trimmedUserRole(userRole)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-2xl font-semibold">
                        {userFirstName} {userLastName}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {userEmail}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">First Name</Label>
                    <Input {...register("first_name")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">Last Name</Label>
                    <Input {...register("last_name")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input type="email" {...register("email")} />
                  </div>
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
          </TabsContent>
          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                  Update your password here. We recommend using a strong, unique
                  password.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input
                      id="current-password"
                      name="current"
                      type="password"
                      value={password.current}
                      onChange={handlePasswordChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      name="new"
                      type="password"
                      value={password.new}
                      onChange={handlePasswordChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirm-password"
                      name="confirm"
                      type="password"
                      value={password.confirm}
                      onChange={handlePasswordChange}
                      required
                    />
                  </div>
                  <Button type="submit">Change Password</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </ScrollArea>
      </Tabs>
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
