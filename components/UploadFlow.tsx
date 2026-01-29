// components/UploadFlow.tsx

'use client';

import { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { parseCSV } from '@/lib/ingestor';
import { Transaction } from '@/lib/types';

interface UploadFlowProps {
  onComplete: (transactions: Transaction[]) => void;
}

export default function UploadFlow({ onComplete }: UploadFlowProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<Transaction[]>([]);
  const [error, setError] = useState<string>('');
  const [step, setStep] = useState<'upload' | 'preview' | 'complete'>('upload');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith('.csv')) {
      setError('Please upload a CSV file');
      return;
    }

    setFile(selectedFile);
    setError('');

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const transactions = parseCSV(text);
        
        if (transactions.length === 0) {
          setError('No valid transactions found in CSV');
          return;
        }

        setPreview(transactions.slice(0, 20));
        setStep('preview');
      } catch (err) {
        setError('Failed to parse CSV. Make sure it has date, description, and amount columns.');
      }
    };
    reader.readAsText(selectedFile);
  };

  const handleConfirm = () => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const transactions = parseCSV(text);
      onComplete(transactions);
      setStep('complete');
    };
    if (file) {
      reader.readAsText(file);
    }
  };

  if (step === 'complete') {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-10 h-10 text-emerald-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Upload Complete!</h3>
        <p className="text-gray-600 text-center mb-4">Your transactions have been analyzed.</p>
        <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
      </div>
    );
  }

  if (step === 'preview') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">Preview Your Data</h3>
            <p className="text-gray-600">Found {preview.length} transactions</p>
          </div>
          <FileText className="w-10 h-10 text-gray-400" />
        </div>

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Merchant</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Category</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {preview.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {tx.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{tx.merchantClean}</div>
                      <div className="text-xs text-gray-500">{tx.merchantRaw}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {tx.category}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-sm text-right font-semibold ${tx.amount < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                      {tx.amount < 0 ? '-' : '+'}${Math.abs(tx.amount).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setStep('upload')}
            className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-sm"
          >
            Confirm & Analyze
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Upload Your Bank CSV</h2>
        <p className="text-lg text-gray-600">
          We'll automatically categorize transactions and find insights
        </p>
      </div>

      <div className="border-2 border-dashed border-gray-300 rounded-2xl p-16 text-center hover:border-gray-400 hover:bg-gray-50 transition-all bg-white">
        <label className="cursor-pointer block">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            className="hidden"
          />
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Upload className="w-8 h-8 text-gray-600" />
            </div>
            <div className="text-xl font-semibold text-gray-900 mb-2">
              {file ? file.name : 'Choose a CSV file'}
            </div>
            <div className="text-sm text-gray-500">
              or drag and drop here
            </div>
          </div>
        </label>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Supported formats:</h4>
        <ul className="text-sm text-gray-600 space-y-1.5">
          <li className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
            Chase, Bank of America, Wells Fargo
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
            Any CSV with date, description, and amount columns
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
            We'll auto-detect column names
          </li>
        </ul>
      </div>
    </div>
  );
}