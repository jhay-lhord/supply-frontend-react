import { ChevronsUpDown, LogOut, User } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";
import useAuthStore from "@/components/Auth/AuthStore";
import { useGetUserInformation } from "@/services/userProfile";
import LoadingDialog from "./LoadingDialog";
import { ProfileTab } from "./ProfileTab";
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export function CustomSidebarFooter() {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const { isMobile } = useSidebar();
  const { toast } = useToast();
  const { userEmail, userFirstName, userLastName, trimmedUserRole, userRole } =
    useGetUserInformation();
  const { logout, isLoggingOut } = useAuthStore();

  const handleLogoutUser = () => {
    logout((successMessage) => {
      toast({
        title: successMessage,
        description:
          "You have been successfully logged out. See you next time!",
      });
    });
  };

  const handleProfileClick = () => {
    setIsDialogOpen(true)
    setIsDropdownOpen(false)
  }

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground py-8 rounded-md bg-gradient-to-bl from-orange-300 to-orange-400 hover:bg-orange-100"
                >
                  <Avatar className="h-8 w-8 rounded-full">
                    <AvatarImage src={userEmail} alt={userLastName} />
                    <AvatarFallback className="rounded-lg">
                      {trimmedUserRole(userRole)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {userFirstName} {userLastName}
                    </span>
                    <span className="truncate text-xs">{userEmail}</span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align="end"
                sideOffset={4}
                forceMount
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src={userFirstName} alt={userFirstName} />
                      <AvatarFallback className="rounded-lg">
                        {trimmedUserRole(userRole)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {userFirstName} {userLastName}
                      </span>
                      <span className="truncate text-xs">{userEmail}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DialogTrigger asChild>
                    <DropdownMenuItem
                      onSelect={handleProfileClick}
                    >
                      <User className="size-4 mr-2" />
                      Account
                    </DropdownMenuItem>
                  </DialogTrigger>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogoutUser}>
                  <LogOut className="size-4 mr-2" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DialogContent className="max-w-3xl">
              <ProfileTab />
            </DialogContent>
          </Dialog>
        </SidebarMenuItem>
      </SidebarMenu>
      <LoadingDialog open={isLoggingOut} message="Logging out..." />
    </>
  );
}
