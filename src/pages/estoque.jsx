import React, { useEffect, useState } from 'react';
import { Package } from 'lucide-react';
import DashboardLayout from '@/components/layouts/dashboard-layout';

function StockItem({ item }) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 gap-2">
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <Package className="w-6 h-6 text-blue-600" />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-gray-900 font-medium text-base sm:text-lg">{item.nome}</span>
          <span className="text-xs text-gray-500">{item.type === 'comprado' ? 'Comprado' : item.type === 'doado' ? 'Doação' : item.type}</span>
        </div>
      </div>
      <div className="flex flex-col text-left sm:text-right w-full sm:w-auto">
        <span className="text-sm sm:text-base text-gray-600">Inicial: <b>{item.quantidade_inicial}</b></span>
        <span className="text-sm sm:text-base text-gray-600">Usada: <b>{item.quantidade_usada}</b></span>
        <span className="text-base sm:text-lg font-medium text-gray-900">Atual: {item.quantidade_atual}</span>
      </div>
    </div>
  );
}

export default function EstoquePage() {
  const [itens, setItens] = useState([]);
  const [busca, setBusca] = useState('');
  const [tela, setTela] = useState('lista'); // 'lista', 'entrada', 'saida'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Função para buscar estoque
  const fetchStorage = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/storage/my-storage');
      const data = await res.json();
      if (data.ok) {
        // Mapeia os campos do backend para os campos que este componente espera
        const mapped = (data.storage || []).map((it) => ({
          ...it,
          nome: it.name || it.nome || '',
          name: it.name || it.nome || '',
          quantidade_inicial: it.initial_quantity ?? it.quantidade_inicial ?? 0,
          quantidade_usada: it.used_quantity ?? it.quantidade_usada ?? 0,
          quantidade_atual: it.current_quantity ?? ((it.initial_quantity ?? 0) - (it.used_quantity ?? 0)),
        }));
        setItens(mapped);
      } else {
        setError(data.error || 'Erro ao carregar estoque');
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStorage();
  }, []);

  const itensFiltrados = itens.filter(item =>
    item && item.name && item.name.toLowerCase().includes(busca.toLowerCase())
  );

  // Componente de Formulário de Entrada
  function FormEntrada({ onCancel, onSuccess }) {
    const [formData, setFormData] = useState({
      name: '',
      initial_quantity: '',
      amount: '',
      type: 'Comprado (Verba)',
      supplier: '',
      date: new Date().toISOString().split('T')[0],
      invoice: '',
      responsible: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState(null);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setSubmitting(true);
      setFormError(null);

      try {
        const res = await fetch('/api/storage/entry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        const data = await res.json();

        if (res.ok && data.ok) {
          onSuccess('Entrada registrada com sucesso!');
        } else {
          setFormError(data.error || 'Erro ao registrar entrada');
        }
      } catch (err) {
        setFormError('Erro ao conectar com o servidor');
      } finally {
        setSubmitting(false);
      }
    };

    return (
      <div className="flex flex-col gap-8 w-full px-2 sm:px-0">
        <h2 className="text-xl sm:text-2xl font-semibold text-black mb-2">Registrar Entrada de Estoque</h2>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 w-full">
          <div className="flex gap-2 mb-6">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium">Entrada Manual</button>
            <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md font-medium">Via Nota Fiscal</button>
          </div>
          {formError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {formError}
            </div>
          )}
          <form className="flex flex-col gap-4 text-black" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label className="font-medium">Nome do item *</label>
              <input 
                className="border rounded-md px-3 py-2" 
                placeholder="Ex: Arroz integral" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                required 
              />
            </div>
            <div className="flex gap-4">
              <div className="flex flex-col gap-2 w-1/2">
                <label className="font-medium">Quantidade *</label>
                <input 
                  className="border rounded-md px-3 py-2" 
                  type="number" 
                  min="1" 
                  name="initial_quantity"
                  value={formData.initial_quantity}
                  onChange={handleChange}
                  required 
                />
              </div>
              <div className="flex flex-col gap-2 w-1/2">
                <label className="font-medium">Preço Unitário (R$) *</label>
                <input 
                  className="border rounded-md px-3 py-2" 
                  type="number" 
                  min="0.01" 
                  step="0.01"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="Ex: 5.50"
                  required 
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex flex-col gap-2 w-1/2">
                <label className="font-medium">Tipo de Entrada *</label>
                <select 
                  className="border rounded-md px-3 py-2"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                >
                  <option>Comprado (Verba)</option>
                  <option>Doação</option>
                </select>
              </div>
              <div className="flex flex-col gap-2 w-1/2">
                <label className="font-medium">Fornecedor</label>
                <input 
                  className="border rounded-md px-3 py-2" 
                  placeholder="Ex: Distribuidora ABC"
                  name="supplier"
                  value={formData.supplier}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex flex-col gap-2 w-1/2">
                <label className="font-medium">Data de Entrada *</label>
                <input 
                  className="border rounded-md px-3 py-2" 
                  type="date" 
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required 
                />
              </div>
              <div className="flex flex-col gap-2 w-1/2">
                <label className="font-medium">Nota Fiscal (opcional)</label>
                <input 
                  className="border rounded-md px-3 py-2" 
                  placeholder="Número da NF"
                  name="invoice"
                  value={formData.invoice}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-medium">Nome do Responsável *</label>
              <input 
                className="border rounded-md px-3 py-2" 
                placeholder="Seu nome" 
                name="responsible"
                value={formData.responsible}
                onChange={handleChange}
                required 
              />
            </div>
            <div className="flex gap-2 mt-6">
              <button 
                type="button" 
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md font-medium" 
                onClick={onCancel}
                disabled={submitting}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium disabled:opacity-50"
                disabled={submitting}
              >
                {submitting ? 'Registrando...' : 'Registrar Entrada'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Componente de Formulário de Saída
  function FormSaida({ onCancel, onSuccess, itensDisponiveis }) {
    const [formData, setFormData] = useState({
      itemName: '',
      used_quantity: '',
      purpose: '',
      date: new Date().toISOString().split('T')[0],
      responsible: '',
      notes: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState(null);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };

    const selectedItem = itensDisponiveis.find(item => item.name === formData.itemName);
    const maxQuantity = selectedItem ? selectedItem.quantidade_atual : 0;

    const handleSubmit = async (e) => {
      e.preventDefault();
      setSubmitting(true);
      setFormError(null);

      if (!formData.itemName || formData.itemName === 'Selecione o item') {
        setFormError('Selecione um item');
        setSubmitting(false);
        return;
      }

      if (parseInt(formData.used_quantity) > maxQuantity) {
        setFormError(`Quantidade máxima disponível: ${maxQuantity}`);
        setSubmitting(false);
        return;
      }

      try {
        const res = await fetch('/api/storage/exit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: [{ name: formData.itemName, used_quantity: formData.used_quantity }],
            purpose: formData.purpose,
            date: formData.date,
            responsible: formData.responsible,
            notes: formData.notes
          })
        });

        const data = await res.json();

        if (res.ok && data.ok) {
          onSuccess('Saída registrada com sucesso!');
        } else {
          setFormError(data.error || 'Erro ao registrar saída');
        }
      } catch (err) {
        setFormError('Erro ao conectar com o servidor');
      } finally {
        setSubmitting(false);
      }
    };

    return (
      <div className="flex flex-col gap-8 w-full px-2 sm:px-0">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">Registrar Saída de Estoque</h2>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 w-full">
          {formError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {formError}
            </div>
          )}
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex gap-4 mb-4">
              <div className="flex flex-col gap-2 w-1/2">
                <label className="font-medium text-black">Item *</label>
                <select 
                  className="border rounded-md px-3 py-2 text-black"
                  name="itemName"
                  value={formData.itemName}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione o item</option>
                  {itensDisponiveis.filter(item => item.quantidade_atual > 0).map((item, idx) => (
                    <option key={idx} value={item.name}>
                      {item.name} (disponível: {item.quantidade_atual})
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2 w-1/2">
                <label className="font-medium text-black">Quantidade * {maxQuantity > 0 && `(máx: ${maxQuantity})`}</label>
                <input 
                  className="border rounded-md px-3 py-2 text-black" 
                  type="number" 
                  min="1"
                  max={maxQuantity}
                  name="used_quantity"
                  value={formData.used_quantity}
                  onChange={handleChange}
                  required 
                />
              </div>
            </div>
            <div className="flex gap-4 mb-4">
              <div className="flex flex-col gap-2 w-1/2">
                <label className="font-medium text-black">Finalidade *</label>
                <select 
                  className="border rounded-md px-3 py-2 text-black"
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione</option>
                  <option value="Consumo">Consumo</option>
                  <option value="Descarte">Descarte</option>
                </select>
              </div>
              <div className="flex flex-col gap-2 w-1/2">
                <label className="font-medium text-black">Data *</label>
                <input 
                  className="border rounded-md px-3 py-2 text-black" 
                  type="date" 
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required 
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-medium text-black">Nome do Responsável *</label>
              <input 
                className="border rounded-md px-3 py-2 text-black" 
                placeholder="Seu nome" 
                name="responsible"
                value={formData.responsible}
                onChange={handleChange}
                required 
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-medium text-black">Observações (opcional)</label>
              <textarea 
                className="border rounded-md px-3 py-2 text-black" 
                placeholder="Informações adicionais sobre o consumo..."
                name="notes"
                value={formData.notes}
                onChange={handleChange}
              />
            </div>
            <div className="flex gap-2 mt-6">
              <button 
                type="button" 
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md font-medium" 
                onClick={onCancel}
                disabled={submitting}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="bg-orange-500 text-white px-4 py-2 rounded-md font-medium disabled:opacity-50"
                disabled={submitting}
              >
                {submitting ? 'Registrando...' : 'Registrar Saída'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Handler para sucesso nas operações
  const handleOperationSuccess = (message) => {
    setSuccess(message);
    setTela('lista');
    fetchStorage(); // Recarrega os itens
    setTimeout(() => setSuccess(null), 3000); // Limpa a mensagem após 3s
  };

  return (
    <DashboardLayout>
      {/* Mensagem de sucesso */}
      {success && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50">
          {success}
        </div>
      )}
      
      {tela === 'lista' && (
        <div className="flex flex-col gap-8 w-full px-2 sm:px-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full">
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Gestão de Estoque</h1>
            <div className="flex gap-2 flex-col sm:flex-row w-full sm:w-auto">
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md font-medium w-full sm:w-auto" onClick={() => setTela('saida')}>- Registrar Saída</button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium w-full sm:w-auto" onClick={() => setTela('entrada')}>+ Registrar Entrada</button>
            </div>
          </div>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-6 w-full">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full">
              <span className="text-base sm:text-lg font-normal text-gray-700">Controle de entrada e saída de alimentos</span>
              <input
                type="text"
                placeholder="Buscar item..."
                className="border border-gray-300 rounded-md text-black px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 w-full sm:w-64"
                value={busca}
                onChange={e => setBusca(e.target.value)}
              />
            </div>
            <div className="overflow-x-auto w-full">
              {loading ? (
                <div className="text-center py-8 text-gray-500">Carregando...</div>
              ) : (
                <table className="min-w-full bg-white text-xs sm:text-sm">
                  <thead>
                    <tr className="text-left text-gray-600 border-b">
                      <th className="py-2 px-2 sm:px-4">Item</th>
                      <th className="py-2 px-2 sm:px-4">Tipo</th>
                      <th className="py-2 px-2 sm:px-4">Quantidade Inicial</th>
                      <th className="py-2 px-2 sm:px-4">Quantidade Usada</th>
                      <th className="py-2 px-2 sm:px-4">Quantidade Atual</th>
                    </tr>
                  </thead>
                  <tbody>
                    {itensFiltrados.map((item, idx) => (
                      <tr key={idx} className="border-b last:border-0">
                        <td className="py-2 px-2 sm:px-4 flex items-center gap-2">
                          <span className="bg-blue-100 rounded-lg p-2"><Package className="w-5 h-5 text-blue-600" /></span>
                          <span className="text-xs sm:text-base text-black">{item.name}</span>
                        </td>
                        <td className="py-2 px-2 sm:px-4 text-black">
                          <span className={`px-2 py-1 rounded text-xs ${item.type === 'comprado' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                            {item.type === 'comprado' ? 'Comprado' : item.type === 'doado' ? 'Doação' : item.type}
                          </span>
                        </td>
                        <td className="py-2 px-2 sm:px-4 text-black">{item.quantidade_inicial}</td>
                        <td className="py-2 px-2 sm:px-4 text-black">{item.quantidade_usada}</td>
                        <td className="py-2 px-2 sm:px-4 font-semibold text-black">{item.quantidade_atual}</td>
                      </tr>
                    ))}
                    {itensFiltrados.length === 0 && !loading && (
                      <tr><td colSpan={5} className="text-center text-gray-400 py-8">Nenhum item encontrado.</td></tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
      {tela === 'entrada' && <FormEntrada onCancel={() => setTela('lista')} onSuccess={handleOperationSuccess} />}
      {tela === 'saida' && <FormSaida onCancel={() => setTela('lista')} onSuccess={handleOperationSuccess} itensDisponiveis={itens} />}
    </DashboardLayout>
  );
}