import { useState, useEffect, useRef } from 'react';
import { Download, ChevronDown, TrendingUp } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
// import html2canvas from 'html2canvas'; // Removido para gerar PDF de forma mais profissional e estável

// =========================================================================
// COMPONENTES AUXILIARES (DEVE FICAR EM ARQUIVOS SEPARADOS EM UM PROJETO REAL)
// (Mantidos aqui para que o código seja um único bloco copiado)
// =========================================================================

function MetricCard({ title, value, subtext, trend, trendColor = 'text-green-500' }) {
    return (
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-start justify-between mb-4">
                <span className="text-gray-600 text-base font-normal">{title}</span>
            </div>
            <div className="flex items-baseline gap-2">
                <span className="text-3xl font-semibold text-gray-900">{value}</span>
                {trend && (
                    <span className={`text-sm font-medium ${trendColor} flex items-center gap-0.5`}>
                        <TrendingUp className="w-4 h-4" />
                        {trend}
                    </span>
                )}
            </div>
            {subtext && (
                <span className="text-sm text-gray-500 mt-1 block">{subtext}</span>
            )}
        </div>
    );
}

function ResourceOriginCard({ title, value, subtitle, highlightColor = 'bg-blue-50 border-blue-200' }) {
    return (
        <div className={`bg-white p-6 rounded-xl border ${highlightColor} shadow-sm`}>
            <div className="flex items-start justify-between mb-4">
                <span className="text-gray-600 text-base font-normal">{title}</span>
            </div>
            <div className="flex items-baseline gap-2">
                <span className="text-3xl font-semibold text-gray-900">{value}</span>
            </div>
            {subtitle && (
                <span className="text-sm text-gray-500 mt-1 block">{subtitle}</span>
            )}
        </div>
    );
}

function ProportionBar({ used, available, usedLabel, availableLabel, usedColor = 'bg-blue-600', availableColor = 'bg-green-500' }) {
    const total = used + available;
    const usedPercent = (used / total) * 100;
    const availablePercent = (available / total) * 100;

    return (
        <div className="w-full">
            <div className="flex h-10 rounded-lg overflow-hidden">
                {usedPercent > 0 && (
                    <div 
                        className={`${usedColor} flex items-center justify-center text-white text-sm font-medium`}
                        style={{ width: `${usedPercent}%` }}
                    >
                        {usedPercent.toFixed(1)}% {usedLabel}
                    </div>
                )}
                {availablePercent > 0 && (
                    <div 
                        className={`${availableColor} flex items-center justify-center text-white text-sm font-medium`}
                        style={{ width: `${availablePercent}%` }}
                    >
                        {availablePercent.toFixed(1)}% {availableLabel}
                    </div>
                )}
            </div>
        </div>
    );
}

