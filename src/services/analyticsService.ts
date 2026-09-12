export interface AnalyticsEvent {
  eventName: string;
  properties?: Record<string, any>;
  timestamp?: number;
}

class AnalyticsService {
  private eventsLog: AnalyticsEvent[] = [];

  trackEvent(eventName: string, properties?: Record<string, any>): void {
    const event: AnalyticsEvent = {
      eventName,
      properties: {
        ...properties,
        path: window.location.pathname,
        userAgent: navigator.userAgent,
      },
      timestamp: Date.now(),
    };

    this.eventsLog.push(event);

    if (process.env.NODE_ENV !== 'production') {
      console.log(`[NOIR Analytics] Event: ${eventName}`, properties || '');
    }
  }

  trackPageView(pageName: string): void {
    this.trackEvent('page_view', { pageName });
  }

  trackLogin(method: string): void {
    this.trackEvent('login', { method });
  }

  trackAddToCart(itemId: string, itemName: string, price: number, category: string): void {
    this.trackEvent('add_to_cart', { itemId, itemName, price, category });
  }

  trackReservationStart(): void {
    this.trackEvent('reservation_start');
  }

  trackReservationComplete(reservationId: string, guests: number, seating: string): void {
    this.trackEvent('reservation_complete', { reservationId, guests, seating });
  }

  trackCheckoutStart(): void {
    this.trackEvent('checkout_start');
  }

  trackCheckoutComplete(orderId: string, total: number): void {
    this.trackEvent('checkout_complete', { orderId, total });
  }

  trackAppDownloadClick(platform: 'android' | 'ios'): void {
    this.trackEvent('app_download_click', { platform });
  }

  trackNewsletterSubscribe(email: string): void {
    this.trackEvent('newsletter_subscribe', { emailDomain: email.split('@')[1] || '' });
  }

  getLoggedEvents(): AnalyticsEvent[] {
    return [...this.eventsLog];
  }
}

export const analytics = new AnalyticsService();
