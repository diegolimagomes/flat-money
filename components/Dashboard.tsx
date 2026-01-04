import React, { useMemo, useState } from 'react';
import { MonthData } from '../types';
import { calculateSummary, formatCurrency } from '../utils/calculations';

interface DashboardProps {
  data: MonthData[];
}

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const summary = useMemo(() => {
    if (data.length === 0) return null;
    const lastMonth = data[data.length - 1];
    return calculateSummary(lastMonth);
  }, [data]);

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 card-base border-2 border-dashed border-emerald-500 rounded-3xl shadow-2xl">
        <h3 className="text-xl font-bold text-slate-800">Inicie seu histórico</h3>
        <p className="text-slate-500 mt-2 text-sm">Lançar o primeiro faturamento e despesas do seu flat para ver a mágica</p>
      </div>
    );
  }

  const isNegative = summary && summary.netProfit < 0;

  return (
    <div className="space-y-6">
      {/* Header Premium */}
      <div className="bg-gradient-to-r from-emerald-500 to-emerald-700 rounded-3xl shadow-2xl p-8 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-black">ATUALIZADO</h2>
            <p className="text-emerald-100 mt-1 text-sm">Dashboard v2.0 - Versão Premium</p>
          </div>
        </div>
      </div>

      {/* Cards de Métricas Premium */}
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
