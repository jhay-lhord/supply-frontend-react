import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuButton, useSidebar } from "@/components/ui/sidebar";
import { useGetUserInformation } from "@/services/useProfile";
import { ChevronsUpDownIcon, LogOut, User } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import useAuthStore from "@/components/Auth/authStore";
import { useToast } from "@/hooks/use-toast";

export const CustomSidebarFooter = () => {
  const { open } = useSidebar();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { userEmail, userFullname, trimmedUserRole, userRole } =
    useGetUserInformation();
  const { logout } = useAuthStore();

  const handleLogoutUser = () => {
    logout((successMessage) => {
      navigate("/login");
      toast({
        title: successMessage,
        description:
          "You have been successfully logged out. See you next time!",
      });
    });
  };

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {open ? (
            <SidebarMenuButton className="py-8 rounded-md bg-gradient-to-r from-orange-300 to-amber-200 hover:bg-orange-100">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/avatars/01.png" alt="@shadcn" />
                <AvatarFallback>{trimmedUserRole(userRole)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <p className="text-sm">{userFullname}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {userEmail}
                </p>
              </div>
              <ChevronsUpDownIcon className="ml-auto" />
            </SidebarMenuButton>
          ) : (
            <div className="flex items-center justify-center">
              <Avatar className=" w-8 h-8 bg-orange-200">
                <AvatarImage src="/avatars/01.png" alt="@shadcn" />
                <AvatarFallback className="bg-orange-200">
                  {trimmedUserRole(userRole)}
                </AvatarFallback>
              </Avatar>
            </div>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="top"
          className="w-[--radix-popper-anchor-width]"
        >
          <DropdownMenuItem>
            <div className="w-full flex items-center gap-2 bg-orange-200 p-2 rounded">
              <Avatar className="h-6 w-6">
                <AvatarImage src="/avatars/01.png" alt="@shadcn" />
                <AvatarFallback>{trimmedUserRole(userRole)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <p className="text-xs">{userEmail}</p>
              </div>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <div className="flex gap-2">
              <User className="h-4 w-4" />
              <p>Account</p>
            </div>
          </DropdownMenuItem>
          <Separator />
          <DropdownMenuItem onClick={handleLogoutUser}>
            <div className="flex gap-2">
              <LogOut className="h-4 w-4" />
              <p>Log out</p>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
