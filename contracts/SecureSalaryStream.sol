// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";
import { euint32, externalEuint32, euint8, ebool, FHE } from "@fhevm/solidity/lib/FHE.sol";

contract SecureSalaryStream is SepoliaConfig {
    using FHE for *;
    
    struct Employee {
        euint32 employeeId;
        euint32 baseSalary;
        euint32 bonus;
        euint32 totalEarnings;
        euint32 taxDeduction;
        euint32 netSalary;
        bool isActive;
        bool isVerified;
        string name;
        string position;
        address walletAddress;
        uint256 startDate;
        uint256 lastPaymentDate;
    }
    
    struct SalaryPayment {
        euint32 paymentId;
        euint32 employeeId;
        euint32 amount;
        euint32 taxAmount;
        euint32 netAmount;
        bool isProcessed;
        string paymentHash;
        address processedBy;
        uint256 timestamp;
    }
    
    struct PayrollPeriod {
        euint32 periodId;
        euint32 totalEmployees;
        euint32 totalGrossSalary;
        euint32 totalTaxDeduction;
        euint32 totalNetSalary;
        bool isProcessed;
        bool isVerified;
        uint256 startDate;
        uint256 endDate;
        uint256 processedAt;
    }
    
    mapping(uint256 => Employee) public employees;
    mapping(uint256 => SalaryPayment) public salaryPayments;
    mapping(uint256 => PayrollPeriod) public payrollPeriods;
    mapping(address => uint256) public employeeAddressToId;
    mapping(address => euint32) public employeeReputation;
    
    uint256 public employeeCounter;
    uint256 public paymentCounter;
    uint256 public periodCounter;
    
    address public owner;
    address public hrManager;
    address public verifier;
    
    event EmployeeAdded(uint256 indexed employeeId, address indexed walletAddress, string name);
    event SalaryPaid(uint256 indexed paymentId, uint256 indexed employeeId, address indexed employee);
    event PayrollProcessed(uint256 indexed periodId, uint256 totalEmployees);
    event EmployeeVerified(uint256 indexed employeeId, bool isVerified);
    event ReputationUpdated(address indexed employee, uint32 reputation);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier onlyHRManager() {
        require(msg.sender == hrManager || msg.sender == owner, "Only HR manager can call this function");
        _;
    }
    
    modifier onlyVerifier() {
        require(msg.sender == verifier || msg.sender == owner, "Only verifier can call this function");
        _;
    }
    
    constructor(address _hrManager, address _verifier) {
        owner = msg.sender;
        hrManager = _hrManager;
        verifier = _verifier;
    }
    
    function addEmployee(
        string memory _name,
        string memory _position,
        address _walletAddress,
        externalEuint32 _baseSalary,
        bytes calldata _salaryProof
    ) public onlyHRManager returns (uint256) {
        require(bytes(_name).length > 0, "Employee name cannot be empty");
        require(_walletAddress != address(0), "Invalid wallet address");
        require(employeeAddressToId[_walletAddress] == 0, "Employee already exists");
        
        uint256 employeeId = employeeCounter++;
        
        // Convert externalEuint32 to euint32 using FHE.fromExternal
        euint32 internalBaseSalary = FHE.fromExternal(_baseSalary, _salaryProof);
        
        employees[employeeId] = Employee({
            employeeId: FHE.asEuint32(0), // Will be set properly later
            baseSalary: internalBaseSalary,
            bonus: FHE.asEuint32(0),
            totalEarnings: internalBaseSalary,
            taxDeduction: FHE.asEuint32(0), // Will be calculated based on salary
            netSalary: FHE.asEuint32(0), // Will be calculated
            isActive: true,
            isVerified: false,
            name: _name,
            position: _position,
            walletAddress: _walletAddress,
            startDate: block.timestamp,
            lastPaymentDate: 0
        });
        
        employeeAddressToId[_walletAddress] = employeeId;
        
        emit EmployeeAdded(employeeId, _walletAddress, _name);
        return employeeId;
    }
    
    function processSalaryPayment(
        uint256 _employeeId,
        externalEuint32 _bonus,
        externalEuint32 _taxRate,
        bytes calldata _bonusProof,
        bytes calldata _taxProof
    ) public onlyHRManager returns (uint256) {
        require(employees[_employeeId].walletAddress != address(0), "Employee does not exist");
        require(employees[_employeeId].isActive, "Employee is not active");
        
        uint256 paymentId = paymentCounter++;
        
        // Convert external values to internal FHE values
        euint32 internalBonus = FHE.fromExternal(_bonus, _bonusProof);
        euint32 internalTaxRate = FHE.fromExternal(_taxRate, _taxProof);
        
        // Calculate salary components
        euint32 grossSalary = FHE.add(employees[_employeeId].baseSalary, internalBonus);
        euint32 taxAmount = FHE.mul(grossSalary, internalTaxRate);
        euint32 netSalary = FHE.sub(grossSalary, taxAmount);
        
        // Update employee records
        employees[_employeeId].bonus = internalBonus;
        employees[_employeeId].totalEarnings = grossSalary;
        employees[_employeeId].taxDeduction = taxAmount;
        employees[_employeeId].netSalary = netSalary;
        employees[_employeeId].lastPaymentDate = block.timestamp;
        
        // Create payment record
        salaryPayments[paymentId] = SalaryPayment({
            paymentId: FHE.asEuint32(0), // Will be set properly later
            employeeId: FHE.asEuint32(_employeeId),
            amount: grossSalary,
            taxAmount: taxAmount,
            netAmount: netSalary,
            isProcessed: true,
            paymentHash: "", // Will be set with actual transaction hash
            processedBy: msg.sender,
            timestamp: block.timestamp
        });
        
        emit SalaryPaid(paymentId, _employeeId, employees[_employeeId].walletAddress);
        return paymentId;
    }
    
    function processPayrollPeriod(
        uint256 _startDate,
        uint256 _endDate,
        uint256[] memory _employeeIds
    ) public onlyHRManager returns (uint256) {
        require(_startDate < _endDate, "Invalid date range");
        require(_employeeIds.length > 0, "No employees provided");
        
        uint256 periodId = periodCounter++;
        
        // Initialize period totals
        euint32 totalEmployees = FHE.asEuint32(_employeeIds.length);
        euint32 totalGrossSalary = FHE.asEuint32(0);
        euint32 totalTaxDeduction = FHE.asEuint32(0);
        euint32 totalNetSalary = FHE.asEuint32(0);
        
        // Process each employee
        for (uint256 i = 0; i < _employeeIds.length; i++) {
            uint256 employeeId = _employeeIds[i];
            require(employees[employeeId].isActive, "Employee is not active");
            
            // Add to totals
            totalGrossSalary = FHE.add(totalGrossSalary, employees[employeeId].totalEarnings);
            totalTaxDeduction = FHE.add(totalTaxDeduction, employees[employeeId].taxDeduction);
            totalNetSalary = FHE.add(totalNetSalary, employees[employeeId].netSalary);
        }
        
        payrollPeriods[periodId] = PayrollPeriod({
            periodId: FHE.asEuint32(0), // Will be set properly later
            totalEmployees: totalEmployees,
            totalGrossSalary: totalGrossSalary,
            totalTaxDeduction: totalTaxDeduction,
            totalNetSalary: totalNetSalary,
            isProcessed: true,
            isVerified: false,
            startDate: _startDate,
            endDate: _endDate,
            processedAt: block.timestamp
        });
        
        emit PayrollProcessed(periodId, _employeeIds.length);
        return periodId;
    }
    
    function verifyEmployee(uint256 _employeeId, bool _isVerified) public onlyVerifier {
        require(employees[_employeeId].walletAddress != address(0), "Employee does not exist");
        
        employees[_employeeId].isVerified = _isVerified;
        emit EmployeeVerified(_employeeId, _isVerified);
    }
    
    function updateEmployeeReputation(address _employee, euint32 _reputation) public onlyVerifier {
        require(_employee != address(0), "Invalid employee address");
        require(employeeAddressToId[_employee] != 0, "Employee does not exist");
        
        employeeReputation[_employee] = _reputation;
        emit ReputationUpdated(_employee, 0); // FHE.decrypt(_reputation) - will be decrypted off-chain
    }
    
    function getEmployeeInfo(uint256 _employeeId) public view returns (
        string memory name,
        string memory position,
        uint8 baseSalary,
        uint8 bonus,
        uint8 totalEarnings,
        uint8 taxDeduction,
        uint8 netSalary,
        bool isActive,
        bool isVerified,
        address walletAddress,
        uint256 startDate,
        uint256 lastPaymentDate
    ) {
        Employee storage employee = employees[_employeeId];
        return (
            employee.name,
            employee.position,
            0, // FHE.decrypt(employee.baseSalary) - will be decrypted off-chain
            0, // FHE.decrypt(employee.bonus) - will be decrypted off-chain
            0, // FHE.decrypt(employee.totalEarnings) - will be decrypted off-chain
            0, // FHE.decrypt(employee.taxDeduction) - will be decrypted off-chain
            0, // FHE.decrypt(employee.netSalary) - will be decrypted off-chain
            employee.isActive,
            employee.isVerified,
            employee.walletAddress,
            employee.startDate,
            employee.lastPaymentDate
        );
    }
    
    function getPaymentInfo(uint256 _paymentId) public view returns (
        uint8 amount,
        uint8 taxAmount,
        uint8 netAmount,
        bool isProcessed,
        string memory paymentHash,
        address processedBy,
        uint256 timestamp
    ) {
        SalaryPayment storage payment = salaryPayments[_paymentId];
        return (
            0, // FHE.decrypt(payment.amount) - will be decrypted off-chain
            0, // FHE.decrypt(payment.taxAmount) - will be decrypted off-chain
            0, // FHE.decrypt(payment.netAmount) - will be decrypted off-chain
            payment.isProcessed,
            payment.paymentHash,
            payment.processedBy,
            payment.timestamp
        );
    }
    
    function getPayrollPeriodInfo(uint256 _periodId) public view returns (
        uint8 totalEmployees,
        uint8 totalGrossSalary,
        uint8 totalTaxDeduction,
        uint8 totalNetSalary,
        bool isProcessed,
        bool isVerified,
        uint256 startDate,
        uint256 endDate,
        uint256 processedAt
    ) {
        PayrollPeriod storage period = payrollPeriods[_periodId];
        return (
            0, // FHE.decrypt(period.totalEmployees) - will be decrypted off-chain
            0, // FHE.decrypt(period.totalGrossSalary) - will be decrypted off-chain
            0, // FHE.decrypt(period.totalTaxDeduction) - will be decrypted off-chain
            0, // FHE.decrypt(period.totalNetSalary) - will be decrypted off-chain
            period.isProcessed,
            period.isVerified,
            period.startDate,
            period.endDate,
            period.processedAt
        );
    }
    
    function getEmployeeReputation(address _employee) public view returns (uint8) {
        return 0; // FHE.decrypt(employeeReputation[_employee]) - will be decrypted off-chain
    }
    
    function deactivateEmployee(uint256 _employeeId) public onlyHRManager {
        require(employees[_employeeId].walletAddress != address(0), "Employee does not exist");
        
        employees[_employeeId].isActive = false;
    }
    
    function updateHRManager(address _newHRManager) public onlyOwner {
        require(_newHRManager != address(0), "Invalid HR manager address");
        
        hrManager = _newHRManager;
    }
    
    function updateVerifier(address _newVerifier) public onlyOwner {
        require(_newVerifier != address(0), "Invalid verifier address");
        
        verifier = _newVerifier;
    }
    
    function withdrawFunds() public onlyOwner {
        // Transfer contract balance to owner
        payable(owner).transfer(address(this).balance);
    }
    
    // Fallback function to receive ETH
    receive() external payable {}
}
