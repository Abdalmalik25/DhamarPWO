// ============================================================
// DhamarMap Pro v5.0 - خريطة تفاعلية احترافية لمحافظة ذمار
// ============================================================

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  MapPin,
  Maximize,
  Minimize,
  Loader2,
  ZoomIn,
  ZoomOut,
  Layers,
  Phone,
  Clock,
  Search,
  X,
  Compass,
  Target,
  Moon,
  Satellite,
  Map,
  Mountain,
  ExternalLink,
  Crosshair,
} from 'lucide-react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  GeoJSON,
  Circle,
  Tooltip,
  useMapEvents,
} from 'react-leaflet';
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
// بيانات محافظة ذمار
// ============================================================

const OFFICE_COORDS: [number, number] = [14.54293, 44.40458];
const DHAMAR_CENTER: [number, number] = [14.55, 44.4];
const DHAMAR_BOUNDS: [[number, number], [number, number]] = [
  [14.2, 44.0],
  [15.0, 44.9],
];

// الفروع والمرافق
const BRANCHES = [
  {
    id: 'main',
    name: 'المقر الرئيسي',
    coords: [14.54293, 44.40458] as [number, number],
    type: 'main',
    phone: '064-25186',
    address: 'شارع الجامعة - أمام ديوان المحافظة',
    hours: '8ص - 2م | سبت - أربعاء',
  },
  {
    id: 'jard',
    name: 'فرع جردان',
    coords: [14.5167, 44.2833] as [number, number],
    type: 'branch',
    phone: '064-25187',
    address: 'مديرية جردان',
    hours: '8ص - 2م',
  },
  {
    id: 'annat',
    name: 'فرع عنة',
    coords: [14.4833, 44.35] as [number, number],
    type: 'branch',
    phone: '064-25188',
    address: 'مديرية عنة',
    hours: '8ص - 2م',
  },
  {
    id: 'radaa',
    name: 'فرع رادع',
    coords: [14.55, 44.45] as [number, number],
    type: 'branch',
    phone: '064-25189',
    address: 'مديرية رادع',
    hours: '8ص - 2م',
  },
  {
    id: 'dawran',
    name: 'فرع ضوران',
    coords: [14.5667, 44.4167] as [number, number],
    type: 'branch',
    phone: '064-25190',
    address: 'مديرية ضوران',
    hours: '8ص - 2م',
  },
  {
    id: 'migraf',
    name: 'فرع ميفعة',
    coords: [14.5, 44.5] as [number, number],
    type: 'branch',
    phone: '064-25191',
    address: 'مديرية ميفعة',
    hours: '8ص - 2م',
  },
  {
    id: 'alhada',
    name: 'فرع الحدأ',
    coords: [14.6, 44.35] as [number, number],
    type: 'branch',
    phone: '064-25192',
    address: 'مديرية الحدأ',
    hours: '8ص - 2م',
  },
  {
    id: 'wusab',
    name: 'فرع وصاب',
    coords: [14.45, 44.3] as [number, number],
    type: 'branch',
    phone: '064-25193',
    address: 'مديرية وصاب',
    hours: '8ص - 2م',
  },
];

// المعالم الرئيسية
const LANDMARKS = [
  {
    id: 'gov',
    name: 'ديوان المحافظة',
    coords: [14.5435, 44.405] as [number, number],
    type: 'government',
    icon: '🏛️',
  },
  {
    id: 'uni',
    name: 'جامعة ذمار',
    coords: [14.55, 44.41] as [number, number],
    type: 'education',
    icon: '🎓',
  },
  {
    id: 'hosp',
    name: 'مستشفى ذمار',
    coords: [14.54, 44.4] as [number, number],
    type: 'health',
    icon: '🏥',
  },
  {
    id: 'park',
    name: 'حديقة ذمار',
    coords: [14.545, 44.408] as [number, number],
    type: 'park',
    icon: '🌳',
  },
  {
    id: 'market',
    name: 'السوق المركزي',
    coords: [14.544, 44.403] as [number, number],
    type: 'market',
    icon: '🛒',
  },
  {
    id: 'stadium',
    name: 'ملعب ذمار',
    coords: [14.538, 44.41] as [number, number],
    type: 'sports',
    icon: '⚽',
  },
  {
    id: 'museum',
    name: 'متحف ذمار',
    coords: [14.546, 44.406] as [number, number],
    type: 'culture',
    icon: '🏛️',
  },
  {
    id: 'bus',
    name: 'محطة الحافلات',
    coords: [14.541, 44.402] as [number, number],
    type: 'transport',
    icon: '🚌',
  },
];

