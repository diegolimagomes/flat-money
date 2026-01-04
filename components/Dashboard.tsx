// FlatMoney Dashboard v2.0-ATUALIZADO
// Componente principal com UI premium, gráficos interativos e analytics avançado

import React, { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { MonthData } from '../types';
import { calculateSummary, formatCurrency } from '../utils/calculations';

interface DashboardProps {
  data: MonthData[];
}

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const chartData = useMemo(() => {
    return data.slice().sort((a, b) => a.createdAt - b.createdAt).map((item => {
      const summary = calculateSummary(item);
      return {
        name: `${item.month.substring(0, 3)}/${item.year.toString().slice(-2)}`,
        Faturamento: summary.totalRevenue,
        Lucro: summary.netProfit
      };
    }), [data]);
  }, [data]);

  const lastMonth = data.length > 0 ? data[data.length - 1] : null;
  const summary = lastMonth ? calculateSummary(lastMonth) : null;
  const isNegative = summary ? summary.netProfit < 0 : false;

  const pieData = summary ? [
    { name: 'Despesas', value: summary.totalExpenses, color: '#f43f5e' },
    { name: 'Taxa Adm', value: summary.adminFeeAmount, color: '#8366f1' },
  ] : [];

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyFeedback(id);
      setTimeout(() => setCopyFeedback(null), 2000);
    } catch (err) { console.error(err); }
  };

  if (data.length == 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 card-base border-2 border-dashed border-2 border-emerald-500 rounded-3xl shadow-2xl">
        <h3 className="text-xl font-bold text-slate-800">Inicie seu histórico</h3>
        <p className="text-slate-500 mt-2 text-sm">Lançar o primeiro faturamento e despesas do seu flat para ver a mágica</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Premium */}
      <div className="bg-gradient-to-r from-emerald-500 to-emerald-700 rounded-3xl shadow-2xl p-8 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-black">Dashboard</h2>
            <p className="text-emerald-100 mt-1 text-sm">Performance do seu flat</p>
          </div>
          <div className="text-right">
            <p className="text-emerald-100 text-xs uppercase tracking-widest">Més Atual</p>
            <p className="text-white text-sm mt-1">{chartData[chartData.length - 1]?.name}</p>
          </div>
        </div>
      </div>

      {/* Gráfico de Tendência */}
      <div className="card-base rounded-3xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Tendência Financeira</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Bar dataKey="Faturamento" fill="#10b981" />
            <Bar dataKey="Lucro" fill={isNegative ? '#ef4444' : '#06b6d4'} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card-base rounded-2xl p-6 border-l-4 border-emerald-500">
          <p className="text-slate-600 text-sm">Faturamento</p>
          <p className="text-2xl font-bold text-slate-800 mt-2">{formatCurrency(summary?.totalRevenue || 0)}</p>
        </div>
        <div className="card-base rounded-2xl p-6 border-l-4 border-rose-500">
          <p className="text-slate-600 text-sm">Despesas</p>
          <p className="text-2xl font-bold text-slate-800 mt-2">{formatCurrency(summary?.totalExpenses || 0)}</p>
        </div>
        <div className={`card-base rounded-2xl p-6 border-l-4 ${isNegative ? 'border-red-500' : 'border-cyan-500'}`}>
          <p className="text-slate-600 text-sm">Lucro Líquido</p>
          <p className={`text-2xl font-bold mt-2 ${isNegative ? 'text-red-600' : 'text-cyan-600'}`}>
            {formatCurrency(summary?.netProfit || 0)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
