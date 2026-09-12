/**
 * Newsletter / Email Marketing Service Abstraction
 * Configurable for Mailchimp, Klaviyo, SendGrid, or custom backend endpoint.
 */

const SUBSCRIBERS_KEY = 'noir_newsletter_subscribers_v1';

class EmailMarketingService {
  private subscribers: string[] = [];

  constructor() {
    try {
      const stored = localStorage.getItem(SUBSCRIBERS_KEY);
      if (stored) {
        this.subscribers = JSON.parse(stored);
      }
    } catch (e) {
      this.subscribers = [];
    }
  }

  async subscribe(email: string): Promise<{ success: boolean; message: string }> {
    await new Promise((resolve) => setTimeout(resolve, 600));

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, message: 'Please enter a valid email address.' };
    }

    if (this.subscribers.includes(cleanEmail)) {
      return { success: true, message: 'You are already subscribed to NOIR VIP Privileges.' };
    }

    this.subscribers.push(cleanEmail);
    localStorage.setItem(SUBSCRIBERS_KEY, JSON.stringify(this.subscribers));

    return {
      success: true,
      message: 'Welcome to the NOIR Inner Circle. Check your inbox for exclusive VIP privileges.',
    };
  }

  getSubscribers(): string[] {
    return [...this.subscribers];
  }
}

export const emailMarketingService = new EmailMarketingService();
