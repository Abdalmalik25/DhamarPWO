import { useState, useEffect, useMemo } from 'react';
import { HardHat, MapPin, Calendar, CheckCircle2 } from 'lucide-react';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import { useProjects } from '../../../hooks/useSanityContent';

// Fallback data when Sanity is not available
const FALLBACK_PROJECTS = [
  {
    _id: 'fallback-1',
    title: 'تطوير وتوسعة الشارع الرئيسي',
    description: 'مشروع رصف وتوسعة الشارع الرئيسي في وسط مدينة ذمار بطول 3 كيلومترات.',
    status: 'in-progress',
    progress: 75,
    budget: '450 مليون ريال يمني',
    startDate: '2025-03-01',
    expectedEndDate: '2027-02-15',
    contractor: 'شركة الإنشاءات الهندسية',
    supervisingEngineer: 'المهندس حايك البحري',
    isFeatured: true,
    location: { lat: 14.5425, lng: 44.3864 },
  },
  {
    _id: 'fallback-2',
    title: 'تأهيل شبكة تصريف السيول',
    description: 'مشروع لتأهيل وتوسعة شبكة تصريف السيول في القطاع الجنوبي.',
    status: 'in-progress',
    progress: 40,
    budget: '180 مليون ريال يمني',
    startDate: '2025-06-15',
    expectedEndDate: '2027-06-30',
    contractor: 'مؤسسة الطرق والجسور',
    supervisingEngineer: 'المهندس مازن العلي',
    isFeatured: true,
    location: { lat: 14.52, lng: 44.39 },
  },
  {
    _id: 'fallback-3',
    title: 'رصف وتشجير الأحياء السكنية',
    description: 'مشروع رصف الطرق الفرعية وتشجير وتزيين الأحياء السكنية في حي الجمارك.',
    status: 'completed',
    progress: 100,
    budget: '75 مليون ريال يمني',
    startDate: '2024-01-10',
    actualEndDate: '2026-12-01',
    contractor: 'مقاولات العمارة الحديثة',
    supervisingEngineer: 'المهندس علي السعيدي',
    isFeatured: false,
    location: { lat: 14.55, lng: 44.37 },
  },
];

function getStatusLabel(status: string) {
  const labels: Record<string, string> = {
    'planning': 'في التخطيط',
    'in-progress': 'جاري التنفيذ',
    'completed': 'مكتمل',
    'delayed': 'متأخر',
  };
  return labels[status] || status;
}

export default function ProjectProgressTracker({ theme = 'light' }: { theme?: 'light' | 'dark' }) {
  const { projects, loading, error } = useProjects();
  const displayProjects = useMemo(() => {
    if (loading || error || !projects || projects.length === 0) {
      return FALLBACK_PROJECTS;
    }
    return projects;
  }, [projects, loading, error]);

  const [activeProject, setActiveProject] = useState(displayProjects[0]);
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    if (displayProjects.length > 0 && !activeProject) {
      setActiveProject(displayProjects[0]);
    }
  }, [displayProjects, activeProject]);

  useEffect(() => {
    if (activeProject) {
      setAnimatedProgress(0);
      const timer = setTimeout(() => {
        setAnimatedProgress(activeProject.progress || 0);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [activeProject]);

  const bgClass = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const textClass = theme === 'dark' ? 'text-white' : 'text-gray-900';

  if (!activeProject) return null;

  return (
    <section
      className={`py-16 ${bgClass} border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-100'}`}
      aria-label="مشاريع البنية التحتية الجارية"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-bold mb-4">
              <HardHat size={16} /> تتبع حي للمشاريع
            </span>
            <h2 className={`text-3xl font-black ${textClass} mb-4`}>
              مشاريع البنية التحتية الجارية
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              نعمل على مدار الساعة لتحسين المشهد الحضري وتطوير البنية التحتية. تابع تقدم العمل في
              أهم المشاريع الاستراتيجية بشفافية.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* القائمة الجانبية */}
            <div className="lg:w-1/3 flex flex-col gap-3">
              {displayProjects.map((project) => (
                <button
                  key={project._id}
                  onClick={() => setActiveProject(project)}
                  className={`text-right p-5 rounded-2xl border-l-4 transition-all duration-300 ${
                    activeProject._id === project._id
                      ? 'border-gold-500 bg-gold-50 shadow-md'
                      : 'border-transparent bg-gray-50 hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  <h4
                    className={`font-bold text-sm mb-1 ${activeProject._id === project._id ? 'text-gold-700' : 'text-gray-800'}`}
                  >
                    {project.title}
                  </h4>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <MapPin size={12} /> {project.location?.lat ? `خط ${project.location.lat}, ع ${project.location.lng}` : project.description}
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle2
                        size={12}
                        className={project.progress > 80 ? 'text-green-500' : 'text-gray-400'}
                      />{' '}
                      {project.progress}%
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* تفاصيل المشروع النشط */}
            <div className="lg:w-2/3">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[400px] group">
                <img
                  src={`https://source.unsplash.com/random/800x600?construction,${activeProject._id}`}
                  alt={activeProject.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-black text-white">{activeProject.title}</h3>
                    <span className="bg-gold-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      {getStatusLabel(activeProject.status)}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-6 text-sm text-gray-300 mb-6">
                    <span className="flex items-center gap-2">
                      <MapPin
                        size={16}
                        className="text-gold-400"
                      />{' '}
                      {activeProject.supervisingEngineer && `المهندس المشرف: ${activeProject.supervisingEngineer}`}
                    </span>
                    <span className="flex items-center gap-2">
                      <HardHat
                        size={16}
                        className="text-gold-400"
                      />{' '}
                      {activeProject.contractor}
                    </span>
                    <span className="flex items-center gap-2">
                      <Calendar
                        size={16}
                        className="text-gold-400"
                      />{' '}
                      المتوقع إنجازه: {activeProject.expectedEndDate || activeProject.actualEndDate}
                    </span>
                  </div>

                  {/* شريط التقدم */}
                  <div>
                    <div className="flex justify-between text-sm font-bold text-white mb-2">
                      <span>نسبة الإنجاز</span>
                      <span>{animatedProgress}%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-3 backdrop-blur-sm overflow-hidden relative">
                      <div
                        className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-gold-400 to-gold-300 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${animatedProgress}%` }}
                      >
                        <div className="absolute inset-0 bg-white/20 animate-pulse" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}