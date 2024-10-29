import { Toaster } from "sonner";

const CustomToaster = () => (
  <Toaster
    position="top-right"
    toastOptions={{
      className: "bg-gray-800 text-white",
      duration: 5000,
      style: {
        borderRadius: "8px",
        padding: "16px",
        border: "1px solid #E5E7EB",
      },
    }}
  />
);

export default CustomToaster;
