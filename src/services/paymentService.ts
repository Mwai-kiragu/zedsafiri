import { PaymentIntent, PaymentMethod, PaymentStatus } from '@/types/booking';
import { BookingStateMachine } from './bookingStateMachine';

// Payment Processing Service (Simulated)
export class PaymentService {
  private static readonly STK_TIMEOUT = 90000; // 90 seconds
  private static readonly CARD_TIMEOUT = 600000; // 10 minutes

  static async initiatePayment(
    pnr: string,
    amount: number,
    method: PaymentMethod,
    phone?: string
  ): Promise<{ success: boolean; paymentIntentId?: string; error?: string }> {
    
    const paymentIntentId = `pi_${Date.now()}_${pnr}`;
    const idempotencyKey = `${pnr}_${Date.now()}`;
    
    const paymentIntent: PaymentIntent = {
      id: paymentIntentId,
      pnr,
      amount,
      currency: 'TZS',
      method,
      status: 'CREATED',
      idempotencyKey,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + (method === 'STK_PUSH' ? this.STK_TIMEOUT : this.CARD_TIMEOUT))
    };

    // Create payment intent in booking system
    const created = BookingStateMachine.createPaymentIntent(pnr, paymentIntent);
    if (!created) {
      return { success: false, error: 'Failed to create payment intent' };
    }

    // Simulate payment method specific initiation
    switch (method) {
      case 'STK_PUSH':
        return this.initiateStkPush(paymentIntent, phone!);
      
      case 'CARD':
        return this.initiateCardPayment(paymentIntent);
      
      case 'BANK_TRANSFER':
        return this.initiateBankTransfer(paymentIntent);
      
      default:
        return { success: false, error: 'Unsupported payment method' };
    }
  }

  private static async initiateStkPush(
    intent: PaymentIntent, 
    phone: string
  ): Promise<{ success: boolean; paymentIntentId?: string; error?: string }> {
    
    console.log(`📱 Initiating STK Push to ${phone} for TZS ${intent.amount}`);
    
    // Update intent status
    BookingStateMachine.processPayment(intent.id, 'PENDING');
    
    // Simulate STK push with random success/failure
    setTimeout(() => {
      const success = Math.random() > 0.3; // 70% success rate
      const gatewayRef = `STK_${Date.now()}`;
      
      if (success) {
        console.log(`✅ STK Push successful: ${gatewayRef}`);
        BookingStateMachine.processPayment(intent.id, 'SUCCEEDED', gatewayRef);
      } else {
        console.log(`❌ STK Push failed: ${gatewayRef}`);
        BookingStateMachine.processPayment(intent.id, 'FAILED', gatewayRef);
      }
    }, Math.random() * 30000 + 5000); // 5-35 seconds delay
    
    // Set timeout
    setTimeout(() => {
      BookingStateMachine.processPayment(intent.id, 'EXPIRED');
    }, this.STK_TIMEOUT);
    
    return { 
      success: true, 
      paymentIntentId: intent.id 
    };
  }

  private static async initiateCardPayment(
    intent: PaymentIntent
  ): Promise<{ success: boolean; paymentIntentId?: string; error?: string }> {
    
    console.log(`💳 Initiating Card Payment for TZS ${intent.amount}`);
    
    // Update intent status
    BookingStateMachine.processPayment(intent.id, 'PENDING');
    
    // Simulate 3DS flow
    setTimeout(() => {
      const success = Math.random() > 0.2; // 80% success rate
      const gatewayRef = `CARD_${Date.now()}`;
      
      if (success) {
        console.log(`✅ Card Payment successful: ${gatewayRef}`);
        BookingStateMachine.processPayment(intent.id, 'SUCCEEDED', gatewayRef);
      } else {
        console.log(`❌ Card Payment failed: ${gatewayRef}`);
        BookingStateMachine.processPayment(intent.id, 'FAILED', gatewayRef);
      }
    }, Math.random() * 10000 + 2000); // 2-12 seconds delay
    
    return { 
      success: true, 
      paymentIntentId: intent.id 
    };
  }

  private static async initiateBankTransfer(
    intent: PaymentIntent
  ): Promise<{ success: boolean; paymentIntentId?: string; error?: string }> {
    
    console.log(`🏦 Bank Transfer initiated for TZS ${intent.amount}`);
    console.log(`Reference: ${intent.pnr}`);
    console.log(`Account: 0123456789 - LATRA Transport Ltd`);
    
    // Bank transfers remain pending until manual confirmation
    BookingStateMachine.processPayment(intent.id, 'PENDING');
    
    // Simulate eventual success (in real system, this would be via bank webhook/MT940)
    setTimeout(() => {
      const gatewayRef = `BANK_${Date.now()}`;
      console.log(`✅ Bank Transfer confirmed: ${gatewayRef}`);
      BookingStateMachine.processPayment(intent.id, 'SUCCEEDED', gatewayRef);
    }, Math.random() * 60000 + 30000); // 30-90 seconds delay
    
    return { 
      success: true, 
      paymentIntentId: intent.id 
    };
  }

  static async simulateIPN(
    paymentIntentId: string, 
    status: PaymentStatus, 
    gatewayRef: string
  ): Promise<boolean> {
    console.log(`🔔 Simulating IPN: ${paymentIntentId} -> ${status}`);
    
    // Validate IPN (in real system, verify signature, amount, etc.)
    const isValid = this.validateIPN(paymentIntentId, status, gatewayRef);
    if (!isValid) {
      console.error('❌ Invalid IPN received');
      return false;
    }

    // Process payment idempotently
    return BookingStateMachine.processPayment(paymentIntentId, status, gatewayRef);
  }

  private static validateIPN(
    paymentIntentId: string, 
    status: PaymentStatus, 
    gatewayRef: string
  ): boolean {
    // Simulate signature validation, amount verification, etc.
    return paymentIntentId.length > 0 && gatewayRef.length > 0;
  }

  static getPaymentMethods(): { id: PaymentMethod; name: string; icon: string }[] {
    return [
      {
        id: 'STK_PUSH',
        name: 'M-Pesa STK Push',
        icon: '📱'
      },
      {
        id: 'CARD',
        name: 'Credit/Debit Card',
        icon: '💳'
      },
      {
        id: 'BANK_TRANSFER',
        name: 'Bank Transfer',
        icon: '🏦'
      }
    ];
  }

  static formatCurrency(amount: number, currency: string = 'TZS'): string {
    return `${currency} ${amount.toLocaleString()}`;
  }
}