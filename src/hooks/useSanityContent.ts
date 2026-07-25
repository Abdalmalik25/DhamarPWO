import { useEffect, useState } from 'react';
import {
  getServices,
  getAnnouncements,
  getFAQs,
  getAwarenessContent,
  getStatistics,
  getQuickLinks,
} from '../lib/sanity';
import {
  FALLBACK_SERVICES,
  FALLBACK_ANNOUNCEMENTS,
  FALLBACK_FAQS,
  FALLBACK_STATS,
  FALLBACK_QUICK_LINKS,
  FALLBACK_AWARENESS,
} from '../pages/home/homeData';

// Hook لجلب الخدمات
export function useServices() {
  const [services, setServices] = useState(FALLBACK_SERVICES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchServices() {
      try {
        const data = await getServices();
        if (data && data.length > 0) {
          setServices(data);
        }
      } catch (err) {
        setError('فشل في جلب الخدمات من النظام');
        console.error('Error fetching services:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

  return { services, loading, error };
}

// Hook لجلب الإعلانات
export function useAnnouncements() {
  const [announcements, setAnnouncements] = useState(FALLBACK_ANNOUNCEMENTS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAnnouncements() {
      try {
        const data = await getAnnouncements();
        if (data && data.length > 0) {
          setAnnouncements(data);
        }
      } catch (err) {
        setError('فشل في جلب الإعلانات من النظام');
        console.error('Error fetching announcements:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchAnnouncements();
  }, []);

  return { announcements, loading, error };
}

// Hook لجلب الأسئلة الشائعة
export function useFAQs() {
  const [faqs, setFAQs] = useState(FALLBACK_FAQS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFAQs() {
      try {
        const data = await getFAQs();
        if (data && data.length > 0) {
          setFAQs(data);
        }
      } catch (err) {
        setError('فشل في جلب الأسئلة الشائعة من النظام');
        console.error('Error fetching FAQs:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchFAQs();
  }, []);

  return { faqs, loading, error };
}

// Hook لجلب المحتوى التوعوي
export function useAwarenessContent() {
  const [awareness, setAwareness] = useState(FALLBACK_AWARENESS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAwareness() {
      try {
        const data = await getAwarenessContent();
        if (data && data.length > 0) {
          setAwareness(data);
        }
      } catch (err) {
        setError('فشل في جلب المحتوى التوعوي من النظام');
        console.error('Error fetching awareness:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchAwareness();
  }, []);

  return { awareness, loading, error };
}

// Hook لجلب الإحصائيات
export function useStatistics() {
  const [stats, setStats] = useState(FALLBACK_STATS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await getStatistics();
        if (data && data.length > 0) {
          setStats(data);
        }
      } catch (err) {
        setError('فشل في جلب الإحصائيات من النظام');
        console.error('Error fetching statistics:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return { stats, loading, error };
}

// Hook لجلب الروابط السريعة
export function useQuickLinks() {
  const [quickLinks, setQuickLinks] = useState(FALLBACK_QUICK_LINKS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchQuickLinks() {
      try {
        const data = await getQuickLinks();
        if (data && data.length > 0) {
          setQuickLinks(data);
        }
      } catch (err) {
        setError('فشل في جلب الروابط السريعة من النظام');
        console.error('Error fetching quick links:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchQuickLinks();
  }, []);

  return { quickLinks, loading, error };
}

// Hook لجلب المشاريع
export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const { getProjects } = await import('../lib/sanity');
        const data = await getProjects();
        if (data && data.length > 0) {
          setProjects(data);
        }
      } catch (err) {
        setError('فشل في جلب المشاريع من النظام');
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  return { projects, loading, error };
}

// Hook لجلب أعضاء الكادر
export function useTeamMembers() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTeamMembers() {
      try {
        const { getTeamMembers } = await import('../lib/sanity');
        const data = await getTeamMembers();
        if (data && data.length > 0) {
          setTeamMembers(data);
        }
      } catch (err) {
        setError('فشل في جلب الكادر من النظام');
        console.error('Error fetching team members:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchTeamMembers();
  }, []);

  return { teamMembers, loading, error };
}

// Hook لجلب الوثائق الرسمية
export function useOfficialDocuments() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDocuments() {
      try {
        const { getOfficialDocuments } = await import('../lib/sanity');
        const data = await getOfficialDocuments();
        if (data && data.length > 0) {
          setDocuments(data);
        }
      } catch (err) {
        setError('فشل في جلب الوثائق من النظام');
        console.error('Error fetching documents:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDocuments();
  }, []);

  return { documents, loading, error };
}

// Hook لجلب البوم الصور
export function useGalleries() {
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGalleries() {
      try {
        const { getGalleries } = await import('../lib/sanity');
        const data = await getGalleries();
        if (data && data.length > 0) {
          setGalleries(data);
        }
      } catch (err) {
        setError('فشل في جلب البوم الصور من النظام');
        console.error('Error fetching galleries:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchGalleries();
  }, []);

  return { galleries, loading, error };
}

// Hook شامل لجلب كل المحتوى
export function useHomeContent() {
  const services = useServices();
  const announcements = useAnnouncements();
  const faqs = useFAQs();
  const awareness = useAwarenessContent();
  const stats = useStatistics();
  const quickLinks = useQuickLinks();

  const isLoading =
    services.loading ||
    announcements.loading ||
    faqs.loading ||
    awareness.loading ||
    stats.loading ||
    quickLinks.loading;

  return {
    services: services.services,
    announcements: announcements.announcements,
    faqs: faqs.faqs,
    awareness: awareness.awareness,
    stats: stats.stats,
    quickLinks: quickLinks.quickLinks,
    loading: isLoading,
  };
}
