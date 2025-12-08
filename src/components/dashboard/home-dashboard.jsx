import { TrendingUp, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

// Componente de Card de Métrica
function MetricCard({ title, value, subtext, trend }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <span className="text-gray-600 text-base font-normal">{title}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-semibold text-gray-900">{value}</span>
        {trend && (
          <span className="text-sm font-medium text-red-500 flex items-center gap-0.5">
            <TrendingUp className="w-4 h-4" />
            {trend}
          </span>
        )}
        {subtext && !trend && (
          <span className="text-sm text-gray-500">{subtext}</span>
        )}
      </div>
      {trend && subtext && (
        <span className="text-sm text-gray-500 mt-1 block">{subtext}</span>
      )}
    </div>
  );
}

// Componente de Item de Estoque
function StockItem({ name, quantity, unit, type }) {
  const isDoacao = type === "Doação";
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <Package className="w-6 h-6 text-blue-600" />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-gray-900 font-medium">{name}</span>
          <span
            className={cn(
              "text-xs px-2 py-0.5 rounded-md w-fit font-medium",
              isDoacao
                ? "bg-green-100 text-green-700"
                : "bg-blue-100 text-blue-700"
            )}
          >
            {type}
          </span>
        </div>
      </div>
      <div className="text-right">
        <span className="text-lg font-medium text-gray-900">{quantity}</span>
        <span className="text-gray-600 ml-1">{unit}</span>
      </div>
    </div>
  );
}

export default function HomeDashboard() {
  const [stockItems, setStockItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unitName, setUnitName] = useState("");
  const [unitMissing, setUnitMissing] = useState(false);
  const [metrics, setMetrics] = useState({
    mealsPerDay: "-",
    monthlyExpense: "-",
    costPerCapita: "-",
    currentAttendance: "-",
  });

  const [monthSpent, setMonthSpent] = useState("");

  const month = new Date().toLocaleString("pt-BR", {
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    // Busca o estoque real da API
    const loadStorageData = fetch("/api/storage/my-storage")
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao buscar estoque");
        return res.json();
      })
      .then((data) => {
        if (data.ok) {
          if (data.unit) {
            setUnitName(data.unit.name);
            setUnitMissing(false);
          } else {
            setUnitName("");
            setUnitMissing(true);
          }

          if (data.storage && data.storage.length > 0) {
            const items = data.storage.map((item) => ({
              id: item.id,
              name: item.name,
              quantity: item.current_quantity || item.amount || 0,
              unit: "kg",
              type: item.type === "comprado" ? "Comprado" : "Doação",
            }));
            setStockItems(items);
          } else {
            setStockItems([]);
          }
        }
        return data;
      });

    const month = new Date().toISOString().slice(0, 7); // Formato YYYY-MM
    // Busca os relatórios (métricas) do backend
    const loadMetrics = fetch(
      `/api/reports/my-report/${month ? `?month=${month}` : ""}`
    )
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao buscar relatório");
        return res.json();
      })
      .then((data) => {
        if (data.ok && data.report) {
          const report = data.report;

          // Extrai frequência atual (média das frequências do mês)
          const frequencies = report.frequencies || [];
          const avgAttendance =
            frequencies.length > 0
              ? Math.round(
                  frequencies.reduce((sum, f) => sum + (f.amount || 0), 0) /
                    frequencies.length
                )
              : 0;

          const capacity = report.metrics?.capacity || 100;
          const attendanceStr = `${avgAttendance} de ${capacity}`;

          // Métricas do relatório
          setMetrics({
            mealsPerDay: `${avgAttendance}`,
            monthlyExpense: `R$ ${(report.metrics?.total_spending || 0)
              .toFixed(2)
              .replace(".", ",")
              .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`,
            costPerCapita: `R$ ${(report.metrics?.cost_per_capita || 0)
              .toFixed(2)
              .replace(".", ",")
              .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`,
            currentAttendance: attendanceStr,
          });
          
          setMonthSpent(
            report.monthly_comparison
              .filter((m) => m.month === month)[0].spent
          );
        }
      });

    Promise.all([loadStorageData, loadMetrics])
      .catch((err) => {
        console.error("Erro ao buscar dados:", err);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-8">
      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Refeições por Dia"
          value={metrics.mealsPerDay}
          subtext={`média diária no mês de: ${month}`}
        />
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <span className="text-gray-600 text-base font-normal">
              Gasto Mensal para o mês: {month}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-semibold text-gray-900">
              {monthSpent}
            </span>
          </div>
        </div>
        <MetricCard
          title="Gasto Per Capita"
          value={metrics.costPerCapita}
          subtext={`por pessoa no mês: ${month}`}
        />
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <span className="text-gray-600 text-base font-normal">
              Frequência Atual para o mês: {month}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-semibold text-gray-900">
              {metrics.currentAttendance}
            </span>
          </div>
        </div>
      </div>

      {/* Seção de Estoque */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Itens em Estoque
            </h2>
            {unitName && (
              <span className="text-sm text-gray-500">{unitName}</span>
            )}
          </div>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-gray-600 mt-2">Carregando estoque...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600 mb-2">Erro ao carregar estoque</p>
              <p className="text-sm text-gray-500">{error}</p>
            </div>
          ) : unitMissing ? (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-600">
                Você não possui nenhuma unidade cadastrada, verifique com o
                financeiro
              </p>
            </div>
          ) : stockItems.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-600">Nenhum item em estoque</p>
              <p className="text-sm text-gray-500 mt-1">
                Comece adicionando itens ao estoque
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stockItems.map((item) => (
                <StockItem
                  key={item.id}
                  name={item.name}
                  quantity={item.quantity}
                  unit={item.unit}
                  type={item.type}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
