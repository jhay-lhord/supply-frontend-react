import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import UserUpdateForm from "./UserUpdateForm";
import UserUpdatePasswordForm from "./UserUpdatePasswordForm";


export const ProfileTab = () => {

  return (
    <>
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
        <ScrollArea className="h-[450px]">
          <TabsContent value="profile">
            <UserUpdateForm/>
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
                <UserUpdatePasswordForm/>
              </CardContent>
            </Card>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </>
  );
};
