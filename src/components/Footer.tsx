// ============================================================
// Footer.tsx - التذييل الرئيسي (النسخة الرسمية)
// ============================================================

import { memo } from 'react';
import { Building2, Phone, Mail, MapPin, Clock, ExternalLink, Shield, Globe, ArrowLeft } from 'lucide-react';
import type { Page } from '../types/page';

interface FooterProps {
  onNavigate: (page: Page) => void;
}

const Footer = memo(({ onNavigate }: FooterProps) => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { label: 'الرئيسية', page: 'home' as Page },
    { label: 'الخدمات الإلكترونية', page: 'services' as Page },
    { label: 'النماذج والاستمارات', page: 'forms' as Page },
    { label: 'الدليل الإرشادي', page: 'guidelines' as Page },
    { label: 'عن المكتب', page: 'about' as Page },
    { label: 'تواصل معنا', page: 'contact' as Page },
    { label: 'تتبع معاملة', page: 'track' as Page },
    { label: 'الوثائق والتقارير', page: 'documents' as Page },
  ];

  const legalLinks = [
    { label: 'قانون البناء رقم 19 لسنة 2002م', href: 'http://agoyemen.net/lib_details.php?id=42' },
    { label: 'قانون التخطيط الحضري رقم 20', href: 'http://agoyemen.net/lib_details.php?id=118' },
    { label: 'المركز الوطني للمعلومات', href: 'http://yemen-nic.info/' },
    { label: 'بوابة القوانين اليمنية', href: 'http://agoyemen.net/' },
  ];

  const contactInfo = [
    { icon: MapPin, text: 'مدينة ذمار - شارع الجامعة', href: undefined },
    { icon: Phone, text: '06-521222', href: 'tel:+96706521222' },
    { icon: Mail, text: 'dpw.dhamar@yemen.gov.ye', href: 'mailto:dpw.dhamar@yemen.gov.ye' },
    { icon: Clock, text: 'السبت - الأربعاء | 8:00 ص - 2:00 م', href: undefined },
  ];

  const engineers = [
    { name: 'أركان القوسي', phone: '777108410', role: 'مهندس رئيسي' },
    { name: 'نبيل السنحاني', phone: '772400993', role: 'مهندس إنشائي' },
    { name: 'محمد ناجي', phone: '773926837', role: 'مهندس تخطيط' },
  ];

  return (
    <footer
      className="relative bg-gradient-to-br from-[#0a1628] via-[#0f1f38] to-[#0a1628] text-white pt-16 lg:pt-20 pb-8 border-t border-gold-500/30 overflow-hidden"
      role="contentinfo"
      aria-label="تذييل الصفحة"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #d4af37 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div className="absolute inset-0 opacity-[0.05]" style={{ background: 'radial-gradient(circle at 50% 0%, rgba(212,175,55,0.15) 0%, transparent 50%)' }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-12">
          {/* الهوية المؤسسية */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="relative w-14 h-14 bg-gradient-to-br from-gold-500 to-gold-700 rounded-2xl flex items-center justify-center shadow-lg shadow-gold-500/30">
                <Building2 className="text-white" size={28} />
                <div className="absolute -inset-1 bg-gradient-to-br from-gold-400 to-gold-600 rounded-2xl opacity-30 blur-sm" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">مكتب الأشغال</h3>
                <p className="text-[10px] text-gold-400 font-bold">العامة والطرق - ذمار</p>
              </div>
            </div>
            <p className="text-white/60 text-xs leading-relaxed mb-4">
              الجهة الحكومية الرسمية المخولة بتنظيم قطاع التشييد والبناء، وإصدار التراخيص العمرانية، والإشراف على مشاريع الطرق والبنية التحتية في محافظة ذمار.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-white/50">
                <Globe size={12} className="text-gold-400" />
                <span className="text-[10px]">الجمهورية اليمنية</span>
              </div>
              <div className="flex items-center gap-2 text-white/50">
                <Shield size={12} className="text-gold-400" />
                <span className="text-[10px]">وزارة الأشغال العامة والطرق</span>
              </div>
            </div>
          </div>

          {/* روابط سريعة */}
          <div>
            <h4 className="text-xs font-black text-white mb-4 flex items-center gap-2">
              <span className="w-1.5 h-5 bg-gradient-to-b from-gold-400 to-gold-600 rounded-full" />
              روابط سريعة
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.map((item) => (
                <li key={item.page}>
                  <button onClick={() => onNavigate(item.page)} className="text-white/60 hover:text-gold-400 hover:translate-x-1 transition-all text-xs flex items-center gap-2 group w-full text-right">
                    <ArrowLeft size={12} className="group-hover:text-gold-400 transition-colors" />
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* مراجع قانونية */}
          <div>
            <h4 className="text-xs font-black text-white mb-4 flex items-center gap-2">
              <span className="w-1.5 h-5 bg-gradient-to-b from-gold-400 to-gold-600 rounded-full" />
              مراجع قانونية
            </h4>
            <ul className="space-y-2.5">
              {legalLinks.map((item) => (
                <li key={item.label}>
                  <a href={item.href} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-gold-400 transition-colors text-xs flex items-center gap-2 group">
                    <ExternalLink size={10} className="group-hover:scale-110 transition-transform text-gold-400/60 group-hover:text-gold-400" />
                    <span className="group-hover:translate-x-1 transition-transform inline-block">{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* تواصل معنا */}
          <div>
            <h4 className="text-xs font-black text-white mb-4 flex items-center gap-2">
              <span className="w-1.5 h-5 bg-gradient-to-b from-gold-400 to-gold-600 rounded-full" />
              تواصل معنا
            </h4>
            <div className="space-y-3">
              {contactInfo.map((item) => {
                const Icon = item.icon;
                const content = item.href ? (
                  <a href={item.href} className="text-white/60 hover:text-gold-400 transition-colors text-xs font-mono">{item.text}</a>
                ) : (
                  <span className="text-white/60 text-xs">{item.text}</span>
                );
                return (
                  <div key={item.text} className="flex items-start gap-3 group">
                    <div className="w-9 h-9 bg-gradient-to-br from-gold-500/20 to-gold-600/10 rounded-xl flex items-center justify-center shrink-0 border border-gold-500/20 group-hover:border-gold-500/40 group-hover:scale-110 transition-all">
                      <Icon size={14} className="text-gold-400" />
                    </div>
                    <div className="flex-1 pt-1.5">{content}</div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-4 border-t border-white/10">
              <h5 className="text-[10px] font-bold text-gold-400 mb-3">فريق الهندسة</h5>
              <div className="space-y-2">
                {engineers.map((engineer) => (
                  <a key={engineer.phone} href={`tel:+967${engineer.phone}`} className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 transition-colors group border border-transparent hover:border-gold-500/20">
                    <div className="w-9 h-9 bg-gradient-to-br from-gold-500 to-gold-700 rounded-xl flex items-center justify-center text-white text-xs font-bold group-hover:scale-110 transition-transform shadow-md">
                      {engineer.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-white/80 group-hover:text-gold-400 transition-colors">{engineer.name}</div>
                      <div className="text-[10px] text-white/40 font-mono" dir="ltr">{engineer.phone}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-white/40 text-xs text-center md:text-right">
              <p>© {currentYear} مكتب الأشغال العامة والطرق - محافظة ذمار. جميع الحقوق محفوظة.</p>
            </div>
            <div className="flex items-center gap-4">
              <a href="/privacy" onClick={(e) => { e.preventDefault(); onNavigate('privacy'); }} className="text-white/40 hover:text-gold-400 text-xs transition-colors">سياسة الخصوصية</a>
              <span className="text-white/20">|</span>
              <a href="/terms" onClick={(e) => { e.preventDefault(); onNavigate('terms'); }} className="text-white/40 hover:text-gold-400 text-xs transition-colors">شروط الاستخدام</a>
            </div>
          </div>
        </div>

        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent opacity-60" />
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';
export default Footer;