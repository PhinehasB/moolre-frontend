export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  wallet: "Linked" | "Provisioning";
  status: "Active" | "Pending" | "Suspended";
  salary: number;
  avatarColor: string;
}

export interface TeamTableProps {
  employees?: Employee[];
  totalCount?: number;
  activeCount?: number;
  isLoading?: boolean;
  title?: string;
  showViewAll?: boolean;
  onViewAll?: () => void;
  onAddEmployee?: (employee: Employee) => void;
}

export interface PayrollRun {
  id: string;
  period: string;
  runDate: string;
  employees: number;
  successRate: number;
  totalPaid: number;
  status: string;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  reference: string;
  status: "Success" | "Failed" | "Pending";
  amount: number;
  type: "inflow" | "payout";
}


export type Report = {
  id: string;
  name: string;
  period: string;
  records: string;
  formats: string[];
  kind?: string;
};