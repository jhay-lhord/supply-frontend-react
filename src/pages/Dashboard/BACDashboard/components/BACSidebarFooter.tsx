import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuButton, useSidebar } from "@/components/ui/sidebar";
import {
  trimmedUserRole,
  userEmail,
  userFullname,
  userRole,
} from "@/services/useProfile";
import { ChevronsUpDownIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Logout } from "@/components/Auth/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const BACSidebarFooter = () => {
  const { open } = useSidebar();

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
                <AvatarFallback className="bg-orange-200">{trimmedUserRole(userRole)}</AvatarFallback>
              </Avatar>
            </div>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="top"
          className="w-[--radix-popper-anchor-width]"
        >
          <DropdownMenuLabel>User Profile</DropdownMenuLabel>
          <DropdownMenuItem>
            <span>Account</span>
          </DropdownMenuItem>
          <Separator />
          <DropdownMenuItem onClick={() => Logout()}>
            <span>Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
