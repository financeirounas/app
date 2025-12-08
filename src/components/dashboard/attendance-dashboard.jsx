import { useState, useEffect } from 'react';
import { Users, CheckCircle2, Calendar, CalendarIcon, Pencil, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Componente de Card de Métrica
function MetricCard({ title, value, icon: Icon, iconColorClass }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <span className="text-gray-600 text-base font-normal">{title}</span>
        <Icon className={cn("w-6 h-6", iconColorClass)} />
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-semibold text-gray-900">{value}</span>
      </div>
    </div>
  );
}

// Componente de Card de Histórico
function HistoryCard({ id, date, day, present, total, percentage, onEdit }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-gray-900 font-medium">{day}, {date}</p>
            <button
              onClick={() => onEdit(id)}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              title="Editar data"
            >
              <Pencil className="w-4 h-4 text-gray-500 hover:text-blue-600" />
            </button>
          </div>
          <p className="text-sm text-gray-600">{present} de {total} pessoas presentes</p>
        </div>
        <div className="text-right ml-4">
          <p className="text-xl font-semibold text-green-600">{percentage}%</p>
        </div>
      </div>
      {/* Barra de progresso */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-green-500 h-2 rounded-full transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// Função para formatar data para exibição
function formatDateForDisplay(dateString) {
  const date = new Date(dateString + 'T00:00:00');
  const dayOfWeek = date.toLocaleDateString('pt-BR', { weekday: 'long' });
  const formattedDate = date.toLocaleDateString('pt-BR', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });
  return { day: dayOfWeek, date: formattedDate };
}

// Função para converter data DD/MM/YYYY para YYYY-MM-DD
function convertDateToISO(dateString) {
  const parts = dateString.split('/');
  if (parts.length === 3) {
    return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
  }
  return dateString;
}

// Função para converter YYYY-MM-DD para DD/MM/YYYY
function convertDateToBR(dateString) {
  if (!dateString) return '';
  const parts = dateString.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateString;
}

export default function AttendanceDashboard() {
  const [showHistory, setShowHistory] = useState(false);
  const [date, setDate] = useState('');
  const [presentCount, setPresentCount] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [frequencies, setFrequencies] = useState([]);
  const [unit, setUnit] = useState(null);
  const [todayFrequency, setTodayFrequency] = useState(null);
  const [editingFrequency, setEditingFrequency] = useState(null);
  const [editDate, setEditDate] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [updating, setUpdating] = useState(false);

  // Carrega dados ao montar o componente
  useEffect(() => {
    loadFrequencies();
    // Define data padrão como hoje
    const today = new Date();
    const todayBR = today.toLocaleDateString('pt-BR');
    setDate(todayBR);
  }, []);

  const loadFrequencies = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/frequency/my-frequencies');
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Erro ao carregar frequências');
      }
      const data = await res.json();
      if (data.ok) {
        setFrequencies(data.frequencies || []);
        setUnit(data.unit);
        setTodayFrequency(data.todayFrequency);
      }
    } catch (err) {
      console.error('Erro ao carregar frequências:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Calcula métricas
  const calculateMetrics = () => {
    const capacity = unit?.capacity || 0;
    const totalCapacity = capacity > 0 ? `${capacity} pessoas` : '-';
    
    const presentToday = todayFrequency?.amount || null;
    const presentTodayDisplay = presentToday !== null ? presentToday.toString() : '-';
    
    // Calcula média semanal (últimos 7 dias)
    const today = new Date();
    const last7Days = frequencies.filter(f => {
      const freqDate = new Date(f.date + 'T00:00:00');
      const diffDays = (today - freqDate) / (1000 * 60 * 60 * 24);
      return diffDays >= 0 && diffDays <= 7;
    });
    
    let weeklyAverage = '-';
    if (last7Days.length > 0 && capacity > 0) {
      const average = last7Days.reduce((sum, f) => sum + f.amount, 0) / last7Days.length;
      const percentage = Math.round((average / capacity) * 100);
      weeklyAverage = `${percentage}%`;
    }

    return {
      totalCapacity,
      presentToday: presentTodayDisplay,
      weeklyAverage
    };
  };

  // Prepara histórico formatado
  const getFormattedHistory = () => {
    const capacity = unit?.capacity || 0;
    return frequencies
      .map(freq => {
        const { day, date: formattedDate } = formatDateForDisplay(freq.date);
        const percentage = capacity > 0 ? Math.round((freq.amount / capacity) * 100) : 0;
        return {
          id: freq.id,
          day,
          date: formattedDate,
          present: freq.amount,
          total: capacity,
          percentage,
          originalDate: freq.date // Mantém a data original para edição
        };
      })
      .sort((a, b) => {
        // Ordena por data (mais recente primeiro)
        const dateA = new Date(frequencies.find(f => f.id === a.id)?.date || '');
        const dateB = new Date(frequencies.find(f => f.id === b.id)?.date || '');
        return dateB - dateA;
      });
  };

  // Abre modal de edição
  const handleEditClick = (frequencyId) => {
    const frequency = frequencies.find(f => f.id === frequencyId);
    if (frequency) {
      // Converte YYYY-MM-DD para DD/MM/YYYY
      const dateBR = convertDateToBR(frequency.date);
      setEditDate(dateBR);
      setEditAmount(frequency.amount.toString());
      setEditingFrequency(frequencyId);
    }
  };

  // Fecha modal de edição
  const handleCloseEdit = () => {
    setEditingFrequency(null);
    setEditDate('');
    setEditAmount('');
    setError(null);
  };

  // Salva edição da frequência
  const handleUpdateFrequency = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError(null);
    setSuccess(null);

    if (!editDate || !editAmount) {
      setError('Por favor, preencha todos os campos');
      setUpdating(false);
      return;
    }

    const capacity = unit?.capacity || 0;
    const amount = parseInt(editAmount, 10);
    
    if (isNaN(amount) || amount < 0) {
      setError('Número de presentes deve ser um valor válido');
      setUpdating(false);
      return;
    }

    if (capacity > 0 && amount > capacity) {
      setError(`Número de presentes não pode ser maior que a capacidade (${capacity})`);
      setUpdating(false);
      return;
    }

    try {
      // Converte data de DD/MM/YYYY para YYYY-MM-DD
      const dateISO = convertDateToISO(editDate);
      
      const res = await fetch(`/api/frequency/update?frequency_id=${editingFrequency}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: dateISO,
          amount: amount
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || errorData.details || 'Erro ao atualizar frequência');
      }

      const data = await res.json();
      if (data.ok) {
        setSuccess('Frequência atualizada com sucesso!');
        handleCloseEdit();
        // Recarrega as frequências
        await loadFrequencies();
        // Limpa mensagem de sucesso após 3 segundos
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      console.error('Erro ao atualizar frequência:', err);
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    if (!date || !presentCount) {
      setError('Por favor, preencha todos os campos');
      setSaving(false);
      return;
    }

    const capacity = unit?.capacity || 0;
    const amount = parseInt(presentCount, 10);
    
    if (isNaN(amount) || amount < 0) {
      setError('Número de presentes deve ser um valor válido');
      setSaving(false);
      return;
    }

    if (capacity > 0 && amount > capacity) {
      setError(`Número de presentes não pode ser maior que a capacidade (${capacity})`);
      setSaving(false);
      return;
    }

    try {
      // Converte data de DD/MM/YYYY para YYYY-MM-DD
      const dateISO = convertDateToISO(date);
      
      const res = await fetch('/api/frequency/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          date: dateISO
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        // Trata erro de frequência duplicada (409)
        if (res.status === 409) {
          throw new Error(errorData.detail || 'Já existe uma frequência registrada para este dia');
        }
        throw new Error(errorData.error || errorData.detail || 'Erro ao salvar frequência');
      }

      const data = await res.json();
      if (data.ok) {
        setSuccess('Frequência registrada com sucesso!');
        setPresentCount('');
        // Recarrega as frequências
        await loadFrequencies();
        // Limpa mensagem de sucesso após 3 segundos
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      console.error('Erro ao salvar frequência:', err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const metrics = calculateMetrics();
  const history = getFormattedHistory();

  return (
    <div className="space-y-6">
      {/* Tabs para alternar entre Registrar e Histórico */}
      <div className="flex gap-4 border-b border-gray-200">
        <button
          onClick={() => setShowHistory(false)}
          className={cn(
            "pb-3 px-1 border-b-2 transition-colors text-sm font-medium",
            !showHistory
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          )}
        >
          Registrar Frequência
        </button>
        <button
          onClick={() => setShowHistory(true)}
          className={cn(
            "pb-3 px-1 border-b-2 transition-colors text-sm font-medium",
            showHistory
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          )}
        >
          Histórico de Frequência
        </button>
      </div>

      {/* Mensagens de erro e sucesso */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 mt-2">Carregando frequências...</p>
        </div>
      ) : !unit ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 text-center">
          <p className="text-yellow-800 font-medium">Você não possui nenhuma unidade cadastrada, verifique com o financeiro</p>
        </div>
      ) : (
        <>
          {!showHistory ? (
            <>
              {/* Cards de Métricas */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MetricCard 
                  title="Capacidade Total" 
                  value={metrics.totalCapacity} 
                  icon={Users} 
                  iconColorClass="text-blue-600"
                />
                <MetricCard 
                  title="Presentes Hoje" 
                  value={metrics.presentToday} 
                  icon={CheckCircle2} 
                  iconColorClass="text-green-600"
                />
                <MetricCard 
                  title="Média Semanal" 
                  value={metrics.weeklyAverage} 
                  icon={Calendar} 
                  iconColorClass="text-purple-600"
                />
              </div>

              {/* Formulário de Registrar Presença */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h2 className="text-lg font-semibold text-black mb-1">Registrar Presença</h2>
                <p className="text-sm text-gray-500 mb-6">Informe quantas pessoas estiveram presentes</p>
                
                <form onSubmit={handleSave} className="space-y-5 text-black">
                  <div>
                    <Label htmlFor="date">Data *</Label>
                    <div className="relative">
                      <input
                        id="date"
                        type="text"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        placeholder="DD/MM/AAAA"
                        className="w-full h-12 rounded-lg border border-gray-300 bg-white px-4 pr-10 text-base placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Formato: DD/MM/AAAA</p>
                  </div>

                  <div>
                    <Label htmlFor="present">Número de Presentes *</Label>
                    <input
                      id="present"
                      type="number"
                      value={presentCount}
                      onChange={(e) => setPresentCount(e.target.value)}
                      placeholder={unit?.capacity ? `Máximo: ${unit.capacity}` : 'Digite o número'}
                      max={unit?.capacity || undefined}
                      min={0}
                      className="w-full h-12 rounded-lg border border-gray-300 bg-white px-4 text-base placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? 'Salvando...' : 'Salvar Frequência'}
                  </button>
                </form>
              </div>
            </>
          ) : (
            <>
              {/* Histórico */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Histórico de Frequência</h2>
                {history.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                    <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-600">Nenhuma frequência registrada</p>
                    <p className="text-sm text-gray-500 mt-1">Comece registrando a frequência de hoje</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {history.map((item) => (
                      <HistoryCard 
                        key={item.id} 
                        {...item} 
                        onEdit={handleEditClick}
                      />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </>
      )}

      {/* Modal de Edição de Frequência */}
      {editingFrequency && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Editar Frequência</h3>
              <button
                onClick={handleCloseEdit}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-black"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleUpdateFrequency} className="space-y-5 text-black">
              <div>
                <Label htmlFor="edit-date">Data *</Label>
                <div className="relative">
                  <input
                    id="edit-date"
                    type="text"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    placeholder="DD/MM/AAAA"
                    className="w-full h-12 rounded-lg border border-gray-300 bg-white px-4 pr-10 text-base placeholder:text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
                <p className="text-xs text-gray-500 mt-1">Formato: DD/MM/AAAA</p>
              </div>

              <div>
                <Label htmlFor="edit-amount">Número de Presentes *</Label>
                <input
                  id="edit-amount"
                  type="number"
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                  placeholder={unit?.capacity ? `Máximo: ${unit.capacity}` : 'Digite o número'}
                  max={unit?.capacity || undefined}
                  min={0}
                  className="w-full h-12 rounded-lg border border-gray-300 bg-white px-4 text-base placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleCloseEdit}
                  disabled={updating}
                  className="flex-1 bg-gray-100 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="flex-1 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updating ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

