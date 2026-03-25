import React, { useState } from 'react';
import { ArrowDownToLine, ArrowUpFromLine, ArrowRightLeft, DollarSign, Clock, CheckCircle, Wallet } from 'lucide-react';
import { Card, CardHeader, CardBody } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Input } from './ui/Input';
import { useAuth } from '../context/AuthContext';

interface Transaction {
  id: string;
  type: 'Deposit' | 'Withdrawal' | 'Transfer';
  amount: number;
  date: string;
  status: 'Completed' | 'Pending' | 'Failed';
  party?: string;
}

export const PaymentSection: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw' | 'transfer'>('deposit');
  const [amount, setAmount] = useState('');
  
  // Mock data
  const balance = user?.role === 'investor' ? 2500000 : 45000;
  
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 'tx-1', type: 'Deposit', amount: 50000, date: '2024-03-24', status: 'Completed' },
    { id: 'tx-2', type: 'Transfer', amount: 25000, date: '2024-03-22', status: 'Completed', party: 'TechWave AI' },
    { id: 'tx-3', type: 'Withdrawal', amount: 5000, date: '2024-03-20', status: 'Pending' },
    { id: 'tx-4', type: 'Transfer', amount: 150000, date: '2024-03-15', status: 'Completed', party: 'GreenLife Solutions' },
  ]);

  const handleAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount))) return;
    
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      type: activeTab === 'deposit' ? 'Deposit' : activeTab === 'withdraw' ? 'Withdrawal' : 'Transfer',
      amount: Number(amount),
      date: new Date().toISOString().split('T')[0],
      status: 'Pending',
      party: activeTab === 'transfer' ? 'Recipient Account' : undefined
    };
    
    setTransactions([newTx, ...transactions]);
    setAmount('');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed': return <Badge variant="success" size="sm"><CheckCircle size={12} className="mr-1" /> Completed</Badge>;
      case 'Pending': return <Badge variant="warning" size="sm"><Clock size={12} className="mr-1" /> Pending</Badge>;
      case 'Failed': return <Badge variant="error" size="sm">Failed</Badge>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Wallet & Payments</h1>
        <p className="text-gray-600">Manage your funds, investments, and transaction history.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Wallet Balance Card */}
        <Card className="bg-gradient-to-br from-primary-600 to-primary-900 text-white shadow-lg border-none lg:col-span-1">
          <CardBody className="flex flex-col h-full justify-between p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-primary-100 font-medium mb-1">Available Balance</p>
                <h2 className="text-4xl font-bold tracking-tight">${balance.toLocaleString()}</h2>
              </div>
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                <Wallet size={28} className="text-white" />
              </div>
            </div>
            
            <div className="mt-8 pt-4 border-t border-white/20">
              <p className="text-sm text-primary-100 flex items-center justify-between">
                <span>Account Status:</span>
                <span className="font-semibold text-white flex items-center"><CheckCircle size={14} className="mr-1" /> Verified</span>
              </p>
              <p className="text-xs text-primary-200 mt-2">
                Last updated: Just now
              </p>
            </div>
          </CardBody>
        </Card>

        {/* Action Panel */}
        <Card className="lg:col-span-2">
          <CardHeader className="border-b border-gray-100 px-0 pt-0">
            <div className="flex gap-4 px-6 pt-5">
              <button 
                onClick={() => setActiveTab('deposit')}
                className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'deposit' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              >
                Deposit Funds
              </button>
              <button 
                onClick={() => setActiveTab('withdraw')}
                className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'withdraw' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              >
                Withdraw
              </button>
              <button 
                onClick={() => setActiveTab('transfer')}
                className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'transfer' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              >
                Transfer / Fund Deal
              </button>
            </div>
          </CardHeader>
          <CardBody className="p-6">
            <form onSubmit={handleAction} className="space-y-4 max-w-md">
              <div className="space-y-4">
                {activeTab === 'deposit' && (
                  <div className="p-4 bg-primary-50 rounded-lg border border-primary-100 flex items-start mb-4">
                    <ArrowDownToLine className="text-primary-600 mr-3 shrink-0" />
                    <div>
                      <h4 className="text-sm font-medium text-primary-900">Add funds via Bank Transfer</h4>
                      <p className="text-xs text-primary-700 mt-1">Funds will be available in your Wallet within 1-2 business days.</p>
                    </div>
                  </div>
                )}
                {activeTab === 'withdraw' && (
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 flex items-start mb-4">
                    <ArrowUpFromLine className="text-gray-600 mr-3 shrink-0" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Withdraw to Linked Bank</h4>
                      <p className="text-xs text-gray-600 mt-1">Withdrawals typically take 2-3 business days to process.</p>
                    </div>
                  </div>
                )}
                {activeTab === 'transfer' && (
                  <>
                    <div className="p-4 bg-amber-50 rounded-lg border border-amber-100 flex items-start mb-4">
                      <ArrowRightLeft className="text-amber-600 mr-3 shrink-0" />
                      <div>
                        <h4 className="text-sm font-medium text-amber-900">Fund an Entrepreneur</h4>
                        <p className="text-xs text-amber-700 mt-1">Transfer funds securely as part of an agreed investment deal.</p>
                      </div>
                    </div>
                    <Input label="Recipient Email or Username" placeholder="e.g. startup@techwave.io" required />
                  </>
                )}
                
                <div className="relative">
                  <Input 
                    label="Amount ($)" 
                    type="number" 
                    placeholder="0.00" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    min="1"
                    startAdornment={<DollarSign size={16} className="text-gray-400" />}
                  />
                </div>
              </div>
              
              <Button type="submit" className="w-full mt-2">
                {activeTab === 'deposit' ? 'Confirm Deposit' : activeTab === 'withdraw' ? 'Request Withdrawal' : 'Send Funds'}
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-medium text-gray-900">Transaction History</h2>
        </CardHeader>
        <CardBody className="p-0 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tx.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="flex items-center text-sm font-medium text-gray-900">
                      {tx.type === 'Deposit' && <ArrowDownToLine size={16} className="mr-2 text-green-500" />}
                      {tx.type === 'Withdrawal' && <ArrowUpFromLine size={16} className="mr-2 text-red-500" />}
                      {tx.type === 'Transfer' && <ArrowRightLeft size={16} className="mr-2 text-blue-500" />}
                      {tx.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {tx.party ? `To/From: ${tx.party}` : 'Bank Transfer'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(tx.status)}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold text-right ${tx.type === 'Withdrawal' || tx.type === 'Transfer' ? 'text-gray-900' : 'text-green-600'}`}>
                    {tx.type === 'Deposit' ? '+' : '-'}${tx.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
};
