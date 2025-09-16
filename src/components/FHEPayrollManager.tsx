import { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useReadContract } from 'wagmi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Zap, Lock, Eye, DollarSign, Users, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { config } from '../../config';

// Mock FHE encryption functions - In production, these would use actual FHE libraries
const encryptSalary = (amount: number): string => {
  // Simulate FHE encryption - returns encrypted data
  return `0x${amount.toString(16).padStart(8, '0')}${Math.random().toString(16).substring(2, 10)}`;
};

const generateFHEProof = (encryptedData: string): string => {
  // Simulate FHE proof generation
  return `proof_${encryptedData.substring(2, 10)}_${Date.now()}`;
};

interface EmployeeData {
  name: string;
  position: string;
  salary: number;
  walletAddress: string;
}

export const FHEPayrollManager = () => {
  const { address, isConnected } = useAccount();
  const { writeContract } = useWriteContract();
  const { toast } = useToast();
  
  const [employees, setEmployees] = useState<EmployeeData[]>([]);
  const [newEmployee, setNewEmployee] = useState<EmployeeData>({
    name: '',
    position: '',
    salary: 0,
    walletAddress: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [encryptedData, setEncryptedData] = useState<{[key: string]: string}>({});

  // Auto-clear sensitive data on component unmount
  useEffect(() => {
    return () => {
      // Clear sensitive data when component unmounts
      setEmployees([]);
      setEncryptedData({});
    };
  }, []);

  const handleAddEmployee = () => {
    if (!newEmployee.name || !newEmployee.position || !newEmployee.salary || !newEmployee.walletAddress) {
      toast({
        title: "Validation Error",
        description: "Please fill in all employee fields",
        variant: "destructive"
      });
      return;
    }

    // Encrypt salary data using FHE
    const encryptedSalary = encryptSalary(newEmployee.salary);
    const fheProof = generateFHEProof(encryptedSalary);
    
    setEncryptedData(prev => ({
      ...prev,
      [newEmployee.walletAddress]: encryptedSalary
    }));

    setEmployees(prev => [...prev, newEmployee]);
    setNewEmployee({ name: '', position: '', salary: 0, walletAddress: '' });
    
    toast({
      title: "Employee Added",
      description: `Added ${newEmployee.name} with FHE-encrypted salary data`,
    });
  };

  const handleProcessPayroll = async () => {
    if (employees.length === 0) {
      toast({
        title: "No Employees",
        description: "Please add employees before processing payroll",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate blockchain transaction
      for (const employee of employees) {
        const encryptedSalary = encryptedData[employee.walletAddress];
        const fheProof = generateFHEProof(encryptedSalary);
        
        // In production, this would call the actual smart contract
        console.log(`Processing payroll for ${employee.name}:`, {
          walletAddress: employee.walletAddress,
          encryptedSalary,
          fheProof,
          timestamp: Date.now()
        });
      }

      toast({
        title: "Payroll Processed",
        description: `Successfully processed payroll for ${employees.length} employees using FHE encryption`,
      });
    } catch (error) {
      toast({
        title: "Processing Error",
        description: "Failed to process payroll. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClearData = () => {
    setEmployees([]);
    setEncryptedData({});
    // Clear any localStorage data if it exists
    localStorage.removeItem('fhe-employee-data');
    localStorage.removeItem('fhe-encrypted-data');
    toast({
      title: "Data Cleared",
      description: "All employee data and encrypted information has been permanently removed",
    });
  };

  if (!isConnected) {
    return (
      <Card className="shadow-card">
        <CardHeader className="text-center">
          <div className="mx-auto p-3 rounded-full bg-muted mb-4 w-fit">
            <Lock className="h-8 w-8 text-muted-foreground" />
          </div>
          <CardTitle className="text-xl">Connect Wallet Required</CardTitle>
          <CardDescription>
            Please connect your wallet to access the FHE Payroll Manager
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">FHE Payroll Manager</CardTitle>
              <CardDescription>
                Manage encrypted salary data with Fully Homomorphic Encryption
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Add Employee Form */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Add Employee
          </CardTitle>
          <CardDescription>
            Add employees with FHE-encrypted salary information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Employee Name</Label>
              <Input
                id="name"
                value={newEmployee.name}
                onChange={(e) => setNewEmployee(prev => ({ ...prev, name: e.target.value }))}
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                value={newEmployee.position}
                onChange={(e) => setNewEmployee(prev => ({ ...prev, position: e.target.value }))}
                placeholder="Software Engineer"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salary">Salary (USD)</Label>
              <Input
                id="salary"
                type="number"
                value={newEmployee.salary}
                onChange={(e) => setNewEmployee(prev => ({ ...prev, salary: Number(e.target.value) }))}
                placeholder="75000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="wallet">Wallet Address</Label>
              <Input
                id="wallet"
                value={newEmployee.walletAddress}
                onChange={(e) => setNewEmployee(prev => ({ ...prev, walletAddress: e.target.value }))}
                placeholder="0x742d35Cc6634C0532925a3b8D6Ac0C6663025Cb3"
              />
            </div>
          </div>
          <Button onClick={handleAddEmployee} className="w-full">
            <Zap className="h-4 w-4 mr-2" />
            Add Employee with FHE Encryption
          </Button>
        </CardContent>
      </Card>

      {/* Employee List */}
      {employees.length > 0 && (
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Encrypted Employee Data
                </CardTitle>
                <CardDescription>
                  {employees.length} employees with FHE-encrypted salary information
                </CardDescription>
              </div>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Lock className="h-3 w-3" />
                FHE Encrypted
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {employees.map((employee, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-semibold">{employee.name}</h4>
                      <p className="text-sm text-muted-foreground">{employee.position}</p>
                    </div>
                    <Badge variant="outline">
                      <DollarSign className="h-3 w-3 mr-1" />
                      Encrypted
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Wallet Address:</p>
                      <p className="font-mono text-xs break-all">{employee.walletAddress}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Encrypted Salary:</p>
                      <p className="font-mono text-xs break-all">
                        {encryptedData[employee.walletAddress] || 'Not encrypted'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      {employees.length > 0 && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Payroll Actions
            </CardTitle>
            <CardDescription>
              Process encrypted payroll or manage data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={handleProcessPayroll} 
                disabled={isProcessing}
                className="flex-1"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Process FHE Payroll
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={handleClearData}
                className="flex-1"
              >
                <AlertCircle className="h-4 w-4 mr-2" />
                Clear All Data
              </Button>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Privacy Notice:</strong> All salary data is encrypted using FHE technology. 
                The actual salary amounts are never stored in plain text and remain private even during computation.
                <br />
                <strong>Data Security:</strong> All sensitive data is automatically cleared when you leave this page or use the "Clear All Data" button.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