// حدود المحافظة
const DHAMAR_BOUNDARY: [number, number][] = [
  [14.7, 44.25],
  [14.65, 44.55],
  [14.55, 44.7],
  [14.4, 44.65],
  [14.35, 44.5],
  [14.38, 44.3],
  [14.5, 44.2],
  [14.7, 44.25],
];

// المناطق الجغرافية
const GEOGRAPHIC_ZONES = [
  {
    name: 'مركز المحافظة',
    center: [14.54293, 44.40458] as [number, number],
    radius: 3000,
    color: '#d4af37',
    description: 'منطقة الخدمات الرئيسية',
  },
  {
    name: 'المنطقة الغربية',
    center: [14.4833, 44.35] as [number, number],
    radius: 2500,
    color: '#3b82f6',
    description: 'فروع عنة وجردان',
  },
  {
    name: 'المنطقة الشرقية',
    center: [14.55, 44.45] as [number, number],
    radius: 2500,
    color: '#10b981',
    description: 'رادع وميفعة',
  },
  {
    name: 'المنطقة الشمالية',
    center: [14.6, 44.4] as [number, number],
    radius: 2000,
    color: '#f59e0b',
    description: 'ضوران والحدأ',
  },
  {
    name: 'المنطقة الجنوبية',
    center: [14.45, 44.3] as [number, number],
    radius: 2000,
    color: '#8b5cf6',
    description: 'وصاب ومغرب عنس',
  },
];

// أنماط الخريطة
const MAP_TILES: Record<string, { url: string; label: string; icon: React.ElementType }> = {
  standard: {
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    label: 'قياسية',
    icon: Map,
  },
  dark: {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    label: 'ليلية',
    icon: Moon,
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    label: 'فضائية',
    icon: Satellite,
  },
  topo: {
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    label: 'تضاريس',
    icon: Mountain,
  },
};

// ============================================================
// مكونات مساعدة
// ============================================================

function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { animate: true, duration: 0.8 });
  }, [map, center, zoom]);
  return null;
}

function ScaleControl() {
  const map = useMap();
  useEffect(() => {
    L.control
      .scale({ position: 'bottomright', metric: true, imperial: false, maxWidth: 200 })
      .addTo(map);
  }, [map]);
  return null;
}

