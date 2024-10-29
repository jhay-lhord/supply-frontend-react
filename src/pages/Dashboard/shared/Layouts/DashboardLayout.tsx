import { UserNav } from "@/pages/Dashboard/shared/components/UserNav";
// import Image from 'next/image';
import Logo from '/public/CTU_new_logotransparent.svg'; // Adjust the path according to your setup

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navigation */}
      <header className="fixed top-0 right-0 left-0 z-10 shadow bg-white">
        <div className="flex h-16 items-center px-4">
          {/* Replacing LOGO with an image */}
          <img src={Logo} alt="Logo" width={50} height={50}  style={{ display: 'block' }} />
          <div className="ml-auto flex items-center space-x-4">
            <UserNav />
          </div>
        </div>
      </header>

      <div className="flex bg-slate-200">{children}</div>
    </div>
  );
};

export default DashboardLayout;