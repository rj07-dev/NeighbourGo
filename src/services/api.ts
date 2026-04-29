import { SupportRequest, VolunteerOffer, AIAnalysisResult, Resource, CommunityNotice } from '../types';

export const apiService = {
  async getRequests(): Promise<SupportRequest[]> {
    const res = await fetch('/api/requests');
    return res.json();
  },

  async createRequest(data: { 
    userName: string; 
    title: string; 
    description: string; 
    location: string;
    aiData?: any; // Allow passing pre-analyzed data
  }): Promise<SupportRequest> {
    const res = await fetch('/api/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create request');
    }
    return res.json();
  },

  async getOffers(): Promise<VolunteerOffer[]> {
    const res = await fetch('/api/offers');
    return res.json();
  },

  async createOffer(data: {
    userName: string;
    bio: string;
    skills: string[];
    languages: string[];
    availability: string;
  }): Promise<VolunteerOffer> {
    const res = await fetch('/api/offers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async getResources(): Promise<Resource[]> {
    const res = await fetch('/api/resources');
    return res.json();
  },

  async getNotices(): Promise<CommunityNotice[]> {
    const res = await fetch('/api/notices');
    return res.json();
  },

  async updateRequestStatus(id: string, status: string): Promise<SupportRequest> {
    const res = await fetch(`/api/requests/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return res.json();
  },

  async getAnalytics(): Promise<{ name: string; count: number }[]> {
    const res = await fetch('/api/analytics');
    return res.json();
  },

  async getMatchExplanation(requestId: string, volunteerId: string): Promise<string> {
    const res = await fetch('/api/match-explain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestId, volunteerId })
    });
    const data = await res.json();
    return data.explanation;
  },

  async chatWithAssistant(message: string, history: any[]): Promise<string> {
    const res = await fetch('/api/assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history })
    });
    const data = await res.json();
    return data.text;
  }
};
