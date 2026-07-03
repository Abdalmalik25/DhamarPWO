import { useState, useEffect, useRef } from 'react';
import { MapPin, Maximize, Minimize, Loader2, ZoomIn, ZoomOut, Navigation } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// ============================================================
// إعدادات Leaflet
// ============================================================

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// ============================================================
// الإحداثيات الدقيقة للمكتب
// مستندة إلى المصادر الرسمية:
// - إحداثيات مدينة ذمار: 14.54293, 44.40458
// - المصدر: بيانات جغرافية رسمية للمحافظة [citation:3][citation:4]
// ============================================================

const OFFICE_COORDS: [number, number] = [14.54293, 44.40458];

interface DhamarMapProps {
  className?: string;
  height?: string;
  compact?: boolean;
}

// ============================================================
// أيقونة المكتب المخصصة
// ============================================================

const officeIcon = L.divIcon({
  className: 'office-marker',
  html: `<div style="
    display: flex;
    align-items: center;
    justify-content: center;
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background: linear-gradient(135deg, #1a56db, #1e40af);
    color: white;
    font-size: 24px;
    box-shadow: 0 4px 20px rgba(26, 86, 219, 0.5), 0 2px 8px rgba(0,0,0,0.15);
    border: 4px solid white;
    cursor: pointer;
    transition: transform 0.2s;
  ">
    🏢
  </div>`,
  iconSize: [52, 52],
  iconAnchor: [26, 26],
  popupAnchor: [0, -30],
});

// ============================================================
// مكون تغيير العرض
// ============================================================

function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true, duration: 0.6 });
  }, [map, center, zoom]);
  return null;
}

// ============================================================
// زر التحكم
// ============================================================

function ControlButton({
  onClick,
  icon: Icon,
  label,
  position = 'bottom-left',
  offset = '',
  className = '',
  size = 18,
}: Readonly<{
  onClick: () => void;
  icon: React.ElementType;
  label: string;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  offset?: string;
  className?: string;
  size?: number;
}>) {
  const positions = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
  };

  return (
    <button
      onClick={onClick}
      className={`absolute ${positions[position]} ${offset} z-[1000] bg-white hover:bg-slate-50 text-slate-700 p-2.5 rounded-2xl shadow-[0_10px_30px_rgba(15,23,42,0.08)] border border-slate-200 transition-all duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-400 ${className}`}
      aria-label={label}
      title={label}
    >
      <Icon size={size} />
    </button>
  );
}

// ============================================================
// المكون الرئيسي
// ============================================================