function StackedBarChart({ data, title, subtitle, chartRef }) {
    const maxValue = Math.max(...data.map(item => item.comprado + item.doado));
    const yAxisLabels = [];
    const step = maxValue / 4;
    for (let i = 0; i <= 4; i++) {
        yAxisLabels.push(Math.round(i * step));
    }
    const reversedLabels = [...yAxisLabels].reverse();

    return (
        <div ref={chartRef} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                {subtitle && (
                    <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
                )}
            </div>
            <div className="relative h-64 pl-8">
                {/* Grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between pb-8 pr-4">
                    {reversedLabels.map((label, idx) => {
                        const position = (idx / (reversedLabels.length - 1)) * 100;
                        return (
                            <div 
                                key={idx} 
                                className="absolute left-0 right-4 border-t border-dashed border-gray-300"
                                style={{ bottom: `${position}%` }}
                            >
                                <span className="absolute -left-8 -top-3 text-xs text-gray-500">{label}</span>
                            </div>
                        );
                    })}
                </div>
                
                {/* Bars container */}
                <div className="flex items-end gap-3 h-full pb-8 pr-4 relative z-10">
                    {data.map((item, idx) => {
                        const total = item.comprado + item.doado;
                        const totalHeight = (total / maxValue) * 100;
                        const compradoHeight = total > 0 ? (item.comprado / total) * 100 : 0;
                        const doadoHeight = total > 0 ? (item.doado / total) * 100 : 0;
                        
                        return (
                            <div key={idx} className="flex-1 flex flex-col items-center group relative h-full">
                                <div className="w-full h-full flex flex-col justify-end">
                                    <div className="w-full relative" style={{ height: `${totalHeight}%` }}>
                                        <div 
                                            className="absolute bottom-0 left-0 right-0 bg-blue-600"
                                            style={{ height: `${compradoHeight}%` }}
                                        />
                                        <div 
                                            className="absolute top-0 left-0 right-0 bg-green-500"
                                            style={{ height: `${doadoHeight}%` }}
                                        />
                                    </div>
                                </div>
                                <span className="text-xs text-gray-600 mt-2 text-center">{item.name}</span>
                                
                                {/* Tooltip */}
                                <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded px-3 py-2 whitespace-nowrap z-10 shadow-lg">
                                    <div className="font-semibold mb-1">{item.name}</div>
                                    <div>Comprado: {item.comprado} kg</div>
                                    <div>Doado: {item.doado} kg</div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            
            {/* Legend */}
            <div className="flex justify-center gap-6 mt-6">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-600 rounded"></div>
                    <span className="text-sm text-gray-600">Comprado</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span className="text-sm text-gray-600">Doado</span>
                </div>
            </div>
        </div>
    );
}

function VerticalBarChart({ data, title, chartRef }) {
    const maxValue = Math.max(...data.flatMap(item => [item.gasto || 0, item.orçamento || 0]));
    const yAxisLabels = [];
    const step = maxValue / 4;
    for (let i = 0; i <= 4; i++) {
        yAxisLabels.push(Math.round(i * step));
    }
    const reversedLabels = [...yAxisLabels].reverse();

    return (
        <div ref={chartRef} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            </div>
            <div className="relative h-64 pl-8">
                {/* Grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between pb-8 pr-4">
                    {reversedLabels.map((label, idx) => {
                        const position = (idx / (reversedLabels.length - 1)) * 100;
                        return (
                            <div 
                                key={idx} 
                                className="absolute left-0 right-4 border-t border-dashed border-gray-300"
                                style={{ bottom: `${position}%` }}
                            >
                                <span className="absolute -left-8 -top-3 text-xs text-gray-500">{label}</span>
                            </div>
                        );
                    })}
                </div>
                
                {/* Bars container */}
                <div className="flex items-end gap-2 h-full pb-8 pr-4 relative z-10">
                    {data.map((item, idx) => {
                        const gastoPercent = item.gasto ? (item.gasto / maxValue) * 100 : 0;
                        const orçamentoPercent = item.orçamento ? (item.orçamento / maxValue) * 100 : 0;
                        
                        return (
                            <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full">
                                <div className="w-full flex gap-1 justify-center items-end" style={{ height: '100%' }}>
                                    {item.gasto !== undefined && (
                                        <div 
                                            className="bg-green-500 w-full"
                                            style={{ height: `${gastoPercent}%` }}
                                            title={`Gasto: ${item.gasto}`}
                                        />
                                    )}
                                    <div 
                                        className="bg-blue-600 w-full"
                                        style={{ height: `${orçamentoPercent}%` }}
                                        title={`Orçamento: ${item.orçamento}`}
                                    />
                                </div>
                                <span className="text-xs text-gray-600 mt-2 text-center">{item.month}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
            
            {/* Legend */}
            <div className="flex justify-center gap-6 mt-6">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span className="text-sm text-gray-600">Gasto</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-600 rounded"></div>
                    <span className="text-sm text-gray-600">Orçamento</span>
                </div>
            </div>
        </div>
    );
}

function ComparisonTable({ data }) {
    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">Comparativo Mensal</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mês</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gasto Total</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frequência</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Per Capita</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {data.map((row, idx) => (
                            <tr key={idx} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.mes}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{row.gastoTotal}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className={`font-medium ${row.frequenciaColor || 'text-green-600'}`}>
                                        {row.frequencia}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{row.perCapita}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// Funções auxiliares de formatação
function formatCurrency(value) {
    if (!value && value !== 0) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
}

function formatMonthToFullName(monthStr) {
    if (!monthStr) return '';
    const [year, month] = monthStr.split('-');
    const monthNames = {
        '01': 'Janeiro', '02': 'Fevereiro', '03': 'Março', '04': 'Abril',
        '05': 'Maio', '06': 'Junho', '07': 'Julho', '08': 'Agosto',
        '09': 'Setembro', '10': 'Outubro', '11': 'Novembro', '12': 'Dezembro'
    };
    return `${monthNames[month] || month} ${year}`;
}

function formatMonthToShort(monthStr) {
    if (!monthStr) return '';
    const [, month] = monthStr.split('-');
    const monthNames = {
        '01': 'Jan', '02': 'Fev', '03': 'Mar', '04': 'Abr',
        '05': 'Mai', '06': 'Jun', '07': 'Jul', '08': 'Ago',
        '09': 'Set', '10': 'Out', '11': 'Nov', '12': 'Dez'
    };
    return monthNames[month] || month;
}

function monthToYYYYMM(monthDisplay) {
    // Converte "Novembro 2025" para "2025-11"
    const parts = monthDisplay.split(' ');
    if (parts.length !== 2) return null;
    const monthNames = {
        'Janeiro': '01', 'Fevereiro': '02', 'Março': '03', 'Abril': '04',
        'Maio': '05', 'Junho': '06', 'Julho': '07', 'Agosto': '08',
        'Setembro': '09', 'Outubro': '10', 'Novembro': '11', 'Dezembro': '12'
    };
    const month = monthNames[parts[0]];
    const year = parts[1];
    return month && year ? `${year}-${month}` : null;
}

function YYYYMMToDisplay(monthStr) {
    if (!monthStr) return '';
    return formatMonthToFullName(monthStr);
}

// Função para obter o mês atual
function getCurrentMonth() {
    const now = new Date();
    const monthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    return YYYYMMToDisplay(monthStr);
}

// =========================================================================
// COMPONENTE PRINCIPAL
// =========================================================================

export default function ReportsDashboard() {

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [report, setReport] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(() => getCurrentMonth());
    const [previousReport, setPreviousReport] = useState(null); // Para calcular tendência
    const [exporting, setExporting] = useState(false);
    // As referências para captura de imagem não são mais necessárias se não usarmos html2canvas
    const foodChartRef = useRef(null); 
    const budgetChartRef = useRef(null); 

    // Mantenha os useEffects para buscar dados
    useEffect(() => {
        const fetchReport = async () => {
            setLoading(true);
            setError(null);
            
            try {
                const monthParam = monthToYYYYMM(selectedMonth);
                const url = monthParam 
                    ? `/api/reports/my-report?month=${encodeURIComponent(monthParam)}`
                    : '/api/reports/my-report';
                
                const res = await fetch(url);
                if (!res.ok) {
                    throw new Error('Erro ao buscar relatório');
                }
                
                const data = await res.json();
                
                if (data.ok && data.report) {
                    setReport(data.report);
                } else {
                    throw new Error('Dados do relatório não encontrados');
                }
            } catch (err) {
                console.error('Erro ao buscar relatório:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchReport();
    }, [selectedMonth]);

    useEffect(() => {
        if (!selectedMonth) return;
        
        const fetchPreviousMonth = async () => {
            try {
                const currentMonth = monthToYYYYMM(selectedMonth);
                if (!currentMonth) return;
                
                const [year, month] = currentMonth.split('-');
                let prevMonth = parseInt(month) - 1;
                let prevYear = parseInt(year);
                
                if (prevMonth < 1) {
                    prevMonth = 12;
                    prevYear -= 1;
                }
                
                const prevMonthStr = `${prevYear}-${String(prevMonth).padStart(2, '0')}`;
                const url = `/api/reports/my-report?month=${encodeURIComponent(prevMonthStr)}`;
                
                const res = await fetch(url);
                if (res.ok) {
                    const data = await res.json();
                    if (data.ok && data.report) {
                        setPreviousReport(data.report);
                    }
                }
                
            } catch (err) {
                console.error('Erro ao buscar mês anterior:', err);
                // Não é crítico, apenas não mostra tendência
            }
        };

        fetchPreviousMonth();
    }, [selectedMonth]);

    // Verificar se o usuário tem unidade
    const hasUnit = report?.unit_name && report?.unit_name !== 'Unidade não encontrada';

    // Calcular dados transformados
    const unitName = report?.unit_name || 'Carregando...';
    
    // Métricas
    const capacity = report?.metrics?.capacity || 0;
    const frequencyPct = report?.metrics?.frequency_pct || 0;
    const costPerCapita = report?.metrics?.cost_per_capita || 0;
    
    // Calcular tendência de frequência
    const previousFrequency = previousReport?.metrics?.frequency_pct || 0;
    const frequencyTrend = frequencyPct - previousFrequency;
    const frequencyTrendText = frequencyTrend !== 0
        ? `${Math.abs(frequencyTrend).toFixed(1)}%` 
        : null;
    const frequencyTrendSign = frequencyTrend > 0 ? '↑' : frequencyTrend < 0 ? '↓' : '';
    const fullTrendText = frequencyTrendText ? `${frequencyTrendSign} ${frequencyTrendText} vs mês anterior` : null;
    const trendColorClass = frequencyTrend >= 0 ? "text-green-500" : "text-red-500";


    // Totais
    const packsBudget = report?.totals?.packs_budget || 0;
    const packsDonations = report?.totals?.packs_donations || 0;
    const totalPacks = report?.totals?.total_packs || 0;
    
    // Porcentagens de origem
    const budgetPercent = totalPacks > 0 ? (packsBudget / totalPacks) * 100 : 0;
    const donationsPercent = totalPacks > 0 ? (packsDonations / totalPacks) * 100 : 0;

    // Dados de alimentos
    const foodData = (report?.storage_summary || []).map(item => ({
        name: item.food,
        comprado: item.bought_amount || 0,
        doado: item.donated_amount || 0
    }));

    // Dados de orçamento mensal
    const budgetData = (report?.monthly_comparison || []).map(item => ({
        month: formatMonthToShort(item.month),
        gasto: item.spent || undefined,
        orçamento: item.budget || 0
    }));

    // Utilização do orçamento (mês atual)
    const currentMonthStr = monthToYYYYMM(selectedMonth);
    const currentMonthData = report?.monthly_comparison?.find(m => m.month === currentMonthStr) || 
        report?.monthly_comparison?.[report.monthly_comparison.length - 1] || {};
    const budgetTotal = currentMonthData?.budget || 0;
    const totalSpending = report?.metrics?.total_spending || 0;
    const usedPercent = budgetTotal > 0 ? (totalSpending / budgetTotal) * 100 : 0;
    const available = budgetTotal - totalSpending;
    const availablePercent = 100 - usedPercent;

    // Tabela comparativa mensal
    const comparisonTableData = (report?.monthly_comparison || [])
        .slice(-3) // Últimos 3 meses
        .reverse() // Mais recente primeiro
        .map(item => {
            // Lógica de cálculo de frequência (mantida)
            const monthFreqs = (report?.frequencies || []).filter(freq => {
                try {
                    if (!freq.date) return false;
                    let dateStr = freq.date;
                    if (dateStr.includes('/')) {
                        const [datePart] = dateStr.split(' ');
                        const [day, month, year] = datePart.split('/');
                        const freqMonth = `${year}-${month.padStart(2, '0')}`;
                        return freqMonth === item.month;
                    } else {
                        const date = new Date(dateStr);
                        const freqMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                        return freqMonth === item.month;
                    }
                } catch {
                    return false;
                }
            });
            
            const avgFreq = monthFreqs.length > 0
                ? monthFreqs.reduce((sum, f) => sum + (f.amount || 0), 0) / monthFreqs.length
                : 0;
            const freqPercent = capacity > 0 ? (avgFreq / capacity) * 100 : 0;
            const perCapita = capacity > 0 ? (item.spent || 0) / capacity : 0;
            
            return {
                mes: formatMonthToFullName(item.month),
                gastoTotal: formatCurrency(item.spent || 0),
                frequencia: `${freqPercent.toFixed(0)}%`,
                frequenciaColor: freqPercent >= 90 ? 'text-green-600' : 'text-gray-600',
                perCapita: formatCurrency(perCapita)
            };
        });

    // Gerar lista de meses disponíveis (últimos 12 meses)
    const availableMonths = [];
    const now = new Date();
    for (let i = 0; i < 12; i++) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        availableMonths.push(YYYYMMToDisplay(monthStr));
    }


    // =========================================================================
    // FUNÇÃO DE EXPORTAÇÃO REFATORADA
    // =========================================================================
    const handleExport = async () => {
        if (!report) return;

        setExporting(true);

        try {
            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.getWidth();
            const margin = 15;
            let yPosition = margin;

            // Cores (preto e tons de cinza)
            const blackColor = [0, 0, 0]; // Preto
            const darkGray = [50, 50, 50]; // Cinza escuro para títulos
            const mediumGray = [100, 100, 100]; // Cinza médio para cabeçalhos
            const lightGray = [150, 150, 150]; // Cinza claro para separadores
            const grayColor = [107, 114, 128]; // Cinza para texto secundário

            // Título principal
            doc.setFontSize(24);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...blackColor);
            doc.text('Relatório de Gestão Mensal', pageWidth / 2, yPosition, { align: 'center' });
            yPosition += 10;

            doc.setFontSize(14);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(...blackColor);
            doc.text(`Unidade: ${unitName}`, pageWidth / 2, yPosition, { align: 'center' });
            yPosition += 7;
            doc.text(`Mês de Referência: ${selectedMonth}`, pageWidth / 2, yPosition, { align: 'center' });
            yPosition += 15;
            
            // Separador
            doc.setDrawColor(...lightGray);
            doc.setLineWidth(0.5);
            doc.line(margin, yPosition, pageWidth - margin, yPosition);
            yPosition += 10;

            // Seção 1: Métricas Chave
            doc.setFontSize(18);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...darkGray);
            doc.text('1. Métricas Chave do Mês', margin, yPosition);
            yPosition += 8;

            doc.setFontSize(12);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(...blackColor);
            
            const metricsBody = [
                ['Capacidade Total', `${capacity} pessoas`, 'Meta de Atendimento'],
                ['Custo Per Capita', formatCurrency(costPerCapita), 'Custo médio por pessoa atendida'],
                ['Gasto Total (Orçamento)', formatCurrency(totalSpending), `Orçamento: ${formatCurrency(budgetTotal)}`],
                ['Orçamento Disponível', formatCurrency(available), `${availablePercent.toFixed(1)}% do total`],
            ];

            autoTable(doc, {
                startY: yPosition,
                head: [['Métrica', 'Valor Atual', 'Observação']],
                body: metricsBody,
                theme: 'grid',
                headStyles: { fillColor: mediumGray, textColor: 255, fontStyle: 'bold', fontSize: 10 },
                bodyStyles: { fontSize: 10, textColor: blackColor, halign: 'left' },
                columnStyles: {
                    0: { fontStyle: 'bold', cellWidth: 40 },
                    1: { fontStyle: 'bold' },
                    2: { textColor: grayColor }
                },
                margin: { left: margin, right: margin }
            });
            yPosition = doc.lastAutoTable.finalY + 15;

            // Seção 2: Origem dos Recursos
            doc.setFontSize(18);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...darkGray);
            doc.text('2. Origem dos Recursos (Pacotes)', margin, yPosition);
            yPosition += 8;

            const originBody = [
                ['Verba Normal', `${packsBudget} pacotes`, `${budgetPercent.toFixed(1)}%`],
                ['Doações', `${packsDonations} pacotes`, `${donationsPercent.toFixed(1)}%`],
                ['Total Geral', `${totalPacks} pacotes`, '100.0%']
            ];

            autoTable(doc, {
                startY: yPosition,
                head: [['Origem', 'Quantidade', 'Proporção']],
                body: originBody,
                theme: 'striped',
                headStyles: { fillColor: mediumGray, textColor: 255, fontStyle: 'bold', fontSize: 10 },
                bodyStyles: { fontSize: 10 },
                margin: { left: margin, right: margin }
            });
            yPosition = doc.lastAutoTable.finalY + 15;

            // Seção 3: Detalhamento de Alimentos (Substitui o Gráfico Stacked Bar)
            
            // Verificar se precisa de nova página
            if (yPosition > 250) {
                doc.addPage();
                yPosition = margin;
            }

            doc.setFontSize(18);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...darkGray);
            doc.text('3. Detalhamento de Alimentos (kg)', margin, yPosition);
            yPosition += 8;

            const foodTableData = foodData.map(item => [
                item.name,
                `${item.comprado} kg`,
                `${item.doado} kg`,
                `${(item.comprado + item.doado)} kg`
            ]);
            
            autoTable(doc, {
                startY: yPosition,
                head: [['Alimento', 'Comprado', 'Doado', 'Total']],
                body: foodTableData,
                theme: 'grid',
                headStyles: { fillColor: mediumGray, textColor: 255, fontStyle: 'bold', fontSize: 10 },
                bodyStyles: { fontSize: 10 },
                margin: { left: margin, right: margin }
            });
            yPosition = doc.lastAutoTable.finalY + 15;
            
            // Seção 4: Comparativo Mensal (Substitui o Gráfico Vertical Bar)

            // Verificar se precisa de nova página
            if (yPosition > 250) {
                doc.addPage();
                yPosition = margin;
            }
            
            doc.setFontSize(18);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...darkGray);
            doc.text('4. Análise de Desempenho Mensal (Últimos 3 Meses)', margin, yPosition);
            yPosition += 8;

            // Usar comparisonTableData já formatada
            autoTable(doc, {
                startY: yPosition,
                head: [['Mês', 'Gasto Total', 'Frequência Média', 'Custo Per Capita']],
                body: comparisonTableData.map(row => [
                    row.mes,
                    row.gastoTotal,
                    row.frequencia,
                    row.perCapita
                ]),
                theme: 'striped',
                headStyles: { fillColor: mediumGray, textColor: 255, fontStyle: 'bold', fontSize: 10 },
                bodyStyles: { fontSize: 10 },
                margin: { left: margin, right: margin }
            });

            // Rodapé (Footer)
            const pageCount = doc.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(8);
                doc.setFont('helvetica', 'italic');
                doc.setTextColor(...grayColor);
                const footerY = doc.internal.pageSize.getHeight() - 10;
                
                doc.text(
                    `Página ${i} de ${pageCount}`,
                    pageWidth - margin,
                    footerY,
                    { align: 'right' }
                );
                doc.text(
                    `Gerado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')} | Sistema de Gestão`,
                    margin,
                    footerY,
                    { align: 'left' }
                );
            }

            // Salvar PDF
            const fileName = `relatorio-gestao-${unitName.replace(/\s+/g, '-')}-${selectedMonth.replace(/\s+/g, '-')}.pdf`;
            doc.save(fileName);
        } catch (error) {
            console.error('Erro ao gerar PDF:', error);
            alert('Erro crítico ao gerar PDF. Verifique o console para mais detalhes.');
        } finally {
            setExporting(false);
        }
    };
    // =========================================================================

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                    <p className="text-gray-600">Carregando relatório...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <p className="text-red-600 mb-2">Erro ao carregar relatório</p>
                    <p className="text-sm text-gray-500">{error}</p>
                </div>
            </div>
        );
    }

    if (!report) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <p className="text-gray-600">Nenhum dado disponível</p>
                </div>
            </div>
        );
    }

    if (!hasUnit) {
        return (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 text-center">
                <p className="text-yellow-800 font-medium">Você não possui nenhuma unidade cadastrada, verifique com o financeiro</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Relatórios</h1>
                    <p className="text-gray-600">Análise de dados e indicadores da unidade</p>
                </div>
                <div className="flex items-center gap-4">
                    {/* Botão Exportar */}
                    <button
                        onClick={handleExport}
                        disabled={exporting}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Download className="w-4 h-4" />
                        {exporting ? 'Gerando PDF...' : 'Exportar'}
                    </button>
                </div>
            </div>

            {/* Cards de Métricas Principais */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MetricCard 
                    title="Capacidade" 
                    value={`${capacity} pessoas`}
                    subtext="Capacidade total" 
                />
                <MetricCard 
                    title="Frequência Média" 
                    value={`${frequencyPct.toFixed(0)}%`}
                    subtext={fullTrendText}
                    trend={frequencyTrendSign + (frequencyTrendText || '')}
                    trendColor={trendColorClass}
                />
                <MetricCard 
                    title="Custo Per Capita" 
                    value={formatCurrency(costPerCapita)}
                    subtext="Por pessoa/mês" 
                />
            </div>

            {/* Seção Origem dos Recursos */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">
                    Origem dos Recursos - {unitName}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <ResourceOriginCard
                        title="Verba Normal"
                        value={`${packsBudget} pacotes`}
                        subtitle={`${budgetPercent.toFixed(1)}% do total`}
                        highlightColor="bg-blue-50 border-blue-200"
                    />
                    <ResourceOriginCard
                        title="Doações"
                        value={`${packsDonations} pacotes`}
                        subtitle={`${donationsPercent.toFixed(1)}% do total`}
                        highlightColor="bg-green-50 border-green-200"
                    />
                    <ResourceOriginCard
                        title="Total Geral"
                        value={`${totalPacks} pacotes`}
                        subtitle="Todas as fontes"
                        highlightColor="bg-gray-50 border-gray-200"
                    />
                </div>
            </div>

            {/* Proporção de Recursos */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">Proporção de Recursos</h2>
                <ProportionBar
                    used={budgetPercent}
                    available={donationsPercent}
                    usedLabel="Verba"
                    availableLabel="Doação"
                    usedColor="bg-blue-600"
                    availableColor="bg-green-500"
                />
            </div>

            {/* Gráfico de Alimentos */}
            <StackedBarChart
                data={foodData}
                title={`Alimentos: Comprados vs Doados - ${unitName}`}
                subtitle="Comparativo em quilogramas (kg) das categorias de alimentos por origem"
                chartRef={foodChartRef}
            />

            {/* Gráfico de Orçamentos */}
            <VerticalBarChart
                data={budgetData}
                title="Comparação de Orçamentos Mensais (2025)"
                chartRef={budgetChartRef}
            />

            {/* Utilização do Orçamento */}
            <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Utilização do Orçamento</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className=" p-6 rounded-xl border border-green-200">
                        <div className="mb-4">
                            <span className="text-gray-600 text-base font-normal">Orçamento Utilizado</span>
                        </div>
                        <div className="mb-2">
                            <span className="text-4xl font-semibold text-green-600">{usedPercent.toFixed(1).replace('.', ',')}%</span>
                        </div>
                        <div>
                            <span className="text-sm text-gray-600">{formatCurrency(totalSpending)} de {formatCurrency(budgetTotal)}</span>
                        </div>
                    </div>
                    <div className=" p-6 rounded-xl border border-yellow-200">
                        <div className="mb-4">
                            <span className="text-gray-600 text-base font-normal">Equivalente em Comida Não Utilizado</span>
                        </div>
                        <div className="mb-2">
                            <span className="text-4xl font-semibold text-orange-600">{availablePercent.toFixed(1).replace('.', ',')}%</span>
                        </div>
                        <div>
                            <span className="text-sm text-gray-600">{formatCurrency(available)} disponível</span>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-2">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Proporção do Orçamento</h3>
                    <ProportionBar
                        used={usedPercent}
                        available={availablePercent}
                        usedLabel="Utilizado"
                        availableLabel="Disponível"
                        usedColor="bg-green-600"
                        availableColor="bg-orange-500"
                    />
                </div>
            </div>

            {/* Tabela Comparativa */}
            <ComparisonTable data={comparisonTableData} />
        </div>
    );
}