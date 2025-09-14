import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Clock, RefreshCw } from "lucide-react"
import { SeatLockService } from "@/services/seatLockService"

interface SeatData {
  number: string
  status: 'FREE' | 'HELD' | 'OCCUPIED' | 'BLOCKED'
}

interface PassengerState {
  userId: string
  name: string
  selectedSeats: string[]
  lockId: string | null
  countdown: number
}

const SeatLockDemo = () => {
  const tripId = "TR123"
  
  // Two passengers with different user IDs
  const [passengerA, setPassengerA] = useState<PassengerState>({
    userId: 'passenger_A_001',
    name: 'Passenger A',
    selectedSeats: [],
    lockId: null,
    countdown: 0
  })
  
  const [passengerB, setPassengerB] = useState<PassengerState>({
    userId: 'passenger_B_002', 
    name: 'Passenger B',
    selectedSeats: [],
    lockId: null,
    countdown: 0
  })

  const [seatData, setSeatData] = useState<SeatData[]>([])
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  // Initialize seats
  useEffect(() => {
    SeatLockService.initializeSeats(tripId, 12) // Smaller grid for demo
    refreshSeatData()
  }, [])

  // Update countdowns for both passengers
  useEffect(() => {
    const timer = setInterval(() => {
      // Update Passenger A countdown
      if (passengerA.lockId) {
        const remaining = SeatLockService.getLockCountdown(passengerA.lockId)
        setPassengerA(prev => ({ ...prev, countdown: remaining }))
        
        if (remaining <= 0) {
          setPassengerA(prev => ({ ...prev, selectedSeats: [], lockId: null, countdown: 0 }))
          refreshSeatData()
        }
      }

      // Update Passenger B countdown  
      if (passengerB.lockId) {
        const remaining = SeatLockService.getLockCountdown(passengerB.lockId)
        setPassengerB(prev => ({ ...prev, countdown: remaining }))
        
        if (remaining <= 0) {
          setPassengerB(prev => ({ ...prev, selectedSeats: [], lockId: null, countdown: 0 }))
          refreshSeatData()
        }
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [passengerA.lockId, passengerB.lockId])

  const refreshSeatData = () => {
    const seatStatuses = SeatLockService.getSeatStatus(tripId)
    const seats: SeatData[] = []
    
    for (let i = 1; i <= 12; i++) {
      const seatNumber = `${i}A`
      const seatId = `${tripId}-${seatNumber}`
      const status = seatStatuses.get(seatId) || 'FREE'
      seats.push({ number: seatNumber, status })
    }
    
    setSeatData(seats)
    setLastUpdate(new Date())
  }

  const handleSeatClick = async (seat: SeatData, isPassengerA: boolean) => {
    if (seat.status === 'OCCUPIED' || seat.status === 'BLOCKED') return
    
    const passenger = isPassengerA ? passengerA : passengerB
    const setPassenger = isPassengerA ? setPassengerA : setPassengerB
    
    const seatId = `${tripId}-${seat.number}`

    if (passenger.selectedSeats.includes(seat.number)) {
      // Deselect seat
      const newSelection = passenger.selectedSeats.filter(s => s !== seat.number)
      setPassenger(prev => ({ ...prev, selectedSeats: newSelection }))
      
      if (newSelection.length === 0 && passenger.lockId) {
        SeatLockService.releaseUserLocks(passenger.userId)
        setPassenger(prev => ({ ...prev, lockId: null, countdown: 0 }))
      }
    } else {
      // Check if this seat is held by another user
      const currentStatus = seatData.find(s => s.number === seat.number)?.status
      if (currentStatus === 'HELD') {
        // Check if it's held by this user or another user
        const userLock = SeatLockService.getUserActiveLock(passenger.userId)
        const isHeldByThisUser = userLock?.seatIds.some(id => id.endsWith(seat.number))
        
        if (!isHeldByThisUser) {
          // Seat is held by another user - cannot select
          alert(`Seat ${seat.number} is currently held by another passenger!`)
          return
        }
      }
      
      // Select seat
      const newSelection = [...passenger.selectedSeats, seat.number]
      const seatIds = newSelection.map(num => `${tripId}-${num}`)
      
      const result = await SeatLockService.holdSeats(
        tripId, 
        seatIds, 
        passenger.userId,
        'WEB'
      )

      if (result.success && result.lockId) {
        setPassenger(prev => ({ 
          ...prev, 
          selectedSeats: newSelection, 
          lockId: result.lockId 
        }))
      } else {
        alert(`Failed to hold seats: ${result.conflictSeats?.join(', ')} already taken!`)
      }
    }
    
    refreshSeatData()
  }

  const getSeatColor = (seat: SeatData, passenger: PassengerState) => {
    if (passenger.selectedSeats.includes(seat.number)) {
      return 'bg-primary text-primary-foreground'
    }
    
    switch (seat.status) {
      case 'FREE':
        return 'bg-secondary hover:bg-secondary/80 border-2 border-secondary'
      case 'HELD':
        return 'bg-yellow-400 text-yellow-900 cursor-not-allowed'
      case 'OCCUPIED':
        return 'bg-destructive text-destructive-foreground cursor-not-allowed'
      case 'BLOCKED':
        return 'bg-muted text-muted-foreground cursor-not-allowed'
      default:
        return 'bg-secondary'
    }
  }

  const formatCountdown = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const simulatePayment = (passenger: PassengerState) => {
    if (passenger.lockId && passenger.selectedSeats.length > 0) {
      const pnr = `PNR${Date.now()}`
      const success = SeatLockService.convertToOccupied(passenger.lockId, pnr)
      if (success) {
        alert(`Payment successful! PNR: ${pnr}`)
        refreshSeatData()
      }
    }
  }

  const PassengerInterface = ({ passenger, isPassengerA }: { passenger: PassengerState, isPassengerA: boolean }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{passenger.name} Session</span>
          <Badge variant={isPassengerA ? "default" : "secondary"}>
            {passenger.userId}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Selection Info */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Selected Seats:</span>
            <span className="font-bold">
              {passenger.selectedSeats.length > 0 ? passenger.selectedSeats.join(', ') : 'None'}
            </span>
          </div>
          
          {passenger.lockId && passenger.countdown > 0 && (
            <div className="flex justify-between items-center">
              <span>Lock Expires:</span>
              <Badge variant="outline">
                <Clock className="w-3 h-3 mr-1" />
                {formatCountdown(passenger.countdown)}
              </Badge>
            </div>
          )}
        </div>

        {/* Seat Grid */}
        <div className="space-y-2">
          <div className="text-center text-xs text-muted-foreground">Front</div>
          <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto">
            {seatData.map((seat) => (
              <button
                key={seat.number}
                onClick={() => handleSeatClick(seat, isPassengerA)}
                disabled={
                  seat.status === 'OCCUPIED' || 
                  seat.status === 'BLOCKED' ||
                  (seat.status === 'HELD' && !passenger.selectedSeats.includes(seat.number))
                }
                className={`
                  w-8 h-8 rounded text-xs font-medium transition-colors
                  ${getSeatColor(seat, passenger)}
                  ${(seat.status === 'OCCUPIED' || seat.status === 'BLOCKED' || 
                    (seat.status === 'HELD' && !passenger.selectedSeats.includes(seat.number)))
                    ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 transition-transform'
                  }
                `}
              >
                {seat.number}
              </button>
            ))}
          </div>
          <div className="text-center text-xs text-muted-foreground">Back</div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <Button 
            onClick={() => simulatePayment(passenger)}
            disabled={passenger.selectedSeats.length === 0}
            className="w-full"
            size="sm"
          >
            Complete Payment
          </Button>
          <Button 
            onClick={() => {
              SeatLockService.releaseUserLocks(passenger.userId)
              if (isPassengerA) {
                setPassengerA(prev => ({ ...prev, selectedSeats: [], lockId: null, countdown: 0 }))
              } else {
                setPassengerB(prev => ({ ...prev, selectedSeats: [], lockId: null, countdown: 0 }))
              }
              refreshSeatData()
            }}
            variant="outline"
            size="sm"
            className="w-full"
          >
            Cancel Selection
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Multi-User Seat Locking Demo</h1>
        <p className="text-muted-foreground">
          Trip TR123 - Test concurrent seat selection by two passengers
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <span>Last updated:</span>
          <code className="bg-muted px-1 rounded">{lastUpdate.toLocaleTimeString()}</code>
          <Button onClick={refreshSeatData} size="sm" variant="ghost">
            <RefreshCw className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Legend */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap justify-center gap-6 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-secondary border-2 border-secondary rounded"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-primary rounded"></div>
              <span>Selected (by you)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-400 rounded"></div>
              <span>Held (by other passenger)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-destructive rounded"></div>
              <span>Occupied (paid)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Two Passenger Interfaces Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PassengerInterface passenger={passengerA} isPassengerA={true} />
        <PassengerInterface passenger={passengerB} isPassengerA={false} />
      </div>

      {/* Test Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Test Scenario Instructions
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <div><strong>1.</strong> Passenger A selects seat 1A - should become locked</div>
          <div><strong>2.</strong> Passenger B tries to select seat 1A - should be blocked (yellow/disabled)</div>
          <div><strong>3.</strong> Passenger A can complete payment to make it permanently occupied</div>
          <div><strong>4.</strong> Or wait 5 minutes for the lock to expire and seat becomes available again</div>
          <div><strong>5.</strong> Each passenger sees real-time updates of the other's seat selections</div>
        </CardContent>
      </Card>
    </div>
  )
}

export default SeatLockDemo