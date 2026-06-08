export default function TransactionList({ transactions, onEdit, onDelete }) {
  const fmt = (n) =>
    n.toLocaleString("en-US", { style: "currency", currency: "USD" });

  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
        <p className="text-gray-400 text-sm">No transactions yet. Add one above!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="divide-y divide-gray-50">
        {transactions.map((t) => (
          <div key={t.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition">
            <div className="flex items-center gap-4">
              <div className={`w-2 h-10 rounded-full ${t.type === "income" ? "bg-green-400" : "bg-red-400"}`} />
              <div>
                <p className="text-sm font-medium text-gray-800">
                  {t.description || t.category}
                </p>
                <p className="text-xs text-gray-400">
                  {t.category} · {new Date(t.date).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className={`text-sm font-semibold ${t.type === "income" ? "text-green-500" : "text-red-500"}`}>
                {t.type === "income" ? "+" : "-"}{fmt(t.amount)}
              </span>
              <button
                onClick={() => onEdit(t)}
                className="text-xs text-gray-400 hover:text-blue-500 transition"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(t.id)}
                className="text-xs text-gray-400 hover:text-red-500 transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 
