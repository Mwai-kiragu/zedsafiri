import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, BusIcon, TrainIcon, MapPin, Clock, CreditCard, Smartphone, Globe } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Layout from "@/components/Layout"
import { currencyConverter } from "@/services/currencyConverter"
import { ticketService } from "@/services/ticketService"
import { SeatLockService } from "@/services/seatLockService"

interface BookingData {
  booking: any
  searchParams: any
  selectedSeats?: string[]
  lockId?: string
  step?: string
}

const BookingConfirm = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)
  
  const { booking, searchParams, selectedSeats = [], lockId } = (location.state as BookingData) || {}

  const [passengerDetails, setPassengerDetails] = useState({
    fullName: '',
    email: '',
    phone: '',
    idNumber: ''
  })

  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'card'>('mpesa')
  const [selectedCurrency, setSelectedCurrency] = useState('TZS')
  const [availableCurrencies, setAvailableCurrencies] = useState(currencyConverter.getAllCurrencies())
  const [exchangeRate, setExchangeRate] = useState(1)
  const [isLoadingRate, setIsLoadingRate] = useState(false)

  // Force refresh of currencies on component mount  
  useEffect(() => {
    const currencies = currencyConverter.getAllCurrencies()
    setAvailableCurrencies(currencies)
    // Ensure TZS is selected by default
    setSelectedCurrency('TZS')
  }, [])

  // Fetch live exchange rates when currency changes
  useEffect(() => {
    if (selectedCurrency === 'TZS') {
      setExchangeRate(1)
      return
    }

    // Check cache first (cache for 5 minutes)
    const cacheKey = `exchange_rate_TZS_${selectedCurrency}`
    const cached = localStorage.getItem(cacheKey)
    if (cached) {
      const { rate, timestamp } = JSON.parse(cached)
      const fiveMinutesAgo = Date.now() - (5 * 60 * 1000)
      if (timestamp > fiveMinutesAgo) {
        setExchangeRate(rate)
        return
      }
    }

    setIsLoadingRate(true)
    fetch(`https://api.exchangerate.host/convert?from=TZS&to=${selectedCurrency}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.result) {
          const rate = data.result
          setExchangeRate(rate)
          // Cache the rate
          localStorage.setItem(cacheKey, JSON.stringify({
            rate,
            timestamp: Date.now()
          }))
        } else {
          // Fallback to static rates if API fails
          const fallbackRate = currencyConverter.convert(1, selectedCurrency)
          setExchangeRate(fallbackRate)
        }
      })
      .catch(() => {
        // Fallback to static rates if API fails
        const fallbackRate = currencyConverter.convert(1, selectedCurrency)
        setExchangeRate(fallbackRate)
      })
      .finally(() => {
        setIsLoadingRate(false)
      })
  }, [selectedCurrency])

  if (!booking) {
    navigate('/dashboard')
    return null
  }

  const totalPrice = booking.price * selectedSeats.length
  const serviceFee = 2000
  const totalTZS = totalPrice + serviceFee
  
  // Convert prices for display using live exchange rates
  const convertedBasePrice = booking.price * exchangeRate
  const convertedServiceFee = serviceFee * exchangeRate
  const convertedTotal = totalTZS * exchangeRate

  // Format amounts with proper currency symbols
  const formatAmount = (amount: number) => {
    const currencyInfo = availableCurrencies.find(c => c.code === selectedCurrency)
    if (!currencyInfo) return amount.toString()

    const rounded = Math.round(amount * 100) / 100
    
    if (selectedCurrency === 'TZS' || selectedCurrency === 'UGX' || selectedCurrency === 'RWF' || selectedCurrency === 'BIF') {
      return `${currencyInfo.symbol} ${rounded.toLocaleString()}`
    }
    
    return `${currencyInfo.symbol}${rounded.toFixed(2)}`
  }

  const handleConfirmBooking = async () => {
    setIsProcessing(true)
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Convert held seats to occupied if payment succeeds
    if (lockId) {
      const converted = SeatLockService.convertToOccupied(lockId, 'PNR' + Date.now())
      if (!converted) {
        toast({
          title: "Booking Failed",
          description: "Failed to secure your seats. Please try again.",
          variant: "destructive"
        })
        setIsProcessing(false)
        return
      }
    }
    
    // Save ticket to local storage
    const savedTicket = ticketService.saveTicket(
      { booking, searchParams, selectedSeats },
      passengerDetails,
      paymentMethod.toUpperCase(),
      totalTZS,
      'TZS'
    )
    
    toast({
      title: "Booking Confirmed!",
      description: `Your ${booking.type} ticket has been booked successfully. PNR: ${savedTicket.pnr}. Seats: ${selectedSeats.join(', ')}`,
    })
    
    setIsProcessing(false)
    navigate('/dashboard')
  }

  return (
    <Layout>
      <div className="min-h-screen bg-brand-light">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Seat Selection
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Booking Details & Passenger Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Trip Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    {booking.type === 'bus' ? (
                      <BusIcon className="w-5 h-5 text-primary" />
                    ) : (
                      <TrainIcon className="w-5 h-5 text-primary" />
                    )}
                    <span>Trip Summary</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-lg">{booking.operator}</div>
                      <div className="text-muted-foreground flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {searchParams.from} → {searchParams.to}
                      </div>
                    </div>
                    <Badge variant="secondary">
                      ⭐ {booking.rating}
                    </Badge>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Departure</div>
                      <div className="font-medium">{booking.departureTime}</div>
                      <div className="text-sm text-muted-foreground">{searchParams.from}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Arrival</div>
                      <div className="font-medium">{booking.arrivalTime}</div>
                      <div className="text-sm text-muted-foreground">{searchParams.to}</div>
                    </div>
                  </div>
                  
                   <div className="flex items-center space-x-4 text-sm">
                     <div className="flex items-center">
                       <Clock className="w-4 h-4 mr-1 text-muted-foreground" />
                       {booking.duration}
                     </div>
                     <div>
                       {selectedSeats.length} seat{selectedSeats.length !== 1 ? 's' : ''}: {selectedSeats.join(', ')}
                     </div>
                   </div>
                </CardContent>
              </Card>

              {/* Passenger Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Passenger Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        placeholder="Enter full name"
                        value={passengerDetails.fullName}
                        onChange={(e) => setPassengerDetails(prev => ({ ...prev, fullName: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter email"
                        value={passengerDetails.email}
                        onChange={(e) => setPassengerDetails(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        placeholder="+255 xxx xxx xxx"
                        value={passengerDetails.phone}
                        onChange={(e) => setPassengerDetails(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="idNumber">ID Number *</Label>
                      <Input
                        id="idNumber"
                        placeholder="Enter ID number"
                        value={passengerDetails.idNumber}
                        onChange={(e) => setPassengerDetails(prev => ({ ...prev, idNumber: e.target.value }))}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant={paymentMethod === 'mpesa' ? 'default' : 'outline'}
                      className="h-16 flex-col space-y-2"
                      onClick={() => setPaymentMethod('mpesa')}
                    >
                      <Smartphone className="w-6 h-6" />
                      <span>M-Pesa</span>
                    </Button>
                    <Button
                      variant={paymentMethod === 'card' ? 'default' : 'outline'}
                      className="h-16 flex-col space-y-2"
                      onClick={() => setPaymentMethod('card')}
                    >
                      <CreditCard className="w-6 h-6" />
                      <span>Card</span>
                    </Button>
                  </div>
                  
                  <Separator />
                  
                  {/* Currency Selector */}
                  <div className="space-y-2">
                    <Label className="flex items-center space-x-2">
                      <Globe className="w-4 h-4" />
                      <span>Display Currency</span>
                    </Label>
                    <Select value={selectedCurrency} onValueChange={setSelectedCurrency} key="currency-select">
                      <SelectTrigger>
                        <SelectValue placeholder="Select Currency" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableCurrencies.map((currency) => (
                          <SelectItem key={currency.code} value={currency.code}>
                            <div className="flex items-center space-x-2">
                              <span>{currency.symbol}</span>
                              <span>{currency.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {selectedCurrency !== 'TZS' && (
                      <div className="text-xs text-muted-foreground">
                        {isLoadingRate ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 border border-primary border-t-transparent rounded-full animate-spin" />
                            <span>Fetching live exchange rate...</span>
                          </div>
                        ) : (
                          <div>
                            * Payment will be processed in TZS. Conversion is for display only.
                            <br />
                            Live rate: 1 TZS = {exchangeRate.toFixed(4)} {selectedCurrency}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Booking Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                   <div className="space-y-2">
                     <div className="flex justify-between">
                       <span>{booking.type} ticket × {selectedSeats.length}</span>
                       <span className="flex items-center space-x-1">
                         {isLoadingRate && <div className="w-3 h-3 border border-primary border-t-transparent rounded-full animate-spin" />}
                         <span>{formatAmount(convertedBasePrice * selectedSeats.length)}</span>
                       </span>
                     </div>
                     <div className="text-xs text-muted-foreground">
                       Seats: {selectedSeats.join(', ')}
                     </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Service fee</span>
                      <span>{formatAmount(convertedServiceFee)}</span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span className="flex items-center space-x-1">
                      {isLoadingRate && <div className="w-3 h-3 border border-primary border-t-transparent rounded-full animate-spin" />}
                      <span>{formatAmount(convertedTotal)}</span>
                    </span>
                  </div>
                  
                  {selectedCurrency !== 'TZS' && (
                    <div className="text-xs text-muted-foreground border-t pt-2">
                      <div className="flex justify-between">
                        <span>Actual charge (TZS):</span>
                        <span>TZS {totalTZS.toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                  
                  <Button 
                    className="w-full h-12"
                    onClick={handleConfirmBooking}
                    disabled={isProcessing || !passengerDetails.fullName || !passengerDetails.email || !passengerDetails.phone || !passengerDetails.idNumber}
                  >
                    {isProcessing ? 'Processing...' : 'Confirm & Pay'}
                  </Button>
                  
                  <div className="text-xs text-muted-foreground text-center">
                    By proceeding, you agree to our Terms and Conditions
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

export default BookingConfirm