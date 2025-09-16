import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SalaryCard } from "./SalaryCard";
import { FHEPayrollManager } from "./FHEPayrollManager";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, TrendingUp, Zap, Clock, Eye } from "lucide-react";

interface PayrollDashboardProps {
  walletAddress: string;
}

const mockSalaryData = [
  {
    id: "1",
    month: "December",
    year: 2024,
    encryptedAmount: "0x4a7b9c3d2f8e1a6b",
    actualAmount: 8500,
    currency: "USD",
    status: "received" as const,
    date: "Dec 1, 2024",
    employer: "TechCorp Inc."
  },
  {
    id: "2",
    month: "November",
    year: 2024,
    encryptedAmount: "0x8e2f1c5a9b4d7f3e",
    actualAmount: 8500,
    currency: "USD",
    status: "received" as const,
    date: "Nov 1, 2024",
    employer: "TechCorp Inc."
  },
  {
    id: "3",
    month: "October",
    year: 2024,
    encryptedAmount: "0x3f7e9a2c5d8b1f4a",
    actualAmount: 8200,
    currency: "USD",
    status: "received" as const,
    date: "Oct 1, 2024",
    employer: "TechCorp Inc."
  },
  {
    id: "4",
    month: "January",
    year: 2025,
    encryptedAmount: "0x7d4f2e8c1a9b6f3d",
    actualAmount: 8800,
    currency: "USD",
    status: "pending" as const,
    date: "Jan 1, 2025",
    employer: "TechCorp Inc."
  },
  {
    id: "5",
    month: "February",
    year: 2025,
    encryptedAmount: "0x9c5e7a1f3b8d2e4f",
    actualAmount: 8800,
    currency: "USD",
    status: "processing" as const,
    date: "Feb 1, 2025",
    employer: "TechCorp Inc."
  }
];

export const PayrollDashboard = ({ walletAddress }: PayrollDashboardProps) => {
  const totalReceived = mockSalaryData
    .filter(s => s.status === "received")
    .reduce((sum, s) => sum + s.actualAmount, 0);
  
  const pendingPayments = mockSalaryData.filter(s => s.status === "pending").length;

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Received</CardTitle>
            <DollarSign className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              ${totalReceived.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all payments
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">
              {pendingPayments}
            </div>
            <p className="text-xs text-muted-foreground">
              Awaiting payment
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">FHE Encryption</CardTitle>
            <Zap className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">100%</div>
            <p className="text-xs text-muted-foreground">
              Fully homomorphic
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">+7.3%</div>
            <p className="text-xs text-muted-foreground">
              From last quarter
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Wallet Info */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Connected Wallet
            <Badge variant="secondary" className="bg-success/10 text-success">
              Active
            </Badge>
          </CardTitle>
          <CardDescription>
            Your encrypted salary payments are sent to this address
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-3 bg-muted rounded-lg">
            <p className="font-mono text-sm break-all">{walletAddress}</p>
          </div>
        </CardContent>
      </Card>

      {/* FHE Payroll Management */}
      <Tabs defaultValue="history" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="history" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Payment History
          </TabsTrigger>
          <TabsTrigger value="fhe" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            FHE Manager
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="history" className="space-y-4">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Encrypted Payment History</CardTitle>
              <CardDescription>
                Your FHE-encrypted salary payments and transaction history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockSalaryData.map((salary) => (
                  <SalaryCard key={salary.id} salary={salary} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="fhe" className="space-y-4">
          <FHEPayrollManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};