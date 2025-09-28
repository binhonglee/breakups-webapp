interface User {
  name: string;
  amount: number;
}

interface NetBalance {
  name: string;
  balance: number;
}

interface Payment {
  from: string;
  to: string;
  amount: number;
}

export const calculateOptimalPaymentChain = (users: User[]): Payment[] => {
  const totalAmount = users.reduce((sum, user) => sum + user.amount, 0);
  const avgAmount = totalAmount / users.length;
  const netBalances: NetBalance[] = users.map(user => ({
    name: user.name,
    balance: user.amount - avgAmount
  })).filter(user => Math.abs(user.balance) >= 0.005);

  const debtors = netBalances.filter(user => user.balance < 0)
    .map(user => ({ ...user, balance: -user.balance }))
    .sort((a, b) => b.balance - a.balance);

  const creditors = netBalances.filter(user => user.balance > 0)
    .sort((a, b) => b.balance - a.balance);

  const payments: Payment[] = [];
  let debtorIndex = 0;
  let creditorIndex = 0;

  while (debtorIndex < debtors.length && creditorIndex < creditors.length) {
    const debtor = debtors[debtorIndex];
    const creditor = creditors[creditorIndex];

    const paymentAmount = Math.min(debtor.balance, creditor.balance);
    const roundedAmount = Math.round(paymentAmount * 100) / 100;

    if (roundedAmount >= 0.01) {
      payments.push({
        from: debtor.name,
        to: creditor.name,
        amount: roundedAmount
      });
    }

    debtor.balance -= paymentAmount;
    creditor.balance -= paymentAmount;

    if (debtor.balance < 0.005) debtorIndex++;
    if (creditor.balance < 0.005) creditorIndex++;
  }

  return payments;
};