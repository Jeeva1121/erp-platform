import React, { useState, useEffect } from "react";
import { FaDownload, FaPrint, FaSearch, FaFilter, FaArrowLeft, FaFilePdf, FaFileExcel } from "react-icons/fa";
import { Link } from "react-router-dom";
import { apiFetch } from "../../utils/api";
import "./Reports.css";

interface BaseReportProps {
    title: string;
    reportId: string;
    columns: { header: string; key: string; type?: 'amount' | 'text' | 'date' | 'status'; align?: 'left' | 'center' | 'right' }[];
    endpoint: string;
    showBranchFilter?: boolean;
    showTaxFilter?: boolean;
}

const BaseReportPage: React.FC<BaseReportProps> = ({ 
    title, 
    reportId, 
    columns, 
    endpoint, 
    showBranchFilter = true,
    showTaxFilter = false
}) => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        branchId: 'all',
        searchTerm: '',
        taxType: 'all'
    });

    // Determine color based on report category
    const getReportColor = (id: string) => {
        const lowerId = id.toLowerCase();
        if (lowerId.includes('sales')) return '#6366f1'; // Indigo
        if (lowerId.includes('purchase')) return '#10b981'; // Green
        if (lowerId.includes('gst') || lowerId.includes('tax')) return '#f59e0b'; // Amber
        if (lowerId.includes('finance') || lowerId.includes('day-book') || lowerId.includes('balance') || lowerId.includes('pl-') || lowerId.includes('ledger') || lowerId.includes('cash-flow') || lowerId.includes('trial')) return '#3b82f6'; // Blue
        if (lowerId.includes('inventory') || lowerId.includes('stock')) return '#8b5cf6'; // Purple
        if (lowerId.includes('hr') || lowerId.includes('attendance') || lowerId.includes('salary')) return '#ef4444'; // Red
        if (lowerId.includes('executive') || lowerId.includes('health') || lowerId.includes('closing')) return '#14b8a6'; // Teal
        return '#6366f1';
    };

    const accentColor = getReportColor(reportId);

    const fetchData = async () => {
        setLoading(true);
        try {
            const query = new URLSearchParams(filters).toString();
            const res = await apiFetch(`${endpoint}?${query}`);
            const json = await res.json();
            setData(Array.isArray(json) ? json : []);
        } catch (err) {
            console.error("Failed to fetch report data:", err);
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [filters.startDate, filters.endDate, filters.branchId, filters.taxType]);

    const handlePrint = () => window.print();

    const calculateTotal = (key: string) => {
        return data.reduce((sum, item) => sum + (parseFloat(item[key]) || 0), 0);
    };

    return (
        <div className="db-page">
            {/* Topbar */}
            <header className="db-topbar no-print">
                <div className="db-topbar-left">
                    <span className="db-topbar-title">Reports</span>
                    <span className="db-topbar-sep">/</span>
                    <span className="db-topbar-sub">{title}</span>
                </div>
                <div className="db-topbar-right">
                    <Link to="/reports" className="btn-secondary" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center' }}>
                        <FaArrowLeft style={{ marginRight: '6px' }} /> Back to Dashboard
                    </Link>
                </div>
            </header>

            <div className="db-content" style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '32px 0' }}>
                {/* Hero Header - Dashboard Style */}
                <div style={{ 
                    background: `linear-gradient(to right, ${accentColor}08, #ffffff)`, 
                    borderRadius: '16px', 
                    padding: '32px 40px', 
                    marginBottom: '24px',
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '20px',
                    borderLeft: `5px solid ${accentColor}`,
                    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.04)',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    {/* Subtle Background Icon/Shape */}
                    <div style={{ position: 'absolute', right: '-20px', top: '-20px', fontSize: '120px', opacity: 0.03, color: accentColor, transform: 'rotate(-15deg)' }}>
                        <FaFilePdf />
                    </div>

                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{ display: 'inline-block', background: `${accentColor}15`, padding: '6px 12px', borderRadius: '100px', color: accentColor, fontSize: '12px', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '12px' }}>
                            {reportId.split('-').join(' ').toUpperCase()}
                        </div>
                        <h1 style={{ fontSize: '32px', fontWeight: 800, margin: '0 0 8px 0', color: '#1e293b', letterSpacing: '-0.5px' }}>{title}</h1>
                        <p className="no-print" style={{ color: '#64748b', fontSize: '15px', margin: 0 }}>Live data insights and financial summary for the selected period.</p>
                    </div>
                    <div className="header-actions no-print" style={{ display: 'flex', gap: '12px', position: 'relative', zIndex: 1 }}>
                        <button onClick={() => alert('PDF Export Coming Soon')} title="Export PDF" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '12px', border: '1px solid #fee2e2', background: 'white', color: '#ef4444', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                            <FaFilePdf size={16} /> PDF
                        </button>
                        <button onClick={() => alert('Excel Export Coming Soon')} title="Export Excel" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '12px', border: '1px solid #dcfce7', background: 'white', color: '#22c55e', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                            <FaFileExcel size={16} /> Excel
                        </button>
                        <button onClick={handlePrint} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '12px', border: 'none', background: accentColor, color: 'white', fontWeight: 600, cursor: 'pointer', boxShadow: `0 4px 14px ${accentColor}40`, transition: 'all 0.2s' }}>
                            <FaPrint size={16} /> Print
                        </button>
                    </div>
                </div>

                {/* Filters - Matching Style */}
                <div style={{ 
                    background: 'white',
                    padding: '24px', 
                    marginBottom: '24px', 
                    borderRadius: '16px',
                    display: 'flex', 
                    gap: '16px', 
                    alignItems: 'flex-end', 
                    flexWrap: 'wrap', 
                    overflowX: 'auto',
                    border: '1px solid #f1f5f9',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: '0 0 auto' }}>
                        <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>From Date</label>
                        <input 
                            type="date" 
                            style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px', background: '#f8fafc', color: '#1e293b', outline: 'none' }}
                            value={filters.startDate} 
                            onChange={(e) => setFilters({...filters, startDate: e.target.value})} 
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: '0 0 auto' }}>
                        <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>To Date</label>
                        <input 
                            type="date" 
                            style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px', background: '#f8fafc', color: '#1e293b', outline: 'none' }}
                            value={filters.endDate} 
                            onChange={(e) => setFilters({...filters, endDate: e.target.value})} 
                        />
                    </div>
                    {showBranchFilter && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: '1 1 auto', minWidth: '130px' }}>
                            <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Branch Location</label>
                            <select 
                                style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px', background: '#f8fafc', color: '#1e293b', outline: 'none', width: '100%' }}
                                value={filters.branchId} onChange={(e) => setFilters({...filters, branchId: e.target.value})}
                            >
                                <option value="all">All Branches</option>
                                <option value="1">Main Office</option>
                                <option value="2">Warehouse A</option>
                            </select>
                        </div>
                    )}
                    {showTaxFilter && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: '1 1 auto', minWidth: '130px' }}>
                            <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tax Type</label>
                            <select 
                                style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px', background: '#f8fafc', color: '#1e293b', outline: 'none', width: '100%' }}
                                value={filters.taxType} onChange={(e) => setFilters({...filters, taxType: e.target.value})}
                            >
                                <option value="all">Both</option>
                                <option value="TAX">Tax Invoice</option>
                                <option value="NON-TAX">Retail Bill</option>
                            </select>
                        </div>
                    )}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: '2 1 auto', minWidth: '180px' }}>
                        <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Search</label>
                        <div style={{ position: 'relative', width: '100%' }}>
                            <FaSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input 
                                style={{ padding: '10px 14px 10px 36px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px', width: '100%', background: '#f8fafc', color: '#1e293b', outline: 'none' }}
                                placeholder="Search in records..." 
                                value={filters.searchTerm}
                                onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
                            />
                        </div>
                    </div>
                    <div style={{ flex: '0 0 auto' }}>
                        <button style={{ 
                            padding: '10px 20px', 
                            borderRadius: '8px', 
                            background: accentColor, 
                            color: 'white', 
                            border: 'none', 
                            fontWeight: 600, 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '8px', 
                            cursor: 'pointer', 
                            boxShadow: `0 4px 12px ${accentColor}30`, 
                            height: '40px' 
                        }} onClick={fetchData}>
                            <FaFilter size={14} /> Apply
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="enterprise-table-wrapper">
                    {loading ? (
                        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-3)' }}>
                            <div className="spinner-innovative" style={{ margin: '0 auto 16px auto' }}></div>
                            Generating Report Data...
                        </div>
                    ) : data.length === 0 ? (
                        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-3)' }}>
                            <FaSearch size={32} style={{ opacity: 0.2, marginBottom: '16px' }} />
                            <p>No records found for the selected filters.</p>
                        </div>
                    ) : (
                        <table className="enterprise-table">
                            <thead>
                                <tr>
                                    {columns.map((col, idx) => (
                                        <th key={idx} style={{ textAlign: col.align || 'left' }}>{col.header}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {data.filter(row => {
                                    if (!filters.searchTerm) return true;
                                    return Object.values(row).some(val => 
                                        String(val).toLowerCase().includes(filters.searchTerm.toLowerCase())
                                    );
                                }).map((row, rowIdx) => (
                                    <tr key={rowIdx}>
                                        {columns.map((col, colIdx) => (
                                            <td key={colIdx} style={{ textAlign: col.align || 'left', fontWeight: col.type === 'amount' ? 600 : 400, color: col.type === 'amount' ? 'var(--text-1)' : 'var(--text-2)' }}>
                                                {col.type === 'amount' 
                                                    ? `₹${new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2 }).format(row[col.key] || 0)}`
                                                    : row[col.key] || '-'}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                                {/* Totals Row */}
                                <tr style={{ background: '#eff6ff' }}>
                                    {columns.map((col, colIdx) => (
                                        <td key={colIdx} style={{ textAlign: col.align || 'left', fontWeight: 800, color: '#1d4ed8', fontSize: '14px', borderTop: '2px solid #bfdbfe' }}>
                                            {colIdx === 0 ? 'TOTALS' : (
                                                col.type === 'amount' 
                                                ? `₹${new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2 }).format(calculateTotal(col.key))}`
                                                : ''
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Print Styles */}
            <style dangerouslySetInnerHTML={{ __html: `
                @media print {
                    .no-print, .db-sidebar, .db-topbar, .report-breadcrumb { display: none !important; }
                    .db-page { background: white; padding: 0; margin: 0; }
                    .db-content { padding: 0 !important; max-width: 100% !important; }
                    .enterprise-table { font-size: 10pt; width: 100%; border-collapse: collapse; }
                    .enterprise-table th, .enterprise-table td { padding: 8px; border: 1px solid #ccc; }
                    .enterprise-table-wrapper { border: none; box-shadow: none; }
                }
            `}} />
        </div>
    );
};

export default BaseReportPage;
