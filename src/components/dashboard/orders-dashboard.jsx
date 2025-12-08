import { useState, useEffect } from "react";
import { Plus, Package } from "lucide-react";
import { cn } from "@/lib/utils";

export default function OrdersDashboard() {
  const [unit, setUnit] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      // Carrega a unidade do usuário
      const unitRes = await fetch("/api/units/my-units");

      if (!unitRes.ok) {
        const errorText = await unitRes.text();
        throw new Error(`Erro ao buscar unidades: ${unitRes.status} - ${errorText}`);
      }

      const unitData = await unitRes.json();
      if (unitData.units && unitData.units.length > 0) {
        setUnit(unitData.units[0]); // Pega a primeira unidade
      } else {
        setUnit(null);
      }

  
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getCollor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600';
      case 'approved':
        return 'text-green-600';
      case 'rejected':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  useEffect(() => {

    loadOrders();

  }, [unit])


  const loadOrders = async () => {
    if (!unit) {
      setOrders([]);
      return;
    }

     if (unit.id) {
        const ordersRes = await fetch(`/api/orders/${unit.id}`);
        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          console.log("Pedidos carregados:", ordersData);
          setOrders(ordersData.orders || []);
        }
      }

    }

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="text-gray-600 mt-2">Carregando...</p>
      </div>
    );
  }

  if (!unit) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 text-center">
        <p className="text-yellow-800 font-medium">
          Você não possui nenhuma unidade cadastrada, verifique com o financeiro
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
        <p className="text-red-800 font-medium">
          Erro ao carregar pedidos: {error}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com título e botão */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">
            Pedidos de Alimentos
          </h1>
          <p className="text-sm text-gray-500">
            Gerencie os pedidos da unidade
          </p>
        </div>
      </div>

      {/* Lista de Pedidos */}
      {orders.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center">
          <p className="text-gray-600">Nenhum pedido encontrado</p>
        </div>
      ) : (
        orders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-xl border border-gray-200 shadow-sm p-6"
          >
            {/* Cabeçalho do Pedido */}
            <div className="flex items-start justify-between mb-6 pb-6 border-b border-gray-200">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-1">
                  Pedido #{order.id}
                </h2>
                <p className={`text-sm ${getCollor(order.status)}`}>{order.status}</p>
                <p className="text-sm text-gray-500">
                  {order.created_at &&
                    new Date(order.created_at).toLocaleDateString("pt-BR")}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-semibold text-gray-900">
                  R$ {(order.amount || 0).toFixed(2)}
                </p>
              </div>
            </div>

            {/* Seção de Itens */}
            <div>
              <h3 className="text-base font-medium text-gray-900 mb-4">
                Itens do Pedido:
              </h3>
              {order.items && order.items.length > 0 ? (
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 rounded-lg p-4 border border-gray-100"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-gray-900 font-medium mb-1">
                            {item.description || item.name || "Item sem nome"}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span>
                              {item.quantity} {item.measure_unit || "un"}
                            </span>
                            <span className="text-gray-400">•</span>
                            <span>
                              R$ {(item.amount || 0).toFixed(2)} / {item.measure_unit || "un"}
                            </span>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-lg font-semibold text-gray-900">
                            R$ {(item.amount || 0).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  Nenhum item neste pedido
                </p>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
