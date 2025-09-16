import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, Zap, CheckCircle, Lock } from "lucide-react";
import { useAccount } from 'wagmi';

export const WalletConnect = () => {
  const { address, isConnected } = useAccount();

  if (isConnected && address) {
    return (
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <CheckCircle className="h-5 w-5 text-success" />
            </div>
            <div>
              <CardTitle className="text-lg">Wallet Connected</CardTitle>
              <CardDescription>Ready to receive encrypted salary payments</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Connected Address</p>
              <p className="font-mono text-sm break-all">{address}</p>
            </div>
            <ConnectButton />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-card">
      <CardHeader className="text-center">
        <div className="mx-auto p-3 rounded-full bg-primary/10 mb-4 w-fit">
          <Wallet className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-xl">Connect Your Wallet</CardTitle>
        <CardDescription>
          Connect your crypto wallet to receive encrypted salary payments securely
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/10">
            <Zap className="h-5 w-5 text-accent" />
            <div>
              <p className="font-medium text-sm">FHE Encryption</p>
              <p className="text-xs text-muted-foreground">Your salary data stays encrypted</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/10">
            <Lock className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium text-sm">Blockchain Secured</p>
              <p className="text-xs text-muted-foreground">Immutable transaction records</p>
            </div>
          </div>
        </div>
        
        <ConnectButton />
      </CardContent>
    </Card>
  );
};