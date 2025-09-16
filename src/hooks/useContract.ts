import { useReadContract, useWriteContract, useAccount } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import { config } from '../../config';

// Contract ABI - This would be generated from the compiled contract
const CONTRACT_ABI = [
  {
    "inputs": [
      {"internalType": "string", "name": "_name", "type": "string"},
      {"internalType": "string", "name": "_position", "type": "string"},
      {"internalType": "address", "name": "_walletAddress", "type": "address"},
      {"internalType": "bytes", "name": "_baseSalary", "type": "bytes"},
      {"internalType": "bytes", "name": "_salaryProof", "type": "bytes"}
    ],
    "name": "addEmployee",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_employeeId", "type": "uint256"}],
    "name": "getEmployeeInfo",
    "outputs": [
      {"internalType": "string", "name": "name", "type": "string"},
      {"internalType": "string", "name": "position", "type": "string"},
      {"internalType": "uint8", "name": "baseSalary", "type": "uint8"},
      {"internalType": "uint8", "name": "bonus", "type": "uint8"},
      {"internalType": "uint8", "name": "totalEarnings", "type": "uint8"},
      {"internalType": "uint8", "name": "taxDeduction", "type": "uint8"},
      {"internalType": "uint8", "name": "netSalary", "type": "uint8"},
      {"internalType": "bool", "name": "isActive", "type": "bool"},
      {"internalType": "bool", "name": "isVerified", "type": "bool"},
      {"internalType": "address", "name": "walletAddress", "type": "address"},
      {"internalType": "uint256", "name": "startDate", "type": "uint256"},
      {"internalType": "uint256", "name": "lastPaymentDate", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_paymentId", "type": "uint256"}],
    "name": "getPaymentInfo",
    "outputs": [
      {"internalType": "uint8", "name": "amount", "type": "uint8"},
      {"internalType": "uint8", "name": "taxAmount", "type": "uint8"},
      {"internalType": "uint8", "name": "netAmount", "type": "uint8"},
      {"internalType": "bool", "name": "isProcessed", "type": "bool"},
      {"internalType": "string", "name": "paymentHash", "type": "string"},
      {"internalType": "address", "name": "processedBy", "type": "address"},
      {"internalType": "uint256", "name": "timestamp", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

export const useSalaryContract = () => {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();

  const addEmployee = async (
    name: string,
    position: string,
    walletAddress: string,
    baseSalary: string,
    salaryProof: string
  ) => {
    if (!config.salaryContractAddress) {
      throw new Error('Contract address not configured');
    }

    return writeContract({
      address: config.salaryContractAddress as `0x${string}`,
      abi: CONTRACT_ABI,
      functionName: 'addEmployee',
      args: [name, position, walletAddress as `0x${string}`, baseSalary, salaryProof],
    });
  };

  const getEmployeeInfo = (employeeId: number) => {
    return useReadContract({
      address: config.salaryContractAddress as `0x${string}`,
      abi: CONTRACT_ABI,
      functionName: 'getEmployeeInfo',
      args: [BigInt(employeeId)],
    });
  };

  const getPaymentInfo = (paymentId: number) => {
    return useReadContract({
      address: config.salaryContractAddress as `0x${string}`,
      abi: CONTRACT_ABI,
      functionName: 'getPaymentInfo',
      args: [BigInt(paymentId)],
    });
  };

  return {
    addEmployee,
    getEmployeeInfo,
    getPaymentInfo,
    isConnected: !!address,
    address,
  };
};

export const useEmployeeData = (employeeId?: number) => {
  const { getEmployeeInfo } = useSalaryContract();
  
  return useQuery({
    queryKey: ['employee', employeeId],
    queryFn: async () => {
      if (!employeeId) return null;
      const result = getEmployeeInfo(employeeId);
      return result.data;
    },
    enabled: !!employeeId,
  });
};

export const usePaymentData = (paymentId?: number) => {
  const { getPaymentInfo } = useSalaryContract();
  
  return useQuery({
    queryKey: ['payment', paymentId],
    queryFn: async () => {
      if (!paymentId) return null;
      const result = getPaymentInfo(paymentId);
      return result.data;
    },
    enabled: !!paymentId,
  });
};
