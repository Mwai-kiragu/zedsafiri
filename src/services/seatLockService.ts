import { SeatLock, SeatStatus } from '@/types/booking';
import { SeatConfigService } from './seatConfigService';

// Atomic Seat Locking System (Simulated)
export class SeatLockService {
  private static locks: Map<string, SeatLock> = new Map();
  private static seatStatuses: Map<string, SeatStatus> = new Map();
  private static readonly DEFAULT_LOCK_TTL = 5 * 60 * 1000; // 5 minutes
  private static readonly AGENT_LOCK_TTL = 10 * 60 * 1000; // 10 minutes for agents

  static initializeSeats(tripId: string, trip?: any): void {
    // Use seat configuration service to get proper layout
    if (trip) {
      const layout = SeatConfigService.getLayoutForTrip(trip);
      layout.layout.forEach(seat => {
        const seatId = `${tripId}-${seat.id}`;
        // Initialize based on seat configuration
        if (seat.isOccupied) {
          this.seatStatuses.set(seatId, 'OCCUPIED');
        } else if (seat.isBlocked) {
          this.seatStatuses.set(seatId, 'BLOCKED');
        } else {
          this.seatStatuses.set(seatId, 'FREE');
        }
      });
    } else {
      // Fallback to simple initialization for backwards compatibility
      for (let i = 1; i <= 24; i++) {
        const seatId = `${tripId}-${i}A`;
        this.seatStatuses.set(seatId, 'FREE');
      }
    }
  }

  static getSeatStatus(tripId: string): Map<string, SeatStatus> {
    const tripSeats = new Map<string, SeatStatus>();
    for (const [seatId, status] of this.seatStatuses.entries()) {
      if (seatId.startsWith(tripId)) {
        tripSeats.set(seatId, status);
      }
    }
    return tripSeats;
  }

  static async holdSeats(
    tripId: string, 
    seatIds: string[], 
    userId: string, 
    channel: 'WEB' | 'MOBILE' | 'AGENT' = 'WEB'
  ): Promise<{ success: boolean; lockId?: string; conflictSeats?: string[] }> {
    
    // Check if seats are available (only check new seats, not already held by this user)
    const conflictSeats: string[] = [];
    const existingUserLock = this.getUserActiveLock(userId);
    const currentlyHeldByUser = existingUserLock ? existingUserLock.seatIds : [];
    
    for (const seatId of seatIds) {
      const currentStatus = this.seatStatuses.get(seatId);
      if (currentStatus === 'OCCUPIED' || currentStatus === 'BLOCKED' || 
          (currentStatus === 'HELD' && !currentlyHeldByUser.includes(seatId))) {
        conflictSeats.push(seatId);
      }
    }

    if (conflictSeats.length > 0) {
      return { success: false, conflictSeats };
    }

    // Release any existing locks for this user
    this.releaseUserLocks(userId);

    // Create new lock for all requested seats
    const lockId = `lock_${Date.now()}_${userId}`;
    const ttl = channel === 'AGENT' ? this.AGENT_LOCK_TTL : this.DEFAULT_LOCK_TTL;
    const expiresAt = new Date(Date.now() + ttl);

    const lock: SeatLock = {
      id: lockId,
      tripId,
      seatIds,
      userId,
      expiresAt,
      status: 'HELD'
    };

    // Mark seats as held
    for (const seatId of seatIds) {
      this.seatStatuses.set(seatId, 'HELD');
    }

    this.locks.set(lockId, lock);

    // Set expiration timer
    setTimeout(() => {
      this.expireLock(lockId);
    }, ttl);

    return { success: true, lockId };
  }

  static extendLock(lockId: string, additionalTime: number = 60000): boolean {
    const lock = this.locks.get(lockId);
    if (!lock || lock.status !== 'HELD') {
      return false;
    }

    lock.expiresAt = new Date(lock.expiresAt.getTime() + additionalTime);
    return true;
  }

  static convertToOccupied(lockId: string, pnr: string): boolean {
    const lock = this.locks.get(lockId);
    if (!lock || lock.status !== 'HELD') {
      return false;
    }

    // Convert seats to occupied
    for (const seatId of lock.seatIds) {
      this.seatStatuses.set(seatId, 'OCCUPIED');
    }

    lock.status = 'CONVERTED';
    lock.pnr = pnr;
    return true;
  }

  static releaseUserLocks(userId: string): void {
    for (const [lockId, lock] of this.locks.entries()) {
      if (lock.userId === userId && lock.status === 'HELD') {
        this.releaseLock(lockId);
      }
    }
  }

  static cancelBooking(userId: string): boolean {
    // Immediately release all locks for this user
    this.releaseUserLocks(userId);
    return true;
  }

  static markSeatOccupied(tripId: string, seatId: string): void {
    // Manually mark a seat as occupied (for testing)
    const fullSeatId = seatId.includes('-') ? seatId : `${tripId}-${seatId}`;
    this.seatStatuses.set(fullSeatId, 'OCCUPIED');
  }

  static markSeatBlocked(tripId: string, seatId: string): void {
    // Manually mark a seat as blocked (for testing)
    const fullSeatId = seatId.includes('-') ? seatId : `${tripId}-${seatId}`;
    this.seatStatuses.set(fullSeatId, 'BLOCKED');
  }

  static freeSeat(tripId: string, seatId: string): void {
    // Manually free a seat (for testing)
    const fullSeatId = seatId.includes('-') ? seatId : `${tripId}-${seatId}`;
    this.seatStatuses.set(fullSeatId, 'FREE');
  }

  private static expireLock(lockId: string): void {
    const lock = this.locks.get(lockId);
    if (!lock || lock.status !== 'HELD') {
      return;
    }

    // Free the seats
    for (const seatId of lock.seatIds) {
      this.seatStatuses.set(seatId, 'FREE');
    }

    lock.status = 'EXPIRED';
  }

  private static releaseLock(lockId: string): void {
    const lock = this.locks.get(lockId);
    if (!lock) return;

    // Free the seats if still held
    if (lock.status === 'HELD') {
      for (const seatId of lock.seatIds) {
        this.seatStatuses.set(seatId, 'FREE');
      }
    }

    lock.status = 'REPLACED';
  }

  static getLockCountdown(lockId: string): number {
    const lock = this.locks.get(lockId);
    if (!lock || lock.status !== 'HELD') {
      return 0;
    }

    const remaining = lock.expiresAt.getTime() - Date.now();
    return Math.max(0, remaining);
  }

  static getUserActiveLock(userId: string): SeatLock | null {
    for (const lock of this.locks.values()) {
      if (lock.userId === userId && lock.status === 'HELD') {
        return lock;
      }
    }
    return null;
  }
}