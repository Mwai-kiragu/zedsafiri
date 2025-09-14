import { FareBreakdown, Trip } from '@/types/booking';

// LATRA Fare Calculation Engine (Simulated)
export class FareEngine {
  private static readonly LATRA_FEE_RATE = 0.05; // 5% LATRA fee
  private static readonly TRANSACTION_FEE_RATE = 0.02; // 2% transaction fee
  private static readonly AGENT_COMMISSION_RATE = 0.03; // 3% agent commission

  static calculateFare(
    trip: Trip, 
    seatCount: number = 1, 
    channel: 'WEB' | 'MOBILE' | 'AGENT' = 'WEB'
  ): FareBreakdown {
    const baseFare = trip.baseFare * seatCount;
    const latraFee = Math.round(baseFare * this.LATRA_FEE_RATE);
    const transactionFee = Math.round(baseFare * this.TRANSACTION_FEE_RATE);
    const commission = channel === 'AGENT' ? Math.round(baseFare * this.AGENT_COMMISSION_RATE) : 0;
    
    const grossFare = baseFare + latraFee + transactionFee + commission;

    return {
      baseFare,
      latraFee,
      transactionFee,
      commission,
      grossFare
    };
  }

  static validateFareCompliance(fareBreakdown: FareBreakdown): boolean {
    // Simulate LATRA compliance check
    const expectedLatraFee = Math.round(fareBreakdown.baseFare * this.LATRA_FEE_RATE);
    return fareBreakdown.latraFee >= expectedLatraFee;
  }

  static applyPromoCode(fareBreakdown: FareBreakdown, promoCode: string): FareBreakdown {
    // Simulate promo code application (only if LATRA approved)
    const approvedPromoCodes = ['STUDENT10', 'SENIOR15'];
    
    if (!approvedPromoCodes.includes(promoCode)) {
      return fareBreakdown;
    }

    const discount = promoCode === 'STUDENT10' ? 0.1 : 0.15;
    const discountAmount = Math.round(fareBreakdown.baseFare * discount);
    
    return {
      ...fareBreakdown,
      baseFare: fareBreakdown.baseFare - discountAmount,
      grossFare: fareBreakdown.grossFare - discountAmount
    };
  }
}