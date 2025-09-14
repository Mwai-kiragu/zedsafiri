import { SeatLock, SeatStatus } from '@/types/booking';

// Atomic Seat Locking System (Simulated)
export class SeatLockService {
  private static locks: Map<string, SeatLock> = new Map();
  private static seatStatuses: Map<string, SeatStatus> = new Map();
  private static readonly DEFAULT_LOCK_TTL = 5 * 60 * 1000; // 5 minutes
  private static readonly AGENT_LOCK_TTL = 10 * 60 * 1000; // 10 minutes for agents

  static initializeSeats(tripId: string, seatCount: number): void {
    // Initialize seats as FREE for simulation
    for (let i = 1; i <= seatCount; i++) {
      const seatId = `${tripId}-${i}A`;
      this.seatStatuses.set(seatId, 'FREE');
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
    
    // Check if seats are available (atomic operation simulation)
    const conflictSeats: string[] = [];
    for (const seatId of seatIds) {
      const currentStatus = this.seatStatuses.get(seatId);
      if (currentStatus !== 'FREE') {
        conflictSeats.push(seatId);
      }
    }

    if (conflictSeats.length > 0) {
      return { success: false, conflictSeats };
    }

    // Release any existing locks for this user
    this.releaseUserLocks(userId);

    // Create new lock
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