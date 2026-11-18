import React, { useState } from 'react';
import { 
  Building, 
  Users, 
  Award, 
  Download, 
  UserPlus, 
  CheckCircle2, 
  Clock, 
  Calculator, 
  Briefcase,
  Layers,
  ArrowRight
} from 'lucide-react';
import { CORPORATE_SAMPLE_DEPARTMENTS } from '../data/mockData';
import { SupportedCurrency, formatCurrency } from '../data/currencies';

interface CorporatePortalProps {
  onExploreCourses: () => void;
  currentCurrency?: SupportedCurrency;
}

export const CorporatePortal: React.FC<CorporatePortalProps> = ({
  onExploreCourses,
  currentCurrency = 'NGN'
}) => {
  const [departments, setDepartments] = useState(CORPORATE_SAMPLE_DEPARTMENTS);
  const [seatCount, setSeatCount] = useState(25);
  const [selectedPlan, setSelectedPlan] = useState<'Enterprise Annual' | 'Departmental'>('Enterprise Annual');
  const [newEmployeeName, setNewEmployeeName] = useState('');
  const [newEmployeeEmail, setNewEmployeeEmail] = useState('');
  const [newEmployeeDept, setNewEmployeeDept] = useState('Finance & Accounting Operations');

  // Seat pricing calculation: ₦28,000 per seat with volume discount > 20 seats (20% off)
  const basePricePerSeat = 28000;
  const discountRate = seatCount >= 20 ? 0.20 : 0.10;
  const discountedPricePerSeat = Math.round(basePricePerSeat * (1 - discountRate));
  const totalCost = seatCount * discountedPricePerSeat;

  const handleInviteEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmployeeName || !newEmployeeEmail) return;

    setDepartments((prev) =>
      prev.map((d) =>
        d.name === newEmployeeDept
          ? {
              ...d,
              seatsAssigned: d.seatsAssigned + 1,
              employees: [
                ...d.employees,
                {
                  id: `emp-${Date.now()}`,
                  name: newEmployeeName,
                  email: newEmployeeEmail,
                  course: 'MsmeBooks Enterprise Onboarding',
                  progress: 0,
                  status: 'Not Started',
                  lastActive: 'Just invited'
                }
              ]
            }
          : d
      )
    );

    setNewEmployeeName('');
    setNewEmployeeEmail('');
    alert(`Invitation sent to ${newEmployeeEmail}! They will receive single-sign-on training credentials.`);
  };

  return (
    <div className="py-12 bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Corporate Header */}
        <div className="bg-slate-900 dark:bg-slate-950 text-white p-8 rounded-2xl border border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs text-[#84CC16] font-bold uppercase tracking-wider">
              <Building className="w-4 h-4" />
              <span>Enterprise &amp; Multi-Branch Training Console</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Prime Global Retail &amp; Logistics Ltd
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Upskill accounts clerks, retail cashiers, and warehouse supervisors across all 14 nationwide locations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 text-center min-w-28">
              <span className="text-xs text-slate-400 block">Total Team Seats</span>
              <span className="text-xl font-extrabold text-white tabular-nums">33 / 40</span>
            </div>

            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 text-center min-w-28">
              <span className="text-xs text-slate-400 block">Avg Completion</span>
              <span className="text-xl font-extrabold text-[#84CC16] tabular-nums">82.3%</span>
            </div>
          </div>
        </div>

        {/* Interactive Volume Seat Calculator */}
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#0B4F9C] dark:text-blue-400">
                Corporate Licensing
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                Calculate Team Seats &amp; Bulk Academy Pricing
              </h2>
            </div>
            <span className="text-xs font-semibold text-[#72B01D] bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded">
              {discountRate * 100}% Volume Discount Applied
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7 space-y-5 text-xs">
              <div>
                <div className="flex justify-between font-bold text-slate-700 dark:text-slate-200 mb-2">
                  <span>Number of Team Seats Needed:</span>
                  <span className="text-[#0B4F9C] dark:text-blue-400 text-base tabular-nums font-black">{seatCount} Seats</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  step="5"
                  value={seatCount}
                  onChange={(e) => setSeatCount(Number(e.target.value))}
                  className="w-full accent-[#0B4F9C] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>5 Seats (Small Practice)</span>
                  <span>50 Seats (Mid-Size SME)</span>
                  <span>100+ Seats (Enterprise)</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500 dark:text-slate-400 block">Standard Rate</span>
                  <span className="font-mono text-slate-400 line-through">{formatCurrency(basePricePerSeat, currentCurrency)}</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white block mt-0.5 tabular-nums">
                    {formatCurrency(discountedPricePerSeat, currentCurrency)} / seat
                  </span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500 dark:text-slate-400 block">Inclusions</span>
                  <span className="font-bold text-slate-900 dark:text-white block mt-0.5">
                    All 16 Course Tracks + Sandbox
                  </span>
                </div>
              </div>
            </div>

            <div className="md:col-span-5 bg-blue-50/70 dark:bg-blue-950/40 p-6 rounded-xl border border-blue-200 dark:border-blue-900 text-center space-y-4">
              <div>
                <span className="text-xs text-slate-500 dark:text-slate-400">Annual Corporate Investment</span>
                <div className="text-3xl font-black text-[#0B4F9C] dark:text-blue-400 mt-1 tabular-nums">
                  {formatCurrency(totalCost, currentCurrency)}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Includes unlimited QR certifications &amp; custom branch reports</p>
              </div>

              <button
                onClick={() => alert(`Corporate invoice for ${seatCount} seats (${formatCurrency(totalCost, currentCurrency)}) generated. Our enterprise onboarding manager will contact you.`)}
                className="w-full py-3 text-xs font-bold text-white bg-[#0B4F9C] hover:bg-[#073B75] rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                Request Corporate Proposal &amp; Invoice
              </button>
            </div>
          </div>
        </div>

        {/* Department Trackers & Invite Member */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Departments Progress */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">Active Departmental Tracks</h3>
              <button
                onClick={() => alert('Exporting full organization training compliance spreadsheet (CSV)...')}
                className="text-xs font-semibold text-[#0B4F9C] dark:text-blue-400 flex items-center gap-1.5 hover:underline cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Audit Report</span>
              </button>
            </div>

            <div className="space-y-4">
              {departments.map((dept) => (
                <div
                  key={dept.name}
                  className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{dept.name}</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
                        {dept.seatsAssigned} / {dept.seatsTotal} Seats Assigned · {dept.completionRate}% Average Progress
                      </p>
                    </div>
                    <span className="text-xs font-bold text-[#72B01D] bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                      {dept.completionRate}% Done
                    </span>
                  </div>

                  {/* Employees Table */}
                  <div className="border border-slate-100 dark:border-slate-800 rounded-lg divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                    {dept.employees.map((emp) => (
                      <div key={emp.id} className="p-3 flex items-center justify-between">
                        <div>
                          <p className="font-bold text-slate-800 dark:text-slate-200">{emp.name}</p>
                          <p className="text-[11px] text-slate-400">{emp.course}</p>
                        </div>
                        <div className="text-right">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            emp.status === 'Completed' ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200' : 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                          }`}>
                            {emp.status} ({emp.progress}%)
                          </span>
                          <p className="text-[10px] text-slate-400 mt-0.5">Active {emp.lastActive}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Invite Form */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 text-xs">
            <div className="flex items-center gap-2 text-[#0B4F9C] dark:text-blue-400 font-bold">
              <UserPlus className="w-4 h-4 text-[#72B01D]" />
              <span>Enroll / Invite Employee</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400">
              Instantly assign a staff member to an academy learning path under your corporate plan.
            </p>

            <form onSubmit={handleInviteEmployee} className="space-y-3 pt-2">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-200 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Samuel Adekunle"
                  value={newEmployeeName}
                  onChange={(e) => setNewEmployeeName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-200 block mb-1">Company Work Email</label>
                <input
                  type="email"
                  required
                  placeholder="s.adekunle@primelogistics.ng"
                  value={newEmployeeEmail}
                  onChange={(e) => setNewEmployeeEmail(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-200 block mb-1">Department</label>
                <select
                  value={newEmployeeDept}
                  onChange={(e) => setNewEmployeeDept(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white rounded-lg text-xs"
                >
                  {departments.map((d) => (
                    <option key={d.name} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 text-xs font-bold text-white bg-[#0B4F9C] hover:bg-[#073B75] rounded-lg transition-colors cursor-pointer mt-2 shadow-xs"
              >
                Send Academy Invitation
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
};
