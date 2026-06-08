export default function SummaryCards({ transactions }) {
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  const fmt = (n) =>
    n.toLocaleString("en-US", { style: "currency", currency: "USD" });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <p className="text-sm text-gray-500 mb-1">Balance</p>
        <p className={`text-2xl font-bold ${balance >= 0 ? "text-gray-800" : "text-red-500"}`}>
          {fmt(balance)}
        </p>
      </div>
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <p className="text-sm text-gray-500 mb-1">Total Income</p>
        <p className="text-2xl font-bold text-green-500">{fmt(totalIncome)}</p>
      </div>
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <p className="text-sm text-gray-500 mb-1">Total Expenses</p>
        <p className="text-2xl font-bold text-red-500">{fmt(totalExpenses)}</p>
      </div>
    </div>
  );
} 
