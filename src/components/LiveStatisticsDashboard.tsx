// ============================================================
// Live Statistics Dashboard - لوحة الإحصائيات الحية
// ============================================================

import { useEffect, useState } from 'react';
import { liveStatistics } from '../services';
import { FaCheckCircle, FaClock, FaSmile, FaUsers, FaLayerGroup } from 'react-icons/fa';
import type { StatItem } from '../services/LiveStatisticsService';

// أيقونات مخصصة
const iconMap: Record<string, React.ElementType> = {
  CheckCircle: FaCheckCircle,
  Clock: FaClock,
  Smile: FaSmile,
  Users: FaUsers,
  Layers: FaLayerGroup,
};

export default function LiveStatisticsDashboard() {
  const [stats, setStats] = useState<StatItem[]>([]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // الاشتراك في التحديثات
    const unsubscribe = liveStatistics.subscribe((newStats) => {
      setStats(newStats);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (!isVisible || stats.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
      {/* العنوان */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <h2 className="text-xl font-bold text-gray-900">إحصائيات مباشرة</h2>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          ✕
        </button>
      </div>

      {/* شبكة الإحصائيات */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((stat) => {
          const IconComponent = iconMap[stat.icon || ''] || FaCheckCircle;
          const progressPercentage = (stat.value / stat.target) * 100;

          return (
            <div
              key={stat.id}
              className="relative bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-100 hover:shadow-md transition-shadow"
            >
              {/* الأيقونة */}
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                style={{ backgroundColor: `${stat.color}15` }}
              >
                <IconComponent
                  className="w-6 h-6"
                  style={{ color: stat.color }}
                />
              </div>

              {/* القيمة */}
              <div className="mb-1">
                <span
                  className="text-2xl font-bold"
                  style={{ color: stat.color }}
                >
                  {stat.value.toLocaleString('ar-YE')}
                </span>
                {stat.unit && <span className="text-sm text-gray-500 mr-1">{stat.unit}</span>}
              </div>

              {/* التسمية */}
              <div className="text-xs text-gray-600 mb-2">{stat.label}</div>

              {/* شريط التقدم */}
              <div className="relative h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="absolute inset-y-0 right-0 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(progressPercentage, 100)}%`,
                    backgroundColor: stat.color,
                  }}
                />
              </div>

              {/* النسبة */}
              <div className="text-xs text-gray-400 mt-1">
                {Math.round(progressPercentage)}% من الهدف
              </div>

              {/* مؤشر التحديث */}
              {Date.now() - stat.lastUpdated < 5000 && (
                <div className="absolute top-2 left-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* تذييل */}
      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
          <span>تحديث تلقائي كل 30 ثانية</span>
        </div>
        <div>آخر تحديث: {new Date().toLocaleTimeString('ar-YE')}</div>
      </div>
    </div>
  );
}
