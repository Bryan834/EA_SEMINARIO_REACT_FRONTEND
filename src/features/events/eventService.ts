import api from '../../api';
import type { Event } from '../../modules/event';

export const getEvents = async (): Promise<Event[]> => {
  const res = await api.get('/event');
  return res.data;
};
export const getEventById = async (id: string): Promise<Event> => {
  const res = await api.get(`/event/${id}`);
  return res.data;
};

export const createEvent = async (eventData: Partial<Event>): Promise<Event> => {
  const res = await api.post('/event', eventData);
  return res.data;
};

export const updateEvent = async (id: string, eventData: Partial<Event>): Promise<Event> => {
  const res = await api.put(`/event/${id}`, eventData);
  return res.data;
};

export const deleteEvent = async (id: string): Promise<void> => {
  await api.delete(`/event/${id}`);
};

export const joinEvent = async (eventId: string): Promise<Event> => {
  const res = await api.post(`/event/${eventId}/join`);
  return res.data;
};

export const leaveEvent = async (eventId: string): Promise<Event> => {
  const res = await api.post(`/event/${eventId}/leave`);
  return res.data;
};


