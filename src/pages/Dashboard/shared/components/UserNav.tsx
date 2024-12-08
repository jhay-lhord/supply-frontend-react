import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ACCESS_TOKEN } from "@/constants";
import {
  getRoleFromToken,
  getEmailFromToken,
  getFullnameFromToken,
} from "@/utils/jwtHelper";

export const UserNav = () => {
  const access_token = localStorage.getItem(ACCESS_TOKEN) 
  const userRole = getRoleFromToken(access_token!);
  const userEmail = getEmailFromToken();
  const userFullname = getFullnameFromToken();
  const trimmedUserRole = userRole
    .split(" ")
    .map((word) => word[0])
    .join("");

  const navigate = useNavigate();
  const handleLogoutClick = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10  rounded-full p-2 "
        >
          <Avatar className="h-10 w-10">
            <AvatarImage src="/avatars/01.png" alt="@shadcn" />
            <AvatarFallback>{trimmedUserRole}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-base font-medium leading-none">{userRole}</p>
            <p className="text-sm">{userFullname}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {userEmail}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogoutClick}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