export default function DhamarMap({
  className = '',
  height = 'h-80',
  compact = false,
}: Readonly<DhamarMapProps>) {
  const [expanded, setExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [mapZoom, setMapZoom] = useState(16);
  const [mapCenter, setMapCenter] = useState<[number, number]>(OFFICE_COORDS);
  const containerRef = useRef<HTMLDivElement>(null);
  const baseMapHeight = compact ? 'h-64 sm:h-72' : height;
  const mapHeight = expanded ? 'h-[calc(100vh-6rem)]' : baseMapHeight;
  const controlSize = compact ? 16 : 18;
  const displayMode = expanded ? 'مكبر' : compact ? 'مصغر' : 'عادي';
  const formattedCoords = mapCenter.map((value) => value.toFixed(5)).join(', ');

  // تحكمات الخريطة
  const handleZoomIn = () => setMapZoom((p) => Math.min(p + 1, 18));
  const handleZoomOut = () => setMapZoom((p) => Math.max(p - 1, 10));

  const handleLocateOffice = () => {
    setMapCenter(OFFICE_COORDS);
    setMapZoom(17);
  };

  // مراقبة الرؤية
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={containerRef}
      className={`bg-white rounded-3xl border border-gray-200 overflow-hidden transition-all duration-500 shadow-lg hover:shadow-2xl ${
        expanded ? 'fixed inset-4 z-50 shadow-2xl' : ''
      } ${className}`}
      aria-label="خريطة مكتب الأشغال العامة والطرق - محافظة ذمار"
    >
      {/* الهيدر */}
      <div
        className={`flex items-center justify-between ${compact ? 'p-3' : 'p-4'} bg-gradient-to-l from-gov-50 to-white border-b border-gray-200`}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gradient-to-br from-gov-600 to-gov-700 rounded-xl flex items-center justify-center shadow-md">
            <MapPin
              size={compact ? 14 : 16}
              className="text-white"
            />
          </div>
          <div>
            <h3 className={`font-bold text-gov-800 ${compact ? 'text-xs' : 'text-sm'}`}>
              موقع المكتب
            </h3>
            {!compact && (
              <p className="text-[10px] text-gray-500">محافظة ذمار - الجمهورية اليمنية</p>
            )}
          </div>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="p-2 hover:bg-white rounded-xl transition-all text-gray-500 hover:text-gov-600 shadow-sm hover:shadow-md"
          title={expanded ? 'تصغير' : 'تكبير'}
        >
          {expanded ? <Minimize size={18} /> : <Maximize size={18} />}
        </button>
      </div>

      {/* الخريطة */}
      <div className={`relative ${mapHeight} bg-gradient-to-br from-gray-50 to-gray-100`}>
        {isVisible ? (
          <>
            <MapContainer
              center={mapCenter}
              zoom={mapZoom}
              className="w-full h-full z-0"
              scrollWheelZoom={true}
              zoomControl={false}
              attributionControl={false}
              style={{ 
                filter: 'contrast(1.02) saturate(1.1)',
              }}
            >
              <ChangeView
                center={mapCenter}
                zoom={mapZoom}
              />

              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                errorTileUrl="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Crect fill='%23e2e8f0' width='256' height='256'/%3E%3C/svg%3E"
                maxNativeZoom={18}
              />

              <Marker
                position={OFFICE_COORDS}
                icon={officeIcon}
              >
                <Popup>
                  <div
                    className="text-right p-2"
                    style={{ direction: 'rtl', minWidth: '220px' }}
                  >
                    <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-200">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center text-white font-bold text-xs">
                        مكتب
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800 text-sm leading-tight">مكتب الأشغال والطرق</h4>
                        <p className="text-[10px] text-gray-500">محافظة ذمار</p>
                      </div>
                    </div>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex items-start gap-2">
                        <span className="text-gov-600 mt-0.5">📍</span>
                        <span className="text-gray-700">شارع الجامعة - أمام ديوان المحافظة</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gov-600">📞</span>
                        <a href="tel:+96706425186" className="text-gov-600 font-semibold hover:underline">064-25186</a>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gov-600">🕐</span>
                        <span className="text-gray-600">8ص - 2م | السبت - الأربعاء</span>
                      </div>
                    </div>
                    <a
                      href="https://maps.google.com/?q=14.542930,44.404580"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 pt-2 border-t border-gray-200 flex items-center justify-center gap-1.5 bg-gov-50 hover:bg-gov-100 text-gov-700 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <span>🔗</span>
                      <span>افتح في خرائط جوجل</span>
                    </a>
                  </div>
                </Popup>
              </Marker>
            </MapContainer>

            {/* أزرار التحكم */}
            <ControlButton
              onClick={handleZoomIn}
              icon={ZoomIn}
              label="تكبير الخريطة"
              position="top-left"
              offset={compact ? 'left-3' : 'left-4'}
              size={controlSize}
            />
            <ControlButton
              onClick={handleZoomOut}
              icon={ZoomOut}
              label="تصغير الخريطة"
              position="top-left"
              offset={compact ? 'top-14 left-3' : 'top-16 left-4'}
              size={controlSize}
            />
            <ControlButton
              onClick={handleLocateOffice}
              icon={Navigation}
              label="توجيه إلى المكتب"
              position="bottom-left"
              className="bg-blue-600 text-white hover:bg-blue-700 border-blue-500"
              size={controlSize}
            />

            <div className="absolute top-4 right-4 z-[1000] bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-sm px-3 py-2 rounded-xl shadow-lg border border-slate-700/50 text-right text-[11px] text-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <div className="font-semibold text-white text-xs">مكبر {mapZoom}x</div>
              </div>
              <div className="text-slate-300 text-[10px] mt-0.5">{displayMode}</div>
            </div>

            {!compact && (
              <div className="absolute bottom-20 right-4 bg-slate-950/95 backdrop-blur-sm p-3 rounded-2xl shadow-xl border border-slate-800 z-[1000] text-right">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                  <span className="text-xs font-medium text-slate-100">المقر الرئيسي</span>
                </div>
                <p className="text-[10px] text-slate-300 mt-1">
                  شارع الحسينية - أمام مكتب الجمارك
                </p>
              </div>
            )}

            {/* الشريط السفلي */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/90 to-transparent p-3 z-[1000] pointer-events-none">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white text-xs font-bold flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    مكتب الأشغال العامة والطرق
                  </p>
                  <p className="text-slate-300 text-[10px] mt-0.5">📌 {formattedCoords}</p>
                </div>
                <div className="text-[10px] text-slate-400">
                  WGS84
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <Loader2
              size={32}
              className="animate-spin text-blue-400"
            />
          </div>
        )}
      </div>
    </section>
  );
}