function MapEvents({
  onMoveEnd,
  onClick,
}: {
  onMoveEnd?: (center: [number, number], zoom: number) => void;
  onClick?: (latlng: [number, number]) => void;
}) {
  useMapEvents({
    moveend: () => {
      if (onMoveEnd) {
        const map = (window as any).__leafletMap;
        if (map) {
          const center = map.getCenter();
          onMoveEnd([center.lat, center.lng], map.getZoom());
        }
      }
    },
    click: (e) => {
      if (onClick) onClick([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

// ============================================================
// أيقونات مخصصة
// ============================================================

const createCustomIcon = (color: string, emoji: string, size: number = 40) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      display: flex; align-items: center; justify-content: center;
      width: ${size}px; height: ${size}px;
      border-radius: 50%;
      background: ${color};
      font-size: ${size * 0.45}px;
      box-shadow: 0 4px 15px ${color}66, 0 0 0 3px white;
      border: 2px solid rgba(255,255,255,0.8);
      cursor: pointer;
      transition: all 0.3s ease;
    ">${emoji}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
};

const icons = {
  main: createCustomIcon('linear-gradient(135deg, #d4af37, #b8962e)', '🏛️', 52),
  branch: createCustomIcon('linear-gradient(135deg, #1a56db, #1e40af)', '🏢', 40),
  government: createCustomIcon('linear-gradient(135deg, #6366f1, #4f46e5)', '🏛️', 36),
  education: createCustomIcon('linear-gradient(135deg, #8b5cf6, #7c3aed)', '🎓', 36),
  health: createCustomIcon('linear-gradient(135deg, #ef4444, #dc2626)', '🏥', 36),
  park: createCustomIcon('linear-gradient(135deg, #10b981, #059669)', '🌳', 36),
  market: createCustomIcon('linear-gradient(135deg, #f59e0b, #d97706)', '🛒', 36),
  sports: createCustomIcon('linear-gradient(135deg, #06b6d4, #0891b2)', '⚽', 36),
  culture: createCustomIcon('linear-gradient(135deg, #ec4899, #db2777)', '🏛️', 36),
  transport: createCustomIcon('linear-gradient(135deg, #6b7280, #4b5563)', '🚌', 36),
};

// ============================================================
// المكون الرئيسي
// ============================================================

export default function DhamarMap({
  className = '',
  height = 'h-80',
  compact = false,
}: {
  className?: string;
  height?: string;
  compact?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [mapZoom, setMapZoom] = useState(13);
  const [mapCenter, setMapCenter] = useState<[number, number]>(DHAMAR_CENTER);
  const [mapStyle, setMapStyle] = useState<keyof typeof MAP_TILES>('standard');
  const [showZones, setShowZones] = useState(true);
  const [showLandmarks, setShowLandmarks] = useState(true);
  const [showBranches, setShowBranches] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<
    Array<{ name: string; coords: [number, number]; type: string; icon: string; category: string }>
  >([]);
  const [showSearch, setShowSearch] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [showLegend, setShowLegend] = useState(false);
  const [activeTab, setActiveTab] = useState<'places' | 'layers' | 'info'>('places');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const baseMapHeight = compact ? 'h-64 sm:h-72' : height;
  const mapHeight = expanded ? 'h-[calc(100vh-6rem)]' : baseMapHeight;

  // ============================================================
  // دوال التحكم
  // ============================================================

  const handleZoomIn = () => setMapZoom((p) => Math.min(p + 1, 18));
  const handleZoomOut = () => setMapZoom((p) => Math.max(p - 1, 8));

  const handleLocateOffice = () => {
    setMapCenter(OFFICE_COORDS);
    setMapZoom(17);
  };

  const handleLocateUser = useCallback(() => {
    if (!navigator.geolocation) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setUserLocation(loc);
        setMapCenter(loc);
        setMapZoom(15);
        setIsLocating(false);
      },
      () => {
        setIsLocating(false);
        alert('تعذر الحصول على موقعك. تأكد من تفعيل خدمة الموقع.');
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }, []);

  const handleFitBounds = () => {
    setMapCenter(DHAMAR_CENTER);
    setMapZoom(11);
  };

  const handleMapMoveEnd = useCallback((center: [number, number], zoom: number) => {
    setMapCenter(center);
    setMapZoom(zoom);
  }, []);

  // ============================================================
  // البحث
  // ============================================================

  const allPlaces = useMemo(() => {
    const places: Array<{
      name: string;
      coords: [number, number];
      type: string;
      icon: string;
      category: string;
    }> = [
      ...BRANCHES.map((b) => ({
        name: b.name,
        coords: b.coords,
        type: b.type,
        icon: b.type === 'main' ? '🏛️' : '🏢',
        category: 'فروع' as const,
      })),
      ...LANDMARKS.map((l) => ({
        name: l.name,
        coords: l.coords,
        type: l.type,
        icon: l.icon,
        category: 'معالم' as const,
      })),
    ];
    return places;
  }, []);

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }
      const q = query;
      const results = allPlaces
        .filter((p) => p.name.includes(q) || p.category.includes(q))
        .slice(0, 8);
      setSearchResults(results);
    },
    [allPlaces],
  );

  const handleSelectPlace = (coords: [number, number]) => {
    setMapCenter(coords);
    setMapZoom(16);
    setSearchQuery('');
    setSearchResults([]);
    setShowSearch(false);
  };

  // ============================================================
  // مراقبة الرؤية
  // ============================================================

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

  // ============================================================
  // GeoJSON
  // ============================================================

  const boundaryGeoJSON = useMemo(
    () => ({
      type: 'Feature' as const,
      properties: { name: 'محافظة ذمار' },
      geometry: {
        type: 'Polygon' as const,
        coordinates: [DHAMAR_BOUNDARY.map((coord) => [coord[1], coord[0]])],
      },
    }),
    [],
  );

  const boundaryStyle = {
    color: '#d4af37',
    weight: 3,
    opacity: 0.8,
    fillColor: '#d4af37',
    fillOpacity: 0.05,
    dashArray: '10, 5',
  };

  // ============================================================
  // التصيير
  // ============================================================

  return (
    <section
      ref={containerRef}
      className={`bg-white rounded-3xl border border-gray-200 overflow-hidden transition-all duration-500 shadow-lg hover:shadow-2xl ${
        expanded ? 'fixed inset-4 z-50 shadow-2xl' : ''
      } ${className}`}
      aria-label="خريطة محافظة ذمار التفاعلية"
    >
      {/* ===== الهيدر المتقدم ===== */}
      <div
        className={`flex items-center justify-between ${compact ? 'p-2' : 'p-3'} bg-gradient-to-l from-gov-50 to-white border-b border-gray-200`}
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-gold-500 to-gold-600 rounded-xl flex items-center justify-center shadow-md">
            <MapPin
              size={compact ? 14 : 16}
              className="text-white"
            />
          </div>
          <div>
            <h3 className={`font-bold text-gov-800 ${compact ? 'text-xs' : 'text-sm'}`}>
              خريطة محافظة ذمار
            </h3>
            {!compact && (
              <p className="text-[10px] text-gray-500">
                خريطة تفاعلية - اسحب للتنقل، استخدم العجلة للتكبير
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          {/* زر البحث */}
          <button
            onClick={() => {
              setShowSearch(!showSearch);
              setTimeout(() => searchInputRef.current?.focus(), 100);
            }}
            className={`p-1.5 rounded-lg transition-all ${showSearch ? 'bg-gold-100 text-gold-700' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
            title="بحث"
          >
            <Search size={14} />
          </button>
          {/* زر الطبقات */}
          <button
            onClick={() => setShowLegend(!showLegend)}
            className={`p-1.5 rounded-lg transition-all ${showLegend ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
            title="الطبقات"
          >
            <Layers size={14} />
          </button>
          {/* زر ملء الشاشة */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all text-gray-500"
            title={expanded ? 'تصغير' : 'تكبير'}
          >
            {expanded ? <Minimize size={14} /> : <Maximize size={14} />}
          </button>
        </div>
      </div>

      {/* ===== شريط البحث ===== */}
      {showSearch && (
        <div className="relative border-b border-gray-200 bg-white">
          <div className="flex items-center gap-2 p-2">
            <Search
              size={16}
              className="text-gray-400 mr-2"
            />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="ابحث عن فرع، معلم، أو منطقة..."
              className="flex-1 bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-400"
              dir="rtl"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSearchResults([]);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>
          {/* نتائج البحث */}
          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-b-2xl shadow-xl z-[1001] max-h-60 overflow-y-auto">
              {searchResults.map((result, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectPlace(result.coords)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-right border-b border-gray-100 last:border-0"
                >
                  <span className="text-xl">{result.icon}</span>
                  <div>
                    <div className="text-sm font-semibold text-gray-800">{result.name}</div>
                    <div className="text-xs text-gray-500">{result.category}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ===== لوحة الطبقات ===== */}
      {showLegend && (
        <div className="border-b border-gray-200 bg-gray-50 p-3">
          <div className="flex items-center gap-2 mb-2">
            {(['places', 'layers', 'info'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === tab
                    ? 'bg-white text-gov-700 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab === 'places' ? 'الأماكن' : tab === 'layers' ? 'الطبقات' : 'معلومات'}
              </button>
            ))}
          </div>

          {activeTab === 'places' && (
            <div className="grid grid-cols-2 gap-1.5">
              <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showBranches}
                  onChange={() => setShowBranches(!showBranches)}
                  className="rounded"
                />
                <span>🏢 الفروع</span>
              </label>
              <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showLandmarks}
                  onChange={() => setShowLandmarks(!showLandmarks)}
                  className="rounded"
                />
                <span>🏛️ المعالم</span>
              </label>
              <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showZones}
                  onChange={() => setShowZones(!showZones)}
                  className="rounded"
                />
                <span>🔵 المناطق</span>
              </label>
            </div>
          )}

          {activeTab === 'layers' && (
            <div className="grid grid-cols-2 gap-1.5">
              {(
                Object.entries(MAP_TILES) as [
                  keyof typeof MAP_TILES,
                  (typeof MAP_TILES)[keyof typeof MAP_TILES],
                ][]
              ).map(([key, tile]) => {
                const Icon = tile.icon;
                const isActive = mapStyle === key;
                return (
                  <button
                    key={key}
                    onClick={() => setMapStyle(key)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-white text-gov-700 shadow-sm border border-gov-200'
                        : 'text-gray-500 hover:text-gray-700 border border-transparent'
                    }`}
                  >
                    <Icon size={14} />
                    {tile.label}
                  </button>
                );
              })}
            </div>
          )}

          {activeTab === 'info' && (
            <div className="text-xs text-gray-600 space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gold-500" />
                <span>المقر الرئيسي</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-600" />
                <span>فروع المديريات</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span>المعالم</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <span>حدود المحافظة</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===== الخريطة ===== */}
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
              maxBounds={DHAMAR_BOUNDS}
              maxBoundsViscosity={1.0}
              style={{ filter: 'contrast(1.02) saturate(1.1)' }}
            >
              <ChangeView
                center={mapCenter}
                zoom={mapZoom}
              />
              <ScaleControl />
              <MapEvents onMoveEnd={handleMapMoveEnd} />

              {/* طبقة الخريطة */}
              <TileLayer
                key={mapStyle}
                url={MAP_TILES[mapStyle].url}
                maxNativeZoom={19}
                maxZoom={20}
              />

              {/* حدود المحافظة */}
              <GeoJSON
                data={boundaryGeoJSON}
                style={boundaryStyle}
              >
                <Tooltip sticky>
                  <div className="text-right font-bold text-gov-800">محافظة ذمار</div>
                </Tooltip>
              </GeoJSON>

              {/* المناطق الجغرافية */}
              {showZones &&
                GEOGRAPHIC_ZONES.map((zone, idx) => (
                  <Circle
                    key={idx}
                    center={zone.center}
                    radius={zone.radius}
                    pathOptions={{
                      color: zone.color,
                      fillColor: zone.color,
                      fillOpacity: 0.08,
                      weight: 2,
                      opacity: 0.4,
                    }}
                  >
                    <Tooltip sticky>
                      <div className="text-right">
                        <div className="font-bold text-gov-800">{zone.name}</div>
                        <div className="text-xs text-gray-600">{zone.description}</div>
                      </div>
                    </Tooltip>
                  </Circle>
                ))}

              {/* الفروع */}
              {showBranches &&
                BRANCHES.map((branch) => (
                  <Marker
                    key={branch.id}
                    position={branch.coords}
                    icon={branch.type === 'main' ? icons.main : icons.branch}
                  >
                    <Popup>
                      <div
                        className="text-right p-2"
                        style={{ direction: 'rtl', minWidth: '220px' }}
                      >
                        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-200">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-lg ${
                              branch.type === 'main'
                                ? 'bg-gradient-to-br from-gold-500 to-gold-600'
                                : 'bg-gradient-to-br from-blue-600 to-blue-700'
                            }`}
                          >
                            {branch.type === 'main' ? '🏛️' : '🏢'}
                          </div>
                          <div>
                            <h4 className="font-bold text-gov-900 text-sm">{branch.name}</h4>
                            <p className="text-[10px] text-gray-500">
                              {branch.type === 'main' ? 'مكتب الأشغال العامة والطرق' : 'فرع مديرية'}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-1.5 text-xs mb-2">
                          <div className="flex items-start gap-2">
                            <MapPin
                              size={12}
                              className="text-gov-600 mt-0.5 flex-shrink-0"
                            />
                            <span className="text-gray-700">{branch.address}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone
                              size={12}
                              className="text-gov-600 flex-shrink-0"
                            />
                            <a
                              href={`tel:+967${branch.phone.replace(/-/g, '')}`}
                              className="text-gov-600 font-semibold hover:underline"
                            >
                              {branch.phone}
                            </a>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock
                              size={12}
                              className="text-gov-600 flex-shrink-0"
                            />
                            <span className="text-gray-600">{branch.hours}</span>
                          </div>
                        </div>
                        <div className="flex gap-1.5">
                          <a
                            href={`https://maps.google.com/?q=${branch.coords[0]},${branch.coords[1]}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-semibold px-2 py-1.5 rounded-lg transition-colors text-center"
                          >
                            <ExternalLink
                              size={10}
                              className="inline ml-1"
                            />{' '}
                            خرائط جوجل
                          </a>
                          <a
                            href={`tel:+967${branch.phone.replace(/-/g, '')}`}
                            className="flex-1 bg-gov-600 hover:bg-gov-700 text-white text-[10px] font-semibold px-2 py-1.5 rounded-lg transition-colors text-center"
                          >
                            <Phone
                              size={10}
                              className="inline ml-1"
                            />{' '}
                            اتصال
                          </a>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}

              {/* المعالم */}
              {showLandmarks &&
                LANDMARKS.map((landmark) => {
                  const iconKey = landmark.type as keyof typeof icons;
                  const icon = icons[iconKey] || icons.government;
                  return (
                    <Marker
                      key={landmark.id}
                      position={landmark.coords}
                      icon={icon}
                    >
                      <Popup>
                        <div
                          className="text-right p-1"
                          style={{ direction: 'rtl' }}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{landmark.icon}</span>
                            <div>
                              <h4 className="font-bold text-gov-800 text-sm">{landmark.name}</h4>
                              <p className="text-[10px] text-gray-500">
                                📍 {landmark.coords[0].toFixed(4)}, {landmark.coords[1].toFixed(4)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}

              {/* موقع المستخدم */}
              {userLocation && (
                <Circle
                  center={userLocation}
                  radius={50}
                  pathOptions={{
                    color: '#3b82f6',
                    fillColor: '#3b82f6',
                    fillOpacity: 0.3,
                    weight: 3,
                  }}
                >
                  <Tooltip>موقعك الحالي</Tooltip>
                </Circle>
              )}
            </MapContainer>

            {/* ===== أزرار التحكم المتقدمة ===== */}
            <div className="absolute top-3 left-3 z-[1000] flex flex-col gap-1.5">
              <ControlButton
                onClick={() =>
                  setMapStyle((prev) => {
                    const keys = Object.keys(MAP_TILES) as (keyof typeof MAP_TILES)[];
                    const idx = keys.indexOf(prev);
                    return keys[(idx + 1) % keys.length];
                  })
                }
                icon={Layers}
                label="تغيير الخريطة"
                className="bg-white"
              />
              <ControlButton
                onClick={handleZoomIn}
                icon={ZoomIn}
                label="تكبير"
              />
              <ControlButton
                onClick={handleZoomOut}
                icon={ZoomOut}
                label="تصغير"
              />
            </div>

            <div className="absolute bottom-3 left-3 z-[1000] flex flex-col gap-1.5">
              <ControlButton
                onClick={handleLocateOffice}
                icon={Target}
                label="المقر الرئيسي"
                className="bg-gold-500 text-white hover:bg-gold-600 border-gold-400"
              />
              <ControlButton
                onClick={handleLocateUser}
                icon={isLocating ? Loader2 : Crosshair}
                label="موقعي"
                className={`bg-blue-600 text-white hover:bg-blue-700 border-blue-500 ${isLocating ? 'animate-spin' : ''}`}
              />
              <ControlButton
                onClick={handleFitBounds}
                icon={Compass}
                label="عرض المحافظة"
                className="bg-emerald-600 text-white hover:bg-emerald-700 border-emerald-500"
              />
            </div>

            {/* ===== معلومات الخريطة ===== */}
            <div className="absolute top-3 right-3 z-[1000] bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-sm px-3 py-2 rounded-xl shadow-lg border border-slate-700/50 text-right">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <div className="font-semibold text-white text-xs">مكبر {mapZoom}x</div>
              </div>
              <div className="text-slate-300 text-[10px] mt-0.5">{MAP_TILES[mapStyle].label}</div>
              <div className="text-slate-400 text-[9px] mt-0.5">
                {mapCenter[0].toFixed(4)}, {mapCenter[1].toFixed(4)}
              </div>
            </div>

            {/* ===== شريط المعلومات السفلي ===== */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/90 to-transparent p-3 z-[1000] pointer-events-none">
              <div className="flex items-center justify-between text-right">
                <div>
                  <p className="text-white text-xs font-bold flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                    مكتب الأشغال العامة والطرق - محافظة ذمار
                  </p>
                  <p className="text-slate-300 text-[10px] mt-0.5">
                    🏛️ {BRANCHES.length} فرع | 📍 {LANDMARKS.length} معلم | 🗺️{' '}
                    {GEOGRAPHIC_ZONES.length} منطقة
                  </p>
                </div>
                <div className="text-[10px] text-slate-400">WGS84</div>
              </div>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <Loader2
                size={32}
                className="animate-spin text-gold-500 mx-auto mb-2"
              />
              <p className="text-sm text-gray-500">جاري تحميل الخريطة...</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ============================================================
// مكون زر التحكم
// ============================================================

function ControlButton({
  onClick,
  icon: Icon,
  label,
  className = '',
  size = 16,
}: {
  onClick: () => void;
  icon: React.ElementType;
  label: string;
  className?: string;
  size?: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`z-[1000] bg-white hover:bg-slate-50 text-slate-700 p-2.5 rounded-2xl shadow-[0_10px_30px_rgba(15,23,42,0.08)] border border-slate-200 transition-all duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-400 ${className}`}
      aria-label={label}
      title={label}
    >
      <Icon size={size} />
    </button>
  );
}
