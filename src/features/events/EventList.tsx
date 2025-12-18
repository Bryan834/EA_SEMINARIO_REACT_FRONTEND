import React, { useEffect, useState } from 'react';
import { getEvents, joinEvent, leaveEvent } from './eventService';
import type { Event } from '../../modules/event';
import { useAuth } from '../../hooks/useAuth';
import './EventList.css';

export const EventList: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const { user } = useAuth();

  const loadEvents = async () => {
    try {
      const data = await getEvents();
      setEvents(data);
    } catch (err) {
      setError('Error cargando eventos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [user]);

  const handleJoin = async (eventId: string) => {
    if (!user) {
      alert('Debes iniciar sesión para inscribirte');
      return;
    }

    setActionLoading(eventId);
    try {
      await joinEvent(eventId);
      await loadEvents();
      alert('Te has inscrito al evento exitosamente');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al inscribirse');
    } finally {
      setActionLoading(null);
    }
  };

  const handleLeave = async (eventId: string) => {
    if (!user) {
      alert('Debes iniciar sesión');
      return;
    }

    setActionLoading(eventId);
    try {
      await leaveEvent(eventId);
      await loadEvents();
      alert('Te has desinscrito del evento exitosamente');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al desinscribirse');
    } finally {
      setActionLoading(null);
    }
  };

  const isUserJoined = (event: Event): boolean => {
    if (!user || !user._id) {
      console.log('No hay usuario o no tiene _id:', user);
      return false;
    }
    
    const userId = user._id;
    console.log('UserID:', userId);
    console.log('Participants del evento', event.name, ':', event.participants);
    
    if (!event.participants || event.participants.length === 0) {
      return false;
    }
    
    return event.participants.some(participantId => {
      console.log('Comparando:', participantId, 'con', userId);
      return participantId.toString() === userId.toString();
    });
  };

  if (loading) return <div>Cargando eventos...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="event-list-page"> 
      <h2 className='event-header'>EVENTOS</h2>

      <div className="event-list-container">
        {events.map(ev => {
          const joined = isUserJoined(ev);
          const isLoading = actionLoading === ev._id;

          return (
            <div key={ev._id} className="card">
              <div className="no-image">
                <svg
                  className="icon"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.1"
                    d="m3 16 5-7 6 6.5m6.5 2.5L16 13l-4.286 6M14 10h.01M4 19h16a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Z"
                  ></path>
                </svg>
              </div>
              <div className="content">
                <p className="name">{ev.name}</p>
                <p className="address">{ev.address ?? 'No especificado'}</p>
                <p className="time">{ev.schedule}</p>
                
                {user && (
                  <div className="event-actions">
                    {joined ? (
                      <button 
                        className="btn-leave"
                        onClick={() => handleLeave(ev._id)}
                        disabled={isLoading}
                      >
                        {isLoading ? 'Procesando...' : 'Desinscribirse'}
                      </button>
                    ) : (
                      <button 
                        className="btn-join"
                        onClick={() => handleJoin(ev._id)}
                        disabled={isLoading}
                      >
                        {isLoading ? 'Procesando...' : 'Inscribirse'}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};