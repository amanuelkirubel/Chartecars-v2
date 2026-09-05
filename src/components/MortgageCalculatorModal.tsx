import React, { useState } from 'react';
import { X, Calculator, DollarSign, Percent, Calendar, CheckCircle2 } from 'lucide-react';
import { Language, Currency } from '../types';
import { getTranslation } from '../data/translations';
import { formatPrice } from '../utils/formatters';
import { USD_TO_ETB_RATE } from '../data/mockListings';

interface MortgageCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  currency: Currency;
  initialPrice?: number;
}

export const MortgageCalculatorModal: React.FC<MortgageCalculatorModalProps> = ({
  isOpen,
  onClose,
  lang,
  currency,
  initialPrice = 35000000,
}) => {
  const t = getTranslation(lang);

  const [homePrice, setHomePrice] = useState<number>(initialPrice);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(30); // 30% standard
  const [interestRate, setInterestRate] = useState<number>(18.5); // Ethiopian bank benchmark ~18.5%
  const [loanTermYears, setLoanTermYears] = useState<number>(15);

  if (!isOpen) return null;

  const downPaymentAmount = (homePrice * downPaymentPercent) / 100;
  const principalLoan = Math.max(0, homePrice - downPaymentAmount);

  // Monthly mortgage calculation formula: M = P * [r(1+r)^n] / [(1+r)^n - 1]
  const monthlyInterestRate = interestRate / 100 / 12;
  const numberOfPayments = loanTermYears * 12;

  let monthlyPayment = 0;
  if (monthlyInterestRate > 0 && numberOfPayments > 0 && principalLoan > 0) {
    monthlyPayment =
      (principalLoan *
        (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments))) /
      (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
  }

  const totalPayment = monthlyPayment * numberOfPayments;
  const totalInterest = Math.max(0, totalPayment - principalLoan);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-[#0B172E] border border-blue-900/50 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-blue-900/40 bg-[#071224]">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 
                className="text-lg font-serif font-bold text-white tracking-tight"
                style={{ fontFamily: "'Fraunces', Georgia, serif" }}
              >
                {t.calc_title}
              </h2>
              <p className="text-[11px] text-slate-400">
                {t.calc_desc}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-6">
          
          {/* Monthly Payment Hero Box */}
          <div className="bg-gradient-to-br from-blue-950/90 to-indigo-950/90 p-5 rounded-2xl border border-blue-500/40 text-center">
            <div className="text-xs font-semibold text-blue-300 uppercase tracking-wider mb-1">
              {t.calc_est_monthly}
            </div>
            <div className="text-3xl sm:text-4xl font-mono font-bold text-white tracking-tight">
              {formatPrice(Math.round(monthlyPayment), currency)}
              <span className="text-sm font-normal text-slate-400 ml-1">/mo</span>
            </div>
            <div className="mt-2 text-xs text-blue-200/70 font-mono">
              ~${Math.round(monthlyPayment / USD_TO_ETB_RATE).toLocaleString('en-US')} USD per month (at 1 USD ≈ {USD_TO_ETB_RATE} ETB)
            </div>
          </div>

          {/* Sliders and Inputs */}
          <div className="space-y-4">
            
            {/* Property Price Input */}
            <div>
              <div className="flex justify-between items-center text-xs font-semibold text-slate-300 mb-1">
                <span>{t.calc_home_price}</span>
                <span className="font-mono text-blue-400">{formatPrice(homePrice, currency)}</span>
              </div>
              <input
                type="number"
                min="1000000"
                step="500000"
                value={homePrice}
                onChange={(e) => setHomePrice(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Down payment percentage */}
            <div>
              <div className="flex justify-between items-center text-xs font-semibold text-slate-300 mb-1">
                <span>{t.calc_down_payment}</span>
                <span className="font-mono text-emerald-400">
                  {downPaymentPercent}% ({formatPrice(Math.round(downPaymentAmount), currency)})
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="70"
                step="5"
                value={downPaymentPercent}
                onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                <span>10%</span>
                <span>20%</span>
                <span>30% (Standard)</span>
                <span>50%</span>
                <span>70%</span>
              </div>
            </div>

            {/* Interest Rate */}
            <div>
              <div className="flex justify-between items-center text-xs font-semibold text-slate-300 mb-1">
                <span>{t.calc_interest}</span>
                <span className="font-mono text-amber-400">{interestRate}% APR</span>
              </div>
              <input
                type="range"
                min="12"
                max="26"
                step="0.5"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                <span>12%</span>
                <span>16% (State bank)</span>
                <span>18.5% (Commercial)</span>
                <span>24%</span>
              </div>
            </div>

            {/* Loan Term Years */}
            <div>
              <div className="flex justify-between items-center text-xs font-semibold text-slate-300 mb-1">
                <span>{t.calc_loan_term}</span>
                <span className="font-mono text-indigo-400">{loanTermYears} Years ({numberOfPayments} payments)</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[5, 10, 15, 20].map((years) => (
                  <button
                    key={years}
                    type="button"
                    onClick={() => setLoanTermYears(years)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                      loanTermYears === years
                        ? 'bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-600/30'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {years} Years
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Breakdown summary */}
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>{t.calc_loan_amount}:</span>
              <span className="font-mono text-white font-semibold">{formatPrice(Math.round(principalLoan), currency)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Total Down Payment:</span>
              <span className="font-mono text-white font-semibold">{formatPrice(Math.round(downPaymentAmount), currency)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Total Interest Payable:</span>
              <span className="font-mono text-amber-400 font-semibold">{formatPrice(Math.round(totalInterest), currency)}</span>
            </div>
            <div className="flex justify-between text-slate-400 pt-2 border-t border-slate-800 font-bold text-white">
              <span>Total Cost Over {loanTermYears} Years:</span>
              <span className="font-mono text-blue-400">{formatPrice(Math.round(totalPayment + downPaymentAmount), currency)}</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
