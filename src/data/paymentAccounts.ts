export interface PaymentAccount {
  id: string;
  name: string;
  nameAm: string;
  accountNumber: string;
  accountName: string;
  category: 'mobile_money' | 'bank';
  shortCode?: string;
  badgeColor: string;
  textColor: string;
  borderColor: string;
  note?: string;
}

export const CHARTE_PAYMENT_ACCOUNTS: PaymentAccount[] = [
  {
    id: 'telebirr',
    name: 'Telebirr',
    nameAm: 'ቴሌብር',
    accountNumber: '0970181259',
    accountName: 'Charte Cars / Charte Platform',
    category: 'mobile_money',
    badgeColor: 'bg-[#0072bc]',
    textColor: 'text-[#0072bc]',
    borderColor: 'border-[#0072bc]',
    note: 'Send money to Telebirr phone number',
  },
  {
    id: 'mpesa',
    name: 'Safaricom M-Pesa',
    nameAm: 'ኤም-ፔሳ (M-Pesa)',
    accountNumber: '0715737393',
    accountName: 'Charte Cars / Charte Platform',
    category: 'mobile_money',
    badgeColor: 'bg-emerald-600',
    textColor: 'text-emerald-500',
    borderColor: 'border-emerald-600',
    note: 'Send money to M-Pesa phone number',
  },
  {
    id: 'cbe',
    name: 'Commercial Bank of Ethiopia (CBE)',
    nameAm: 'የኢትዮጵያ ንግድ ባንክ (CBE)',
    accountNumber: '1000099751715',
    accountName: 'Charte Cars',
    category: 'bank',
    badgeColor: 'bg-[#6b1d5c]',
    textColor: 'text-purple-400',
    borderColor: 'border-[#6b1d5c]',
    note: 'CBE Birr or CBE Mobile Banking Transfer',
  },
  {
    id: 'abyssinia',
    name: 'Bank of Abyssinia (BoA)',
    nameAm: 'አቢሲኒያ ባንክ (BoA)',
    accountNumber: '152910851',
    accountName: 'Charte Cars',
    category: 'bank',
    badgeColor: 'bg-amber-600',
    textColor: 'text-amber-400',
    borderColor: 'border-amber-600',
    note: 'Bank of Abyssinia Apollo or Branch Deposit',
  },
  {
    id: 'buna',
    name: 'Buna International Bank',
    nameAm: 'ቡና ኢንተርናሽናል ባንክ',
    accountNumber: '1199501004634',
    accountName: 'Charte Cars',
    category: 'bank',
    badgeColor: 'bg-amber-800',
    textColor: 'text-amber-600',
    borderColor: 'border-amber-800',
    note: 'Buna Bank Mobile Banking or Transfer',
  },
  {
    id: 'dashen',
    name: 'Dashen Bank (Amole)',
    nameAm: 'ዳሸን ባንክ (አሞሌ)',
    accountNumber: '5230712330011',
    accountName: 'Charte Cars',
    category: 'bank',
    badgeColor: 'bg-blue-800',
    textColor: 'text-blue-400',
    borderColor: 'border-blue-800',
    note: 'Dashen Super App or Branch Deposit',
  },
  {
    id: 'awash',
    name: 'Awash Bank',
    nameAm: 'አዋሽ ባንክ',
    accountNumber: '01320258408900',
    accountName: 'Charte Cars',
    category: 'bank',
    badgeColor: 'bg-blue-600',
    textColor: 'text-blue-400',
    borderColor: 'border-blue-600',
    note: 'Awash Mobile Banking or Direct Transfer',
  },
  {
    id: 'lion',
    name: 'Lion International Bank (Anbesa)',
    nameAm: 'አንበሳ ኢንተርናሽናል ባንክ',
    accountNumber: '00311034687-89',
    accountName: 'Charte Cars',
    category: 'bank',
    badgeColor: 'bg-yellow-700',
    textColor: 'text-yellow-400',
    borderColor: 'border-yellow-700',
    note: 'Lion Bank Transfer or Branch Deposit',
  },
];
