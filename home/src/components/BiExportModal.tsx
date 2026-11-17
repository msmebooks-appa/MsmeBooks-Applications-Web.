import React, { useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  CheckCircle2,
  X,
  FileSpreadsheet,
  Layers,
  Sparkles,
  BarChart3,
  Calendar,
  Building,
  Globe2,
  Loader2,
} from 'lucide-react';
import { CurrencyCode } from '../types';
import { CURRENCIES } from '../data/mockData';
import { REGIONAL_METRICS } from './AfricanPerformanceMap';
import { jsPDF } from 'jspdf';

interface BiExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCurrency: CurrencyCode;
  monthlyData: Array<{ month: string; rev: number; exp: number; profit: number }>;
  branchPerformance: Array<{ name: string; share: string; value: number; status: string }>;
}

export const BiExportModal: React.FC<BiExportModalProps> = ({
  isOpen,
  onClose,
  currentCurrency,
  monthlyData,
  branchPerformance,
}) => {
  const currency = CURRENCIES[currentCurrency] || CURRENCIES.NGN;
  const [includeTrajectory, setIncludeTrajectory] = useState(true);
  const [includeBranches, setIncludeBranches] = useState(true);
  const [includeAfricanRegions, setIncludeAfricanRegions] = useState(true);
  const [reportPeriod, setReportPeriod] = useState('H1 2026 Executive Review');
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  // Convert NGN base amounts to currently selected currency
  const convertAmount = (ngnAmount: number) => {
    return ngnAmount * currency.rate;
  };

  const totalRevenue = monthlyData.reduce((acc, item) => acc + convertAmount(item.rev), 0);
  const totalExpenses = monthlyData.reduce((acc, item) => acc + convertAmount(item.exp), 0);
  const totalProfit = totalRevenue - totalExpenses;
  const avgMargin = totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : '0';

  // Generate and download CSV
  const handleExportCSV = () => {
    setIsExporting('csv');
    setDownloadSuccess(null);

    try {
      const now = new Date();
      const dateStr = now.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
      const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

      let csv = '\uFEFF'; // UTF-8 BOM for Excel
      csv += 'MSMEBOOKS PAN-AFRICAN BUSINESS INTELLIGENCE & PERFORMANCE DOSSIER\r\n';
      csv += `Report Period:,"${reportPeriod}"\r\n`;
      csv += `Generated On:,"${dateStr} at ${timeStr}"\r\n`;
      csv += `Reporting Currency:,"${currency.code} (${currency.symbol})"\r\n`;
      csv += `Exchange Rate relative to NGN:,"${currency.rate}"\r\n`;
      csv += '\r\n';

      csv += 'EXECUTIVE FINANCIAL SUMMARY\r\n';
      csv += `Total Trajectory Revenue (${currency.code}),"${currency.symbol} ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}"\r\n`;
      csv += `Total Operating Expenses (${currency.code}),"${currency.symbol} ${totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}"\r\n`;
      csv += `Net Operating Profit (${currency.code}),"${currency.symbol} ${totalProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}"\r\n`;
      csv += `Average Profit Margin,"% ${avgMargin}"\r\n`;
      csv += '\r\n';

      if (includeTrajectory) {
        csv += 'SECTION 1: MONTHLY FINANCIAL TRAJECTORY\r\n';
        csv += 'Month,Gross Revenue,Operating Expenses,Net Operating Profit,Profit Margin (%)\r\n';
        monthlyData.forEach((row) => {
          const rev = convertAmount(row.rev);
          const exp = convertAmount(row.exp);
          const profit = convertAmount(row.profit);
          const margin = rev > 0 ? ((profit / rev) * 100).toFixed(1) : '0';
          csv += `"${row.month}",${rev.toFixed(2)},${exp.toFixed(2)},${profit.toFixed(2)},"${margin}%"\r\n`;
        });
        csv += '\r\n';
      }

      if (includeBranches) {
        csv += 'SECTION 2: MULTI-BRANCH PERFORMANCE BREAKDOWN\r\n';
        csv += 'Branch / Channel Name,Revenue Contribution,Share of Total,Performance Status\r\n';
        branchPerformance.forEach((branch) => {
          const val = convertAmount(branch.value);
          csv += `"${branch.name}",${val.toFixed(2)},"${branch.share}","${branch.status}"\r\n`;
        });
        csv += '\r\n';
      }

      if (includeAfricanRegions) {
        csv += 'SECTION 3: PAN-AFRICAN REGIONAL EXPANSION METRICS\r\n';
        csv += 'Commercial Bloc,Hub Cities,Countries,Revenue (Active Curr),YoY Growth (%),Profit Margin (%),Active Merchants,Tx Velocity/min,Status\r\n';
        REGIONAL_METRICS.forEach((reg) => {
          const revCurr = convertAmount(reg.revenueNGN);
          csv += `"${reg.name} (${reg.bloc})","${reg.hubCity}","${reg.country}",${revCurr.toFixed(2)},"${reg.growthRate}%","${reg.profitMargin}%",${reg.merchantCount},"${reg.txVelocityPerMin} tx/min","${reg.status}"\r\n`;
        });
        csv += '\r\n';
      }

      csv += '--- END OF MSMEBOOKS REPORT ---\r\n';

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `MsmeBooks-BI-Report-${currentCurrency}-${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setDownloadSuccess('CSV spreadsheet downloaded successfully!');
      setTimeout(() => setDownloadSuccess(null), 4000);
    } catch (err) {
      console.error('Failed to export CSV:', err);
    } finally {
      setIsExporting(null);
    }
  };

  // Generate and download PDF using jsPDF
  const handleExportPDF = () => {
    setIsExporting('pdf');
    setDownloadSuccess(null);

    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      let y = 18;

      // Header Banner
      doc.setFillColor(8, 102, 255); // #0866FF
      doc.rect(0, 0, pageWidth, 28, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.text('MsmeBooks Business Intelligence Report', 15, 12);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(
        `Generated: ${new Date().toLocaleDateString()} | Currency: ${currency.code} (${currency.symbol}) | Period: ${reportPeriod}`,
        15,
        20
      );

      y = 36;

      // Executive Summary Box
      doc.setFillColor(248, 250, 253);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(15, y, pageWidth - 30, 28, 3, 3, 'FD');

      doc.setTextColor(100, 116, 139);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.text('EXECUTIVE PERFORMANCE SUMMARY', 20, y + 6);

      const colW = (pageWidth - 40) / 4;
      const kpis = [
        { label: 'Total Revenue', val: `${currency.symbol} ${totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}` },
        { label: 'Operating Costs', val: `${currency.symbol} ${totalExpenses.toLocaleString(undefined, { maximumFractionDigits: 0 })}` },
        { label: 'Net Profit', val: `${currency.symbol} ${totalProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })}` },
        { label: 'Avg Margin', val: `${avgMargin}%` },
      ];

      kpis.forEach((kpi, idx) => {
        const xPos = 20 + idx * colW;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        doc.text(kpi.label, xPos, y + 14);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(15, 23, 42);
        doc.text(kpi.val, xPos, y + 21);
      });

      y += 36;

      // Section 1: Monthly Financial Trajectory
      if (includeTrajectory) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(8, 102, 255);
        doc.text('1. 6-Month Historical Trajectory & Profit Margins', 15, y);
        y += 5;

        // Table Header
        doc.setFillColor(241, 245, 249);
        doc.rect(15, y, pageWidth - 30, 7, 'F');
        doc.setFontSize(8);
        doc.setTextColor(51, 65, 85);
        doc.text('Month', 18, y + 4.5);
        doc.text(`Gross Revenue (${currency.code})`, 48, y + 4.5);
        doc.text(`Operating Expenses (${currency.code})`, 95, y + 4.5);
        doc.text(`Net Operating Profit (${currency.code})`, 140, y + 4.5);
        doc.text('Margin', 182, y + 4.5);
        y += 7;

        // Table Rows
        doc.setFont('helvetica', 'normal');
        monthlyData.forEach((row, i) => {
          if (i % 2 === 1) {
            doc.setFillColor(248, 250, 252);
            doc.rect(15, y, pageWidth - 30, 6.5, 'F');
          }
          const rev = convertAmount(row.rev);
          const exp = convertAmount(row.exp);
          const profit = convertAmount(row.profit);
          const margin = rev > 0 ? ((profit / rev) * 100).toFixed(1) : '0';

          doc.setTextColor(15, 23, 42);
          doc.text(row.month, 18, y + 4.5);
          doc.text(rev.toLocaleString(undefined, { maximumFractionDigits: 0 }), 48, y + 4.5);
          doc.text(exp.toLocaleString(undefined, { maximumFractionDigits: 0 }), 95, y + 4.5);
          doc.text(profit.toLocaleString(undefined, { maximumFractionDigits: 0 }), 140, y + 4.5);
          doc.setTextColor(5, 150, 105);
          doc.text(`${margin}%`, 182, y + 4.5);
          y += 6.5;
        });

        y += 6;
      }

      // Section 2: Multi-Branch Performance
      if (includeBranches) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(8, 102, 255);
        doc.text('2. Multi-Branch & Channel Performance Breakdown', 15, y);
        y += 5;

        // Table Header
        doc.setFillColor(241, 245, 249);
        doc.rect(15, y, pageWidth - 30, 7, 'F');
        doc.setFontSize(8);
        doc.setTextColor(51, 65, 85);
        doc.text('Branch / Commercial Location', 18, y + 4.5);
        doc.text('Share of Total', 85, y + 4.5);
        doc.text(`Contribution Value (${currency.code})`, 120, y + 4.5);
        doc.text('Status', 165, y + 4.5);
        y += 7;

        doc.setFont('helvetica', 'normal');
        branchPerformance.forEach((branch, i) => {
          if (i % 2 === 1) {
            doc.setFillColor(248, 250, 252);
            doc.rect(15, y, pageWidth - 30, 6.5, 'F');
          }
          const val = convertAmount(branch.value);
          doc.setTextColor(15, 23, 42);
          doc.text(branch.name, 18, y + 4.5);
          doc.text(branch.share, 85, y + 4.5);
          doc.text(`${currency.symbol} ${val.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, 120, y + 4.5);
          doc.setTextColor(8, 102, 255);
          doc.text(branch.status, 165, y + 4.5);
          y += 6.5;
        });

        y += 6;
      }

      // Section 3: Pan-African Expansion
      if (includeAfricanRegions) {
        // If not enough space, add new page
        if (y > 210) {
          doc.addPage();
          y = 20;
        }

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(8, 102, 255);
        doc.text('3. Pan-African Regional Commercial Expansion', 15, y);
        y += 5;

        // Table Header
        doc.setFillColor(241, 245, 249);
        doc.rect(15, y, pageWidth - 30, 7, 'F');
        doc.setFontSize(8);
        doc.setTextColor(51, 65, 85);
        doc.text('Regional Corridor', 18, y + 4.5);
        doc.text('Hub', 70, y + 4.5);
        doc.text('YoY Growth', 105, y + 4.5);
        doc.text('Net Margin', 135, y + 4.5);
        doc.text('Active Merch.', 165, y + 4.5);
        y += 7;

        doc.setFont('helvetica', 'normal');
        REGIONAL_METRICS.forEach((reg, i) => {
          if (i % 2 === 1) {
            doc.setFillColor(248, 250, 252);
            doc.rect(15, y, pageWidth - 30, 6.5, 'F');
          }
          doc.setTextColor(15, 23, 42);
          doc.text(reg.name.substring(0, 24), 18, y + 4.5);
          doc.text(reg.hubCity.substring(0, 18), 70, y + 4.5);
          doc.setTextColor(5, 150, 105);
          doc.text(`+${reg.growthRate}%`, 105, y + 4.5);
          doc.setTextColor(15, 23, 42);
          doc.text(`${reg.profitMargin}%`, 135, y + 4.5);
          doc.text(reg.merchantCount.toLocaleString(), 165, y + 4.5);
          y += 6.5;
        });

        y += 8;
      }

      // Footer
      const totalPages = doc.internal.pages.length - 1;
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(148, 163, 184);
        doc.text(
          `MsmeBooks All-in-One Cloud Financial OS - Confidential Executive Document | Page ${i} of ${totalPages}`,
          15,
          doc.internal.pageSize.getHeight() - 8
        );
      }

      doc.save(`MsmeBooks-BI-Executive-Report-${currentCurrency}-${new Date().toISOString().slice(0, 10)}.pdf`);
      setDownloadSuccess('Executive PDF report generated and downloaded!');
      setTimeout(() => setDownloadSuccess(null), 4000);
    } catch (err) {
      console.error('Failed to export PDF:', err);
    } finally {
      setIsExporting(null);
    }
  };

  // Browser Print View
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-[#0E172A] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="px-6 py-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-xs">
              <Download className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight font-display">Export Business Intelligence Report</h3>
              <p className="text-xs text-blue-100">
                Generate offline executive reports in PDF or CSV formats in {currency.code} ({currency.symbol})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Success Notification */}
          {downloadSuccess && (
            <div className="flex items-center gap-3 p-3.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 rounded-2xl text-emerald-800 dark:text-emerald-200 text-xs font-semibold animate-in slide-in-from-top-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{downloadSuccess}</span>
            </div>
          )}

          {/* Report Configuration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Report Period
              </label>
              <div className="relative">
                <select
                  value={reportPeriod}
                  onChange={(e) => setReportPeriod(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#151F32] text-xs font-bold text-slate-800 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                >
                  <option value="H1 2026 Executive Review">H1 2026 Executive Review</option>
                  <option value="Q2 2026 Performance">Q2 2026 Performance Review</option>
                  <option value="Full Year 2025 Retrospective">Full Year 2025 Retrospective</option>
                  <option value="Trailing 12-Month Audit">Trailing 12-Month Audit</option>
                </select>
                <Calendar className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Active Currency Benchmark
              </label>
              <div className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#151F32] flex items-center justify-between text-xs font-bold text-slate-800 dark:text-white">
                <span>{currency.name}</span>
                <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-mono text-[11px]">
                  {currency.code} ({currency.symbol})
                </span>
              </div>
            </div>
          </div>

          {/* Section Selection Toggles */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2.5">
              Included Analytics Modules
            </label>
            <div className="space-y-2.5">
              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#151F32]/50 hover:bg-slate-100/70 dark:hover:bg-[#151F32] cursor-pointer transition-colors">
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-white block">
                      Monthly Financial Trajectory &amp; Margins
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Revenue, operational expenses, net profit, and margin % trends
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={includeTrajectory}
                  onChange={(e) => setIncludeTrajectory(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#151F32]/50 hover:bg-slate-100/70 dark:hover:bg-[#151F32] cursor-pointer transition-colors">
                <div className="flex items-center gap-3">
                  <Building className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-white block">
                      Multi-Branch Revenue &amp; Channel Share
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Store rankings, e-commerce channel performance, and volume shares
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={includeBranches}
                  onChange={(e) => setIncludeBranches(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#151F32]/50 hover:bg-slate-100/70 dark:hover:bg-[#151F32] cursor-pointer transition-colors">
                <div className="flex items-center gap-3">
                  <Globe2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-white block">
                      Pan-African Regional Trade &amp; Growth Corridors
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Commercial blocs, merchant count, transaction velocities, and YoY growth
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={includeAfricanRegions}
                  onChange={(e) => setIncludeAfricanRegions(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
              </label>
            </div>
          </div>

          {/* Quick Preview Snapshot */}
          <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider">
                Executive Snapshot Preview
              </span>
              <span className="text-[10px] text-blue-600 dark:text-blue-400 font-mono">
                {currency.code} Mode
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2 bg-white dark:bg-[#151F32] rounded-xl border border-blue-100 dark:border-blue-900/40">
                <span className="text-[10px] text-slate-400 block">Total Revenue</span>
                <span className="font-bold text-slate-900 dark:text-white font-mono">
                  {currency.format(totalRevenue / currency.rate)}
                </span>
              </div>
              <div className="p-2 bg-white dark:bg-[#151F32] rounded-xl border border-blue-100 dark:border-blue-900/40">
                <span className="text-[10px] text-slate-400 block">Operating Costs</span>
                <span className="font-bold text-slate-900 dark:text-white font-mono">
                  {currency.format(totalExpenses / currency.rate)}
                </span>
              </div>
              <div className="p-2 bg-white dark:bg-[#151F32] rounded-xl border border-blue-100 dark:border-blue-900/40">
                <span className="text-[10px] text-slate-400 block">Net Profit</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                  {currency.format(totalProfit / currency.rate)}
                </span>
              </div>
              <div className="p-2 bg-white dark:bg-[#151F32] rounded-xl border border-blue-100 dark:border-blue-900/40">
                <span className="text-[10px] text-slate-400 block">Net Margin</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                  {avgMargin}%
                </span>
              </div>
            </div>
          </div>

          {/* Export Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            {/* CSV Option */}
            <button
              onClick={handleExportCSV}
              disabled={isExporting !== null}
              className="p-3.5 rounded-2xl bg-white dark:bg-[#151F32] hover:bg-slate-50 dark:hover:bg-[#1c2942] border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition-all shadow-xs group"
            >
              {isExporting === 'csv' ? (
                <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
              ) : (
                <FileSpreadsheet className="w-5 h-5 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
              )}
              <span className="font-display">Export CSV (.csv)</span>
              <span className="text-[10px] text-slate-400 font-normal">Excel / Sheets ready</span>
            </button>

            {/* PDF Option */}
            <button
              onClick={handleExportPDF}
              disabled={isExporting !== null}
              className="p-3.5 rounded-2xl bg-[#0866FF] hover:bg-blue-600 text-white font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition-all shadow-md shadow-blue-500/25 group"
            >
              {isExporting === 'pdf' ? (
                <Loader2 className="w-5 h-5 animate-spin text-white" />
              ) : (
                <FileText className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
              )}
              <span className="font-display">Export PDF (.pdf)</span>
              <span className="text-[10px] text-blue-100 font-normal">Standard Executive Dossier</span>
            </button>

            {/* Print / Save to PDF */}
            <button
              onClick={handlePrint}
              disabled={isExporting !== null}
              className="p-3.5 rounded-2xl bg-white dark:bg-[#151F32] hover:bg-slate-50 dark:hover:bg-[#1c2942] border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition-all shadow-xs group"
            >
              <Printer className="w-5 h-5 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform" />
              <span className="font-display">Print / High-Res</span>
              <span className="text-[10px] text-slate-400 font-normal">Browser print dialog</span>
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-[#0B1120] border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            <span>Encrypted client-side generation. No data leaves your browser.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 font-bold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
