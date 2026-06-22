export interface CompanyData {
  companyName: string;
  registrationNo: string;
  industry: string;
}

export interface AdminData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

export interface DashboardHeaderProps {
  mode: "live" | "sandbox";
  setMode: (mode: "live" | "sandbox") => void;
  hasNotification: boolean;
  setHasNotification: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
  subtitle?: string;
}

export interface SidebarItem {
  title: string;
  url: string;
  icon: React.ComponentType<any>;
}

export interface NavGroup {
  id: string;
  label?: string;
  items: SidebarItem[];
}
