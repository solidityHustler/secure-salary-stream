import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, Calendar, ArrowDownToLine, Shield, Download, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface SalaryData {
  id: string;
  month: string;
  year: number;
  encryptedAmount: string;
  actualAmount: number;
  currency: string;
  status: "pending" | "received" | "processing";
  date: string;
  employer: string;
}

interface SalaryCardProps {
  salary: SalaryData;
}

export const SalaryCard = ({ salary }: SalaryCardProps) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "received":
        return "bg-success text-success-foreground";
      case "processing":
        return "bg-secondary text-secondary-foreground";
      case "pending":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: salary.currency,
    }).format(amount);
  };

  const handleDownloadReceipt = async () => {
    setIsDownloading(true);
    
    // Simulate receipt generation and download
    setTimeout(() => {
      // Create a receipt content
      const receiptData = {
        employer: salary.employer,
        employee: "Connected Wallet",
        period: `${salary.month} ${salary.year}`,
        amount: formatAmount(salary.actualAmount),
        paymentDate: salary.date,
        transactionId: salary.encryptedAmount,
        status: salary.status
      };

      // Generate receipt content
      const receiptContent = `
ENCRYPTED PAYROLL RECEIPT
========================

Employer: ${receiptData.employer}
Employee: ${receiptData.employee}
Pay Period: ${receiptData.period}
Payment Date: ${receiptData.paymentDate}

Amount: ${receiptData.amount}
Transaction ID: ${receiptData.transactionId}
Status: ${receiptData.status.toUpperCase()}

This receipt confirms the encrypted salary payment
processed through blockchain smart contract.

Generated on: ${new Date().toLocaleString()}
      `.trim();

      // Create and download file
      const blob = new Blob([receiptContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `salary-receipt-${salary.month}-${salary.year}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      setIsDownloading(false);
      toast({
        title: "Receipt Downloaded Successfully",
        description: `Your ${salary.month} ${salary.year} salary receipt has been downloaded to your device.`,
      });
    }, 1500);
  };

  const handleClaimPayment = async () => {
    setIsClaiming(true);
    
    // Simulate blockchain transaction for claiming payment
    setTimeout(() => {
      setIsClaiming(false);
      toast({
        title: "Payment Claim Initiated",
        description: `Your ${salary.month} ${salary.year} salary payment claim has been submitted to the blockchain. Processing typically takes 2-5 minutes.`,
      });
      
      // Simulate status change after claiming
      setTimeout(() => {
        toast({
          title: "Payment Processing",
          description: "Your payment is now being processed by the smart contract.",
        });
      }, 3000);
    }, 2000);
  };

  return (
    <Card className="shadow-card hover:shadow-elevated transition-smooth">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              {salary.month} {salary.year}
              <Shield className="h-4 w-4 text-accent" />
            </CardTitle>
            <CardDescription>From {salary.employer}</CardDescription>
          </div>
          <Badge className={getStatusColor(salary.status)} variant="secondary">
            {salary.status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="p-4 bg-encrypted/5 rounded-lg border border-encrypted/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-encrypted">Salary Amount</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsRevealed(!isRevealed)}
                className="h-auto p-1"
              >
                {isRevealed ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Encrypted:</span>
                <code className="text-xs bg-muted p-1 rounded font-mono">
                  {salary.encryptedAmount}
                </code>
              </div>
              
              {isRevealed && (
                <div className="flex items-center gap-2 animate-in fade-in-0 duration-300">
                  <span className="text-xs text-muted-foreground">Amount:</span>
                  <span className="text-xl font-bold text-success">
                    {formatAmount(salary.actualAmount)}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Payment Date: {salary.date}</span>
          </div>
        </div>
        
        {salary.status === "received" && (
          <Button 
            variant="outline" 
            className="w-full" 
            size="sm"
            onClick={handleDownloadReceipt}
            disabled={isDownloading}
          >
            {isDownloading ? (
              <>
                <Download className="h-4 w-4 mr-2 animate-spin" />
                Generating Receipt...
              </>
            ) : (
              <>
                <ArrowDownToLine className="h-4 w-4 mr-2" />
                Download Receipt
              </>
            )}
          </Button>
        )}
        
        {salary.status === "pending" && (
          <Button 
            variant="crypto" 
            className="w-full" 
            size="sm"
            onClick={handleClaimPayment}
            disabled={isClaiming}
          >
            {isClaiming ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2 animate-pulse" />
                Processing Claim...
              </>
            ) : (
              <>
                <ArrowDownToLine className="h-4 w-4 mr-2" />
                Claim Payment
              </>
            )}
          </Button>
        )}
        
        {salary.status === "processing" && (
          <Button 
            variant="secondary" 
            className="w-full" 
            size="sm"
            disabled
          >
            <CheckCircle className="h-4 w-4 mr-2 animate-pulse" />
            Payment Processing...
          </Button>
        )}
      </CardContent>
    </Card>
  );
};