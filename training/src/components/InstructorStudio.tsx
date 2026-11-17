import React, { useState } from 'react';
import { 
  Plus, 
  BookOpen, 
  Users, 
  DollarSign, 
  BarChart3, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  Video, 
  Upload, 
  FileText,
  Star,
  Sparkles
} from 'lucide-react';
import { COURSES } from '../data/mockData';
import { Course } from '../types';

interface InstructorStudioProps {
  onCourseCreated?: (course: Course) => void;
}

export const InstructorStudio: React.FC<InstructorStudioProps> = ({
  onCourseCreated
}) => {
  const [courses, setCourses] = useState<Course[]>(COURSES);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Accounting & Financial Management');
  const [newPrice, setNewPrice] = useState('35000');
  const [newLevel, setNewLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const newCourse: Course = {
      id: `course-${Date.now()}`,
      slug: newTitle.toLowerCase().replace(/\s+/g, '-'),
      title: newTitle,
      tagline: 'Practical operational mastery created in Instructor Studio.',
      description: 'Comprehensive guided course created by an accredited MsmeBooks master instructor.',
      category: newCategory as any,
      level: newLevel,
      durationHours: 6,
      modulesCount: 3,
      lessonsCount: 12,
      language: 'English',
      priceNgn: Number(newPrice),
      isFree: Number(newPrice) === 0,
      rating: 5.0,
      ratingCount: 1,
      enrollmentCount: 0,
      certificateEligible: true,
      thumbnail: '/src/assets/images/hero_academy_training_1793446483834.jpg',
      instructor: {
        id: 'inst-me',
        name: 'Dr. Folashade Adeyemi, FCA',
        title: 'Master Instructor',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        bio: 'Accredited instructor',
        verified: true,
        totalStudents: 8400,
        rating: 4.95
      },
      learningObjectives: ['Complete practical workflows in MsmeBooks'],
      targetAudience: ['Accountants and SME operators'],
      prerequisites: ['Basic literacy'],
      modules: []
    };

    setCourses([newCourse, ...courses]);
    setShowCreateModal(false);
    setNewTitle('');
    if (onCourseCreated) {
      onCourseCreated(newCourse);
    }
    setFeedback(`Course "${newCourse.title}" successfully created and submitted for Academy accreditation!`);
    setTimeout(() => setFeedback(null), 5000);
  };

  return (
    <div className="py-12 bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Studio Header */}
        <div className="bg-[#073B75] text-white p-6 sm:p-8 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm border border-blue-900">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#84CC16] font-bold uppercase tracking-wider mb-1">
              <span>Instructor &amp; Faculty Studio</span>
              <span>·</span>
              <span>Verified Master Trainer</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Dr. Folashade Adeyemi, FCA
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              8,400 active learners · ₦4,850,000 royalty earnings this quarter
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-2.5 text-xs font-bold text-slate-950 bg-[#72B01D] hover:bg-[#5B8D17] rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-xs self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Course</span>
          </button>
        </div>

        {feedback && (
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{feedback}</span>
          </div>
        )}

        {/* 4 Instructor KPI Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors">
            <span className="text-xs text-slate-500 dark:text-slate-400 block">Total Active Learners</span>
            <div className="text-2xl font-extrabold text-[#0B4F9C] dark:text-blue-400 mt-1 tabular-nums">8,412</div>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 block">+18% this month</span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors">
            <span className="text-xs text-slate-500 dark:text-slate-400 block">Average Student Rating</span>
            <div className="text-2xl font-extrabold text-amber-500 mt-1 tabular-nums flex items-center gap-1">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
              <span>4.95</span>
            </div>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">From 1,240 verified reviews</span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors">
            <span className="text-xs text-slate-500 dark:text-slate-400 block">Accredited Courses</span>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 tabular-nums">{courses.length}</div>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">Live in Academy catalog</span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors">
            <span className="text-xs text-slate-500 dark:text-slate-400 block">Certifications Awarded</span>
            <div className="text-2xl font-extrabold text-[#72B01D] mt-1 tabular-nums">1,940</div>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">Verifiable QR credentials</span>
          </div>
        </div>

        {/* Course Management Table */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden transition-colors">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">My Published Courses</h2>
            <span className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">Showing {courses.length} courses</span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {courses.map((course) => (
              <div key={course.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                <div className="flex items-start sm:items-center gap-4">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-16 h-12 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                  />
                  <div>
                    <span className="text-[10px] font-bold text-[#0B4F9C] dark:text-blue-400 uppercase">{course.category}</span>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm mt-0.5 line-clamp-1">{course.title}</h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 tabular-nums">
                      {course.durationHours} hrs · {course.modulesCount} modules · {course.enrollmentCount.toLocaleString()} enrolled learners
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-center">
                  <div className="text-right">
                    <span className="font-extrabold text-[#0B4F9C] dark:text-blue-400 text-sm tabular-nums">
                      {course.isFree ? 'FREE' : `₦${course.priceNgn.toLocaleString()}`}
                    </span>
                    <span className="block text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Live in Catalog</span>
                  </div>

                  <button
                    onClick={() => {
                      setFeedback(`Syllabus and lesson editor opened for "${course.title}".`);
                      setTimeout(() => setFeedback(null), 3000);
                    }}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                  >
                    Manage Syllabus
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal: Create Course */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-200 dark:border-slate-800 animate-in fade-in transition-colors">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Create New Course Masterclass</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateCourse} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Course Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Advanced Branch Accounting & Inventory Matrix"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden focus:border-[#0B4F9C]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden focus:border-[#0B4F9C]"
                    >
                      <option value="Accounting & Financial Management">Accounting & Finance</option>
                      <option value="Point of Sale (POS) Operations">POS & Retail</option>
                      <option value="Inventory, Warehouse & Barcode Systems">Inventory & Logistics</option>
                      <option value="Hospitality & Hotel Property Management System (PMS)">Hotel & Hospitality</option>
                      <option value="Agriculture, Agribusiness & Farm Operations">Agribusiness</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Level</label>
                    <select
                      value={newLevel}
                      onChange={(e) => setNewLevel(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden focus:border-[#0B4F9C]"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Tuition Fee (NGN - Enter 0 for Free)</label>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden focus:border-[#0B4F9C]"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-400 font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#0B4F9C] hover:bg-[#073B75] text-white font-bold rounded-lg transition-colors cursor-pointer shadow-xs"
                  >
                    Publish to Academy
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
