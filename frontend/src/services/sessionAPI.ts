import axios from 'axios';
import { KeystrokeEvent, PasteEvent } from './keystrokeTracker';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token to requests
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const sessionAPI = {
  /**
   * Create a new writing session
   */
  createSession: () =>
    axiosInstance.post('/sessions', {}),

  /**
   * Get a specific session
   */
  getSession: (sessionId: string) =>
    axiosInstance.get(`/sessions/${sessionId}`),

  /**
   * Get all sessions for current user
   */
  getUserSessions: () =>
    axiosInstance.get('/sessions'),

  /**
   * Update session with keystroke and paste events
   */
  updateSession: (
    sessionId: string,
    data: {
      content?: string;
      keystrokeEvents?: KeystrokeEvent[];
      pasteEvents?: PasteEvent[];
      contentLength?: number;
    }
  ) =>
    axiosInstance.patch(`/sessions/${sessionId}`, data),

  /**
   * Record a keystroke event
   */
  recordKeystroke: (sessionId: string, keystrokeEvent: KeystrokeEvent) =>
    axiosInstance.post(`/sessions/${sessionId}/keystroke`, keystrokeEvent),

  /**
   * Record a paste event
   */
  recordPaste: (sessionId: string, pasteEvent: PasteEvent) =>
    axiosInstance.post(`/sessions/${sessionId}/paste`, pasteEvent),

  /**
   * Complete a writing session
   */
  completeSession: (
    sessionId: string,
    data: {
      content: string;
      contentLength: number;
      keystrokeEvents?: KeystrokeEvent[];
      pasteEvents?: PasteEvent[];
    }
  ) =>
    axiosInstance.post(`/sessions/${sessionId}/complete`, data),
};

export default sessionAPI;
