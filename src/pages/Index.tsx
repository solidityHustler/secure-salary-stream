import { WalletConnect } from "@/components/WalletConnect";
import { PayrollDashboard } from "@/components/PayrollDashboard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Shield, Eye, Lock, Users } from "lucide-react";
import { useAccount } from 'wagmi';
import heroImage from "@/assets/hero-crypto-payroll.jpg";

const Index = () => {
  const { address, isConnected } = useAccount();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="gradient-hero absolute inset-0 opacity-90" />
        
        <div className="relative z-10 container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Salary Payments, <br />
              <span className="text-primary-glow">Kept Private.</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 leading-relaxed">
              Employers send tokenized salaries via smart contract. 
              Encrypted amounts prevent peer comparison while ensuring transparency.
            </p>
            
            <div className="flex flex-wrap justify-center gap-6 mb-12">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-lg">
                  <Shield className="h-6 w-6" />
                </div>
                <span className="text-lg">End-to-End Encryption</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-lg">
                  <Eye className="h-6 w-6" />
                </div>
                <span className="text-lg">Private Salary Data</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-lg">
                  <Lock className="h-6 w-6" />
                </div>
                <span className="text-lg">Blockchain Secured</span>
              </div>
            </div>

            {!isConnected && (
              <Button variant="wallet" size="lg" className="text-lg px-8 py-4">
                Get Started
              </Button>
            )}
          </div>
        </div>
      </section>

      <Separator className="opacity-20" />

      {/* Main Content */}
      <section className="container mx-auto px-4 py-12">
        {!isConnected ? (
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Connect to Get Started</h2>
              <p className="text-muted-foreground">
                Connect your wallet to view and receive your encrypted salary payments
              </p>
            </div>
            <WalletConnect />
          </div>
        ) : (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold mb-4">Your Payroll Dashboard</h2>
              <p className="text-xl text-muted-foreground">
                View your encrypted salary history and manage payments
              </p>
            </div>
            
            <PayrollDashboard walletAddress={address} />
          </div>
        )}
      </section>

      {/* Features Section */}
      {!isConnected && (
        <section className="bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Choose Encrypted Payroll?</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Modern payroll solutions that protect employee privacy while maintaining transparency and compliance.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Complete Privacy</h3>
                <p className="text-muted-foreground">
                  Salary amounts are encrypted, preventing workplace comparison and maintaining confidentiality.
                </p>
              </div>
              
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center">
                  <Lock className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold">Blockchain Security</h3>
                <p className="text-muted-foreground">
                  Smart contracts ensure payments are secure, transparent, and automatically executed.
                </p>
              </div>
              
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center">
                  <Users className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-semibold">HR Friendly</h3>
                <p className="text-muted-foreground">
                  Seamless integration with existing HR systems and modern payroll workflows.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Index;
