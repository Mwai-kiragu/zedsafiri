import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock, MapPin, Users } from "lucide-react"
import Layout from "@/components/Layout"
import { SeatLockService } from "@/services/seatLockService"

interface SeatData {
  number: string
  status: 'FREE' | 'HELD' | 'OCCUPIED' | 'BLOCKED'
}

const SeatSelection = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { booking, searchParams } = location.state || {}
  
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])
  const [seatData, setSeatData] = useState<SeatData[]>([])
  const [lockId, setLockId] = useState<string | null>(null)
  const [countdown, setCountdown] = useState<number>(0)

  // Initialize seats when component mounts
  useEffect(() => {
    if (!booking) {
      navigate('/dashboard')
      return
    }

    // Initialize seats for this trip (simulating 24 seats in a bus)
    const tripId = booking.id
    SeatLockService.initializeSeats(tripId, 24)
    
    // Get current seat status
    const seatStatuses = SeatLockService.getSeatStatus(tripId)
    const seats: SeatData[] = []
    
    for (let i = 1; i <= 24; i++) {
      const seatNumber = `${i}A`
      const seatId = `${tripId}-${seatNumber}`
      const status = seatStatuses.get(seatId) || 'FREE'
      seats.push({ number: seatNumber, status })
    }
    
    setSeatData(seats)
  }, [booking, navigate])

  // Update countdown timer
  useEffect(() => {
    if (!lockId) return

    const timer = setInterval(() => {
      const remaining = SeatLockService.getLockCountdown(lockId)
      setCountdown(remaining)
      
      if (remaining <= 0) {
        setSelectedSeats([])
        setLockId(null)
        // Refresh seat data
        const tripId = booking.id
        const seatStatuses = SeatLockService.getSeatStatus(tripId)
        setSeatData(prev => prev.map(seat => ({
          ...seat,
          status: seatStatuses.get(`${tripId}-${seat.number}`) || 'FREE'
        })))
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [lockId, booking])

  const handleSeatClick = async (seat: SeatData) => {
    if (seat.status === 'OCCUPIED' || seat.status === 'BLOCKED') return

    const tripId = booking.id
    const seatId = `${tripId}-${seat.number}`

    if (selectedSeats.includes(seat.number)) {
      // Deselect seat
      setSelectedSeats(prev => prev.filter(s => s !== seat.number))
    } else {
      // Select seat - hold it
      const newSelection = [...selectedSeats, seat.number]
      const seatIds = newSelection.map(num => `${tripId}-${num}`)
      
      const result = await SeatLockService.holdSeats(
        tripId, 
        seatIds, 
        'user123', // In real app, this would be actual user ID
        'WEB'
      )

      if (result.success && result.lockId) {
        setSelectedSeats(newSelection)
        setLockId(result.lockId)
        
        // Update seat display
        setSeatData(prev => prev.map(s => ({
          ...s,
          status: newSelection.includes(s.number) ? 'HELD' : 
                  (s.status === 'HELD' && !newSelection.includes(s.number) ? 'FREE' : s.status)
        })))
      } else {
        // Handle conflict
        console.error('Failed to hold seats:', result.conflictSeats)
      }
    }
  }

  const getSeatColor = (seat: SeatData) => {
    if (selectedSeats.includes(seat.number)) {
      return 'bg-primary text-primary-foreground hover:bg-primary/90'
    }
    
    switch (seat.status) {
      case 'FREE':
        return 'bg-secondary hover:bg-secondary/80 border-2 border-secondary'
      case 'HELD':
        return selectedSeats.includes(seat.number) 
          ? 'bg-primary text-primary-foreground' 
          : 'bg-yellow-400 text-yellow-900 cursor-not-allowed'
      case 'OCCUPIED':
        return 'bg-destructive text-destructive-foreground cursor-not-allowed'
      case 'BLOCKED':
        return 'bg-muted text-muted-foreground cursor-not-allowed'
      default:
        return 'bg-secondary'
    }
  }

  const handleProceedToPayment = () => {
    if (selectedSeats.length === 0) return

    navigate('/booking/confirm', {
      state: {
        booking,
        searchParams,
        selectedSeats,
        lockId,
        step: 'payment'
      }
    })
  }

  const formatCountdown = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  if (!booking) {
    return <div>Loading...</div>
  }

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Results
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Trip Details */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Trip Summary</span>
                    <Badge variant="outline">{booking.class}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="font-semibold text-lg">{booking.operator}</div>
                    <div className="text-sm text-muted-foreground">
                      {searchParams.from} → {searchParams.to}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-center">
                      <div className="font-bold text-lg">{booking.departureTime}</div>
                      <div className="text-sm text-muted-foreground flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {searchParams.from}
                      </div>
                    </div>
                    <div className="flex-1 px-4">
                      <div className="text-center text-sm text-muted-foreground flex items-center justify-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {booking.duration}
                      </div>
                      <div className="w-full h-px bg-border mt-1"></div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-lg">{booking.arrivalTime}</div>
                      <div className="text-sm text-muted-foreground flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {searchParams.to}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Price per seat:</span>
                      <span className="font-bold text-lg">TZS {booking.price.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Selection Info */}
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Selected Seats:</span>
                      <span className="font-bold">
                        {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None selected'}
                      </span>
                    </div>
                    
                    {selectedSeats.length > 0 && lockId && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Time remaining:</span>
                        <Badge variant="outline">
                          {formatCountdown(countdown)}
                        </Badge>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="font-medium">Total Amount:</span>
                      <span className="font-bold text-xl text-primary">
                        TZS {(booking.price * selectedSeats.length).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Seat Map */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Select Your Seats</span>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="w-4 h-4 mr-1" />
                      {searchParams.passengers} passenger{searchParams.passengers > 1 ? 's' : ''}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Seat Legend */}
                  <div className="flex flex-wrap gap-4 mb-6 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-secondary border-2 border-secondary rounded"></div>
                      <span>Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-primary rounded"></div>
                      <span className="text-primary-foreground">Selected</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-destructive rounded"></div>
                      <span>Occupied</span>
                    </div>
                  </div>

                  {/* Seat Grid */}
                  <div className="space-y-4">
                    <div className="text-center text-sm font-medium text-muted-foreground">Front</div>
                    <div className="grid grid-cols-4 gap-3 max-w-xs mx-auto">
                      {seatData.map((seat) => (
                        <button
                          key={seat.number}
                          onClick={() => handleSeatClick(seat)}
                          disabled={seat.status === 'OCCUPIED' || seat.status === 'BLOCKED'}
                          className={`
                            w-12 h-12 rounded font-medium text-xs transition-colors
                            ${getSeatColor(seat)}
                            ${seat.status === 'OCCUPIED' || seat.status === 'BLOCKED' 
                              ? '' : 'hover:scale-105 transition-transform'
                            }
                          `}
                        >
                          {seat.number}
                        </button>
                      ))}
                    </div>
                    <div className="text-center text-sm font-medium text-muted-foreground">Back</div>
                  </div>

                  {/* Continue Button */}
                  <div className="mt-8">
                    <Button 
                      onClick={handleProceedToPayment}
                      disabled={selectedSeats.length === 0}
                      className="w-full"
                      size="lg"
                    >
                      Proceed to Payment ({selectedSeats.length} seat{selectedSeats.length !== 1 ? 's' : ''})
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default SeatSelection