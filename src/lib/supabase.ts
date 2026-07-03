import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
  global: {
    headers: {
      'x-application-name': 'pwo-dhamar-website',
    },
  },
});

export interface FormSubmission {
  id: string;
  tracking_number: string;
  reference_number: string;
  applicant_name: string;
  national_id: string;
  phone: string;
  email?: string;
  form_name: string;
  service_type: string;
  status: 'pending' | 'processing' | 'approved' | 'rejected' | 'completed';
  notes?: string;
  submitted_at: string;
  updated_at: string;
  created_at: string;
}

export interface SatisfactionSubmission {
  id: string;
  rating: number;
  service_type: string;
  name?: string;
  phone?: string;
  feedback?: string;
  submitted_at: string;
}

export type FormSubmissionStatus = FormSubmission['status'];

export async function trackSubmission(trackingNumber: string): Promise<FormSubmission | null> {
  try {
    const { data, error } = await supabase
      .from('form_submissions')
      .select('*')
      .eq('tracking_number', trackingNumber)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return data;
  } catch (err) {
    console.error('Error tracking submission:', err);
    return null;
  }
}

export async function submitSatisfaction(data: {
  rating: number;
  service_type: string;
  name?: string;
  phone?: string;
  feedback?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.from('satisfaction_submissions').insert([
      {
        rating: data.rating,
        service_type: data.service_type,
        name: data.name || null,
        phone: data.phone || null,
        feedback: data.feedback || null,
      },
    ]);

    if (error) throw error;

    return { success: true };
  } catch (err) {
    console.error('Error submitting satisfaction:', err);
    return { success: false, error: 'فشل في إرسال التقييم. يرجى المحاولة مرة أخرى.' };
  }
}
