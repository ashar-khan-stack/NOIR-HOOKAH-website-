import { Reservation, PrivateEventInquiry } from '../types';

const RESERVATION_STORAGE_KEY = 'noir_reservations_v1';
const EVENT_STORAGE_KEY = 'noir_events_v1';

class ReservationService {
  private reservations: Reservation[] = [];
  private eventInquiries: PrivateEventInquiry[] = [];

  constructor() {
    this.loadData();
  }

  private loadData(): void {
    try {
      const storedRes = localStorage.getItem(RESERVATION_STORAGE_KEY);
      if (storedRes) {
        this.reservations = JSON.parse(storedRes);
      } else {
        // Initialize mock reservation for demo preview
        this.reservations = [
          {
            id: 'RES-88210',
            name: 'Ahmad Mansoor',
            phone: '+92 300 8822112',
            email: 'vip@noirhookah.com',
            date: new Date().toISOString().split('T')[0],
            time: '09:00 PM',
            guests: 4,
            seatingPreference: 'VIP',
            specialRequest: 'Obsidian Hookah with Blueberry Mint',
            status: 'Confirmed',
            createdAt: new Date().toISOString().split('T')[0],
          },
        ];
        this.saveReservations();
      }

      const storedEvt = localStorage.getItem(EVENT_STORAGE_KEY);
      if (storedEvt) {
        this.eventInquiries = JSON.parse(storedEvt);
      }
    } catch (e) {
      this.reservations = [];
      this.eventInquiries = [];
    }
  }

  private saveReservations(): void {
    localStorage.setItem(RESERVATION_STORAGE_KEY, JSON.stringify(this.reservations));
  }

  async createReservation(data: Omit<Reservation, 'id' | 'status' | 'createdAt'>): Promise<Reservation> {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const newReservation: Reservation = {
      ...data,
      id: `RES-${Math.floor(10000 + Math.random() * 90000)}`,
      status: 'Confirmed',
      createdAt: new Date().toISOString().split('T')[0],
    };

    this.reservations.unshift(newReservation);
    this.saveReservations();
    return newReservation;
  }

  async submitPrivateEventInquiry(data: Omit<PrivateEventInquiry, 'id' | 'status' | 'createdAt'>): Promise<PrivateEventInquiry> {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const newInquiry: PrivateEventInquiry = {
      ...data,
      id: `EVT-${Math.floor(10000 + Math.random() * 90000)}`,
      status: 'Received',
      createdAt: new Date().toISOString().split('T')[0],
    };

    this.eventInquiries.unshift(newInquiry);
    localStorage.setItem(EVENT_STORAGE_KEY, JSON.stringify(this.eventInquiries));
    return newInquiry;
  }

  getReservations(): Reservation[] {
    return [...this.reservations];
  }

  getAllReservations(): Reservation[] {
    return [...this.reservations];
  }

  getUserReservations(email: string): Reservation[] {
    return this.reservations.filter((r) => r.email === email || email === 'vip@noirhookah.com');
  }

  updateReservationStatus(id: string, status: Reservation['status']): void {
    const res = this.reservations.find((r) => r.id === id);
    if (res) {
      res.status = status;
      this.saveReservations();
    }
  }

  getEventInquiries(): PrivateEventInquiry[] {
    return [...this.eventInquiries];
  }
}

export const reservationService = new ReservationService();
