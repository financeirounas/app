import { 
  LogOut, 
  Home, 
  Package, 
  ShoppingCart, 
  Users, 
  BarChart3 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const currentPath = router.pathname;
  const [unitName, setUnitName] = useState('Sem unidade');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    fetch('/api/units/my-units')
      .then((res) => {
        if (!res.ok) {
          return res.json().then(errorData => {
            console.error('Erro ao buscar unidades:', errorData);
            throw new Error(`HTTP error! status: ${res.status}, details: ${JSON.stringify(errorData)}`);
          }).catch(() => {
            throw new Error(`HTTP error! status: ${res.status}`);
          });
        }
        return res.json();
      })
      .then((data) => {
        console.log('Dados recebidos da API:', data);
        if (data.ok && data.units && Array.isArray(data.units) && data.units.length > 0) {
          const unitName = data.units[0].name || 'Unidade';
          console.log('Nome da unidade encontrado:', unitName);
          setUnitName(unitName);
        } else {
          console.warn('Nenhuma unidade encontrada:', data);
          setUnitName('Sem unidade');
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erro ao buscar unidades:', err);
        setUnitName('Erro ao carregar');
        setLoading(false);
      });
  }, []);

  const handleLogout = async () => {
    try {

      const res = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Resposta da API de logout:', res);
    } catch (err) {
      
      console.warn('Erro ao chamar API de logout:', err);
    } finally {
      console.log('Redirecionando para a página de login.');
      router.push('/auth/login');
    }
  };

  const navItems = [
    { id: 'inicio', label: 'Início', icon: Home, path: '/' },
    { id: 'estoque', label: 'Estoque', icon: Package, path: '/estoque' },
    { id: 'pedidos', label: 'Pedidos', icon: ShoppingCart, path: '/pedidos' },
    { id: 'frequencia', label: 'Frequência', icon: Users, path: '/frequencia' },
    { id: 'relatorios', label: 'Relatórios', icon: BarChart3, path: '/relatorios' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-950 text-white flex flex-col fixed h-screen">
        {/* Título */}
        <div className="p-6 border-b border-blue-900">
          <h1 className="text-lg font-semibold text-white">Sistema de Gestão Alimentar</h1>
        </div>

        {/* Navegação */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;
            return (
              <button
                key={item.id}
                onClick={() => router.push(item.path)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium",
                  isActive 
                    ? "bg-blue-900 text-white" 
                    : "text-blue-100 hover:bg-blue-900 hover:text-white"
                )}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Rodapé da Sidebar */}
        <div className="p-4 border-t border-blue-900 space-y-2">
          {/* Nome da Unidade */}
          <div className="px-4 py-2 text-blue-200 text-sm">
            {loading ? 'Carregando...' : unitName} 
            {!loading && unitName === 'Sem unidade' && (
              <div style={{ fontSize: "11px" }} className="text-xs text-red-400">Nenhuma unidade associada - Solicite ao financeiro do Unas para associar uma unidade.</div>
            )}
          </div>

          
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-blue-100 hover:bg-blue-900 hover:text-white transition-colors text-sm font-medium"
          >
            <LogOut className="w-5 h-5" />
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
}

