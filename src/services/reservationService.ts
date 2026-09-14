import { Reservation, PrivateEventInquiry } from '../types';
import { firestoreService } from './firestoreService';

class ReservationService {
  private reservationsCache: Reservation[] = [];
  private eventInquiries: PrivateEventInquiry[] = [];

  async createReservation(data: Omit<Reservation, 'id' | 'status' | 'createdAt'>): Promise<Reservation> {
    const newReservation = await firestoreService.createReservation(data);
    this.reservationsCache.unshift(newReservation);
    return newReservation;
  }

  async submitPrivateEventInquiry(data: Omit<PrivateEventInquiry, 'id' | 'status' | 'createdAt'>): Promise<PrivateEventInquiry> {
    const newInquiry: PrivateEventInquiry = {
      ...data,
      id: `EVT-${Math.floor(10000 + Math.random() * 90000)}`,
      status: 'Received',
      createdAt: new Date().toISOString().split('T')[0],
    };

    this.eventInquiries.unshift(newInquiry);
    return newInquiry;
  }

  async getReservations(): Promise<Reservation[]> {
    const fromFirestore = await firestoreService.getAllReservations();
    if (fromFirestore.length > 0) {
      this.reservationsCache = fromFirestore;
    }
    return this.reservationsCache;
  }

  async getAllReservations(): Promise<Reservation[]> {
    return this.getReservations();
  }

  async getUserReservations(email: string): Promise<Reservation[]> {
    const userRes = await firestoreService.getUserReservations(email);
    if (userRes.length > 0) {
      return userRes;
    }
    return this.reservationsCache.filter((r) => r.email === email);
  }

  async updateReservationStatus(id: string, status: Reservation['status']): Promise<void> {
    await firestoreService.updateReservationStatus(id, status);
    const res = this.reservationsCache.find((r) => r.id === id);
    if (res) {
      res.status = status;
    }
  }

  getEventInquiries(): PrivateEventInquiry[] {
    return [...this.eventInquiries];
  }
}

export const reservationService = new ReservationService();
