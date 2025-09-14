import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Clock, MapPin, Users, AlertTriangle } from "lucide-react"
import Layout from "@/components/Layout"
import { SeatLockService } from "@/services/seatLockService"
import { SeatConfigService, type SeatConfig } from "@/services/seatConfigService"
import { useToast } from "@/hooks/use-toast"

interface SeatData {
  id: string
  config: SeatConfig
  status: 'FREE' | 'HELD' | 'OCCUPIED' | 'BLOCKED'
  isSelected: boolean
}

const SeatSelection = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { booking, searchParams } = location.state || {}
  
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])
  const [seatData, setSeatData] = useState<SeatData[]>([])
  const [lockId, setLockId] = useState<string | null>(null)
  const [countdown, setCountdown] = useState<number>(0)
  const [vehicleLayout, setVehicleLayout] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  // Initialize seats when component mounts
  useEffect(() => {
    if (!booking) {
      navigate('/dashboard')
      return
    }

    try {
      // Get vehicle layout for this specific trip
      const layout = SeatConfigService.getLayoutForTrip(booking)
      setVehicleLayout(layout)
      
      // Initialize seat locking service with proper layout
      SeatLockService.initializeSeats(booking.id, booking)
      
      // Get current seat status
      const seatStatuses = SeatLockService.getSeatStatus(booking.id)
      const seats: SeatData[] = []
      
      layout.layout.forEach(seatConfig => {
        const seatId = `${booking.id}-${seatConfig.id}`
        const status = seatStatuses.get(seatId) || 'FREE'
        seats.push({ 
          id: seatConfig.id,
          config: seatConfig,
          status,
          isSelected: false
        })
      })
      
      setSeatData(seats)
      setError(null)
    } catch (err) {
      setError('Failed to load seat map. Please try again.')
      console.error('Seat initialization error:', err)
    }
  }, [booking, navigate])

  // Update countdown timer
  useEffect(() => {
    if (!lockId) return

    const timer = setInterval(() => {
      const remaining = SeatLockService.getLockCountdown(lockId)
      setCountdown(remaining)
      
      if (remaining <= 0) {
        // Lock expired
        setSelectedSeats([])
        setLockId(null)
        refreshSeatData()
        toast({
          title: "Seat Hold Expired",
          description: "Your seat selection has expired. Please select seats again.",
          variant: "destructive"
        })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [lockId, booking, toast])

  const refreshSeatData = () => {
    if (!booking || !vehicleLayout) return
    
    const seatStatuses = SeatLockService.getSeatStatus(booking.id)
    setSeatData(prev => prev.map(seat => ({
      ...seat,
      status: seatStatuses.get(`${booking.id}-${seat.id}`) || 'FREE',
      isSelected: selectedSeats.includes(seat.id)
    })))
  }

  const handleSeatClick = async (seat: SeatData) => {
    // Prevent selection of occupied or blocked seats
    if (seat.status === 'OCCUPIED' || seat.status === 'BLOCKED') {
      toast({
        title: "Seat Unavailable", 
        description: seat.status === 'OCCUPIED' ? 
          `Seat ${seat.id} is already booked by another passenger.` :
          `Seat ${seat.id} is currently blocked and unavailable.`,
        variant: "destructive"
      })
      return
    }

    const tripId = booking.id
    const seatId = `${tripId}-${seat.id}`

    if (selectedSeats.includes(seat.id)) {
      // Deselect seat - remove from selection
      const newSelection = selectedSeats.filter(s => s !== seat.id)
      setSelectedSeats(newSelection)
      
      if (newSelection.length === 0 && lockId) {
        // Release all locks if no seats selected
        SeatLockService.releaseUserLocks('user123')
        setLockId(null)
      } else if (lockId) {
        // Update lock with remaining seats
        const seatIds = newSelection.map(num => `${tripId}-${num}`)
        const result = await SeatLockService.holdSeats(tripId, seatIds, 'user123', 'WEB')
        if (result.success && result.lockId) {
          setLockId(result.lockId)
        }
      }
    } else {
      // Check if seat is held by another user
      if (seat.status === 'HELD') {
        const userLock = SeatLockService.getUserActiveLock('user123')
        const isHeldByThisUser = userLock?.seatIds.some(id => id.endsWith(seat.id))
        
        if (!isHeldByThisUser) {
          toast({
            title: "Seat Unavailable",
            description: `Seat ${seat.id} is currently held by another passenger. Please select a different seat.`,
            variant: "destructive"
          })
          return
        }
      }
      
      // Select seat - add to selection and hold it
      const newSelection = [...selectedSeats, seat.id]
      const seatIds = newSelection.map(num => `${tripId}-${num}`)
      
      const result = await SeatLockService.holdSeats(tripId, seatIds, 'user123', 'WEB')

      if (result.success && result.lockId) {
        setSelectedSeats(newSelection)
        setLockId(result.lockId)
        toast({
          title: "Seat Selected",
          description: `Seat ${seat.id} has been reserved for you.`,
        })
      } else {
        const conflictSeats = result.conflictSeats?.map(id => id.split('-')[1]).join(', ')
        toast({
          title: "Selection Failed",
          description: `Failed to reserve seats: ${conflictSeats} are no longer available.`,
          variant: "destructive"
        })
      }
    }
    
    refreshSeatData()
  }

  const getSeatColor = (seat: SeatData) => {
    if (selectedSeats.includes(seat.id)) {
      return 'bg-primary text-primary-foreground hover:bg-primary/90'
    }
    
    switch (seat.status) {
      case 'FREE':
        return 'bg-secondary hover:bg-secondary/80 border-2 border-secondary'
      case 'HELD':
        return selectedSeats.includes(seat.id) 
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

  const getSeatIcon = (seat: SeatData) => {
    if (seat.config.type === 'WINDOW') return '🪟'
    if (seat.config.type === 'AISLE') return '🚶'
    return '💺'
  }

  const handleCancelSelection = () => {
    if (lockId) {
      SeatLockService.cancelBooking('user123')
      setSelectedSeats([])
      setLockId(null)
      refreshSeatData()
      toast({
        title: "Selection Cancelled",
        description: "Your seat selection has been cancelled and seats are now available for other passengers.",
      })
    }
  }

  const handleProceedToPayment = () => {
    if (selectedSeats.length === 0) return
    
    if (!lockId) {
      toast({
        title: "No Active Reservation",
        description: "Please select seats first.",
        variant: "destructive"
      })
      return
    }

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

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Alert className="max-w-md">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </Layout>
    )
  }

  if (!vehicleLayout) {
    return (
      <Layout>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div>Loading seat map...</div>
        </div>
      </Layout>
    )
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
                      <span>Selected</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-yellow-400 rounded"></div>
                      <span>Held by Others</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-destructive rounded"></div>
                      <span>Occupied</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-muted rounded"></div>
                      <span>Blocked</span>
                    </div>
                  </div>

                  {/* Vehicle Info */}
                  <div className="bg-muted/30 p-3 rounded-lg mb-4">
                    <div className="text-sm font-medium">{vehicleLayout.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {vehicleLayout.class} Class • {vehicleLayout.totalSeats} seats • {booking.operator}
                    </div>
                  </div>
                  
                  {/* Selection Instructions */}
                  <div className="text-center text-sm text-muted-foreground mb-4">
                    Click seats to select. Seats are held for {Math.floor(SeatLockService['DEFAULT_LOCK_TTL'] / 60000)} minutes.
                  </div>

                  {/* Seat Grid */}
                  <div className="space-y-4">
                    <div className="text-center text-sm font-medium text-muted-foreground">Front</div>
                    <div className={`grid gap-2 max-w-sm mx-auto ${
                      vehicleLayout.seatsPerRow === 4 ? 'grid-cols-4' : 
                      vehicleLayout.seatsPerRow === 5 ? 'grid-cols-5' : 'grid-cols-4'
                    }`}>
                      {seatData.map((seat) => (
                        <button
                          key={seat.id}
                          onClick={() => handleSeatClick(seat)}
                          disabled={
                            seat.status === 'OCCUPIED' || 
                            seat.status === 'BLOCKED' ||
                            (seat.status === 'HELD' && !selectedSeats.includes(seat.id))
                          }
                          className={`
                            w-12 h-12 rounded font-medium text-xs transition-all relative
                            ${getSeatColor(seat)}
                            ${(seat.status === 'OCCUPIED' || seat.status === 'BLOCKED' || 
                              (seat.status === 'HELD' && !selectedSeats.includes(seat.id)))
                              ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 transition-transform'
                            }
                          `}
                          title={`${seat.id} - ${seat.config.type} - ${seat.config.class}`}
                        >
                          <span className="text-xs absolute top-0 left-0 w-3 h-3">
                            {getSeatIcon(seat)}
                          </span>
                          {seat.id}
                        </button>
                      ))}
                    </div>
                    <div className="text-center text-sm font-medium text-muted-foreground">Back</div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-8 space-y-2">
                    <Button 
                      onClick={handleProceedToPayment}
                      disabled={selectedSeats.length === 0}
                      className="w-full"
                      size="lg"
                    >
                      Proceed to Payment ({selectedSeats.length} seat{selectedSeats.length !== 1 ? 's' : ''})
                    </Button>
                    
                    {selectedSeats.length > 0 && (
                      <Button 
                        onClick={handleCancelSelection}
                        variant="outline"
                        className="w-full"
                        size="sm"
                      >
                        Cancel Selection
                      </Button>
                    )}
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