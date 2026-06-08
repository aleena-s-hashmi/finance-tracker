import { useState, useEffect } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import SummaryCards from "../components/SummaryCards";
import TransactionList from "../components/TransactionList";
import TransactionForm from "../components/TransactionForm";
import Charts from "../components/Charts";

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  // Load transactions on mount
  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await api.get("/transactions");
      setTransactions(res.data);
    } catch (err) {
      console.error("Failed to fetch transactions", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (form) => {
    try {
      await api.post("/transactions", form);
      setShowForm(false);
      fetchTransactions();
    } catch (err) {
      console.error("Failed to add transaction", err);
    }
  };

  const handleEdit = async (form) => {
    try {
      await api.put(`/transactions/${editingTransaction.id}`, form);
      setEditingTransaction(null);
      fetchTransactions();
    } catch (err) {
      console.error("Failed to update transaction", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this transaction?")) return;
    try {
      await api.delete(`/transactions/${id}`);
      fetchTransactions();
    } catch (err) {
      console.error("Failed to delete transaction", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">Dashboard</h2>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            + Add Transaction
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400 text-sm">Loading...</div>
        ) : (
          <>
            <SummaryCards transactions={transactions} />
            <Charts transactions={transactions} />
            <TransactionList
              transactions={transactions}
              onEdit={(t) => setEditingTransaction(t)}
              onDelete={handleDelete}
            />
          </>
        )}
      </main>

      {/* Add transaction modal */}
      {showForm && (
        <TransactionForm
          onSubmit={handleAdd}
          onClose={() => setShowForm(false)}
        />
      )}

      {/* Edit transaction modal */}
      {editingTransaction && (
        <TransactionForm
          initial={editingTransaction}
          onSubmit={handleEdit}
          onClose={() => setEditingTransaction(null)}
        />
      )}
    </div>
  );
}