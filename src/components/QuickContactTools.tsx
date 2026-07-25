// ============================================================
// QuickContactTools.tsx - أدوات التواصل السريعة المؤسسية (Government Digital Experience Level)
// مكتب الأشغال العامة والطرق - محافظة ذمار
// ============================================================

import { memo, useState } from 'react';
import {
  Phone,
  Mail,
  MessageCircle,
  Send,
  MapPin,
  Clock,
  ExternalLink,
  AlertCircle,
  X,
} from 'lucide-react';

interface QuickContactToolsProps {
  theme?: 'light' | 'dark';
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
  showAfterScroll?: boolean;
}

const CONTACT_INFO = {
  phone: '777-888-198',
  email: 'dpw.dhamar@yemen.gov.ye',
  address: 'مدينة ذمار - شارع الجامعة',
  workingHours: '8:00 صباحاً - 2:00 مساءً',
  workingDays: 'السبت - الأربعاء',
  emergencyPhone: '777-888-199',
};

const QuickContactTools = memo(function QuickContactTools({
  theme = 'light',
  position = 'bottom-left',
}: QuickContactToolsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const positionClasses = {
    'bottom-left': 'bottom-6 left-6',
    'bottom-right': 'bottom-6 right-6',
    'top-left': 'top-20 left-6',
    'top-right': 'top-20 right-6',
  };

  const bgClass = theme === 'dark' ? 'bg-gray-800/95' : 'bg-white/95';

  const contactMethods = [
    {
      id: 'phone',
      icon: Phone,
      label: 'اتصال سريع',
      value: CONTACT_INFO.phone,
      href: `tel:${CONTACT_INFO.phone}`,
      color: 'from-green-500 to-emerald-600',
      description: 'اتصل بنا مباشرة',
    },
    {
      id: 'whatsapp',
      icon: MessageCircle,
      label: 'واتساب',
      value: '777-888-198',
      href: 'https://wa.me/967777888198',
      color: 'from-emerald-500 to-green-600',
      description: 'راسلنا على واتساب',
    },
    {
      id: 'telegram',
      icon: Send,
      label: 'تيليجرام',
      value: '@DhamarPWO',
      href: 'https://t.me/DhamarPWO',
      color: 'from-blue-500 to-blue-600',
      description: 'انضم لقناة التواصل',
    },
    {
      id: 'email',
      icon: Mail,
      label: 'بريد إلكتروني',
      value: CONTACT_INFO.email,
      href: `mailto:${CONTACT_INFO.email}`,
      color: 'from-purple-500 to-purple-600',
      description: 'أرسل لنا بريداً',
    },
    {
      id: 'emergency',
      icon: AlertCircle,
      label: 'طوارئ',
      value: CONTACT_INFO.emergencyPhone,
      href: `tel:${CONTACT_INFO.emergencyPhone}`,
      color: 'from-red-500 to-rose-600',
      description: 'للحالات الطارئة',
    },
  ];

  return (
    <div
      className={`fixed ${positionClasses[position]} z-50`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* زر التواصل الرئيسي */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-14 h-14 bg-gradient-to-br from-gov-600 to-gov-800 hover:from-gov-700 hover:to-gov-900 text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
        aria-label="أدوات التواصل السريع"
      >
        <Phone
          size={24}
          className={isOpen ? 'rotate-12' : ''}
        />
        {showTooltip && !isOpen && (
          <div className="absolute -top-12 right-0 bg-gov-900 text-white px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">
            تواصل سريع
          </div>
        )}
      </button>

      {/* قائمة التواصل المنسدلة */}
      <div
        className={`absolute ${
          position.includes('bottom') ? 'bottom-20' : 'top-20'
        } mb-2 transition-all duration-300 ${isOpen ? 'opacity-100 visible scale-100' : 'opacity-0 invisible scale-95'}`}
      >
        <div
          className={`${bgClass} backdrop-blur-xl rounded-2xl border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} shadow-2xl p-3 min-w-[280px]`}
        >
          <div
            className={`flex items-center justify-between mb-3 pb-2 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-100'}`}
          >
            <h4 className="text-sm font-bold text-gray-800">تواصل سريع</h4>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X
                size={16}
                className="text-gray-500"
              />
            </button>
          </div>

          <div className="space-y-2">
            {contactMethods.map((method) => {
              const Icon = method.icon;
              return (
                <a
                  key={method.id}
                  href={method.href}
                  target={method.id !== 'phone' && method.id !== 'emergency' ? '_blank' : undefined}
                  rel={
                    method.id !== 'phone' && method.id !== 'emergency'
                      ? 'noopener noreferrer'
                      : undefined
                  }
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all group"
                >
                  <div
                    className={`w-10 h-10 bg-gradient-to-br ${method.color} rounded-xl flex items-center justify-center`}
                  >
                    <Icon
                      size={18}
                      className="text-white"
                    />
                  </div>
                  <div className="flex-1 text-right">
                    <div className="text-xs font-bold text-gray-700">{method.label}</div>
                    <div className="text-[10px] text-gray-500">{method.description}</div>
                    <div className="text-sm font-mono text-gov-600">{method.value}</div>
                  </div>
                  <ExternalLink
                    size={14}
                    className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </a>
              );
            })}
          </div>

          {/* معلومات إضافية */}
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
              <MapPin
                size={12}
                className="text-gov-600"
              />
              {CONTACT_INFO.address}
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Clock
                size={12}
                className="text-gov-600"
              />
              {CONTACT_INFO.workingDays} | {CONTACT_INFO.workingHours}
            </div>
          </div>

          {/* زر الخطوط الساخنة الطوارئ */}
          <div className="mt-3 pt-3 border-t border-gray-100">
            <a
              href={`tel:${CONTACT_INFO.emergencyPhone}`}
              className="flex items-center justify-center gap-2 w-full py-2 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl text-xs font-bold hover:from-red-600 hover:to-rose-700 transition-all"
            >
              <AlertCircle size={14} />
              الخط الساخن للطوارئ
            </a>
          </div>
        </div>
      </div>
    </div>
  );
});

QuickContactTools.displayName = 'QuickContactTools';
export default QuickContactTools;
