import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { BusIcon, TrainIcon, Clock, MapPin, Users, Wifi, Monitor, Coffee } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface SearchResult {
  id: string
  type: 'bus' | 'train'
  operator: string
  departureTime: string
  arrivalTime: string
  duration: string
  price: number
  seatsAvailable: number
  amenities: string[]
  rating: number
}

interface SearchResultsProps {
  searchParams: {
    from: string
    to: string
    departureDate: string
    type: 'bus' | 'train'
    passengers: number
  }
}

// Mock data for demonstration - Tanzanian operators and routes
const mockResults: SearchResult[] = [
  {
    id: '1',
    type: 'bus',
    operator: 'Kilimanjaro Express',
    departureTime: '06:00',
    arrivalTime: '12:30',
    duration: '6h 30m',
    price: 32000,
    seatsAvailable: 8,
    amenities: ['wifi', 'ac', 'charging'],
    rating: 4.5
  },
  {
    id: '2',
    type: 'bus',
    operator: 'Scandinavian Express',
    departureTime: '08:15',
    arrivalTime: '14:45',
    duration: '6h 30m',
    price: 35000,
    seatsAvailable: 5,
    amenities: ['wifi', 'ac', 'entertainment', 'snacks'],
    rating: 4.8
  },
  {
    id: '3',
    type: 'train',
    operator: 'Tanzania Railways Corporation (TRC)',
    departureTime: '07:00',
    arrivalTime: '15:00',
    duration: '8h 00m',
    price: 25000,
    seatsAvailable: 12,
    amenities: ['wifi', 'dining'],
    rating: 4.2
  },
  {
    id: '4',
    type: 'bus',
    operator: 'Fresh Ya Shamba',
    departureTime: '14:00',
    arrivalTime: '20:30',
    duration: '6h 30m',
    price: 30000,
    seatsAvailable: 3,
    amenities: ['ac', 'charging'],
    rating: 4.3
  },
  {
    id: '5',
    type: 'train',
    operator: 'Standard Gauge Railway (SGR)',
    departureTime: '09:30',
    arrivalTime: '16:30',
    duration: '7h 00m',
    price: 40000,
    seatsAvailable: 18,
    amenities: ['wifi', 'entertainment', 'dining', 'ac'],
    rating: 4.7
  }
]

const getAmenityIcon = (amenity: string) => {
  switch (amenity) {
    case 'wifi': return <Wifi className="w-4 h-4" />
    case 'ac': return <div className="w-4 h-4 text-xs font-bold">AC</div>
    case 'entertainment': return <Monitor className="w-4 h-4" />
    case 'snacks': 
    case 'dining': return <Coffee className="w-4 h-4" />
    case 'charging': return <div className="w-4 h-4 text-xs font-bold">⚡</div>
    default: return null
  }
}

export const SearchResults = ({ searchParams }: SearchResultsProps) => {
  const [selectedResult, setSelectedResult] = useState<string | null>(null)
  const navigate = useNavigate()

  const filteredResults = mockResults.filter(result => result.type === searchParams.type)

  const handleBookNow = (resultId: string) => {
    const result = filteredResults.find(r => r.id === resultId)
    if (result) {
      navigate('/booking/confirm', { 
        state: { 
          booking: result, 
          searchParams 
        } 
      })
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {searchParams.from} → {searchParams.to}
            </h1>
            <p className="text-muted-foreground">
              {searchParams.departureDate} • {searchParams.passengers} passenger{searchParams.passengers > 1 ? 's' : ''}
            </p>
          </div>
          <Badge variant="secondary" className="text-sm">
            {filteredResults.length} {searchParams.type === 'bus' ? 'buses' : 'trains'} available
          </Badge>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        {filteredResults.map((result) => (
          <Card key={result.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {result.type === 'bus' ? (
                    <BusIcon className="w-6 h-6 text-primary" />
                  ) : (
                    <TrainIcon className="w-6 h-6 text-primary" />
                  )}
                  <div>
                    <h3 className="font-semibold text-lg">{result.operator}</h3>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <span className="flex items-center">
                        ⭐ {result.rating}
                      </span>
                      <Separator orientation="vertical" className="h-4" />
                      <span className="flex items-center">
                        <Users className="w-3 h-3 mr-1" />
                        {result.seatsAvailable} seats left
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">
                    TZS {result.price.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">per person</div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Time Info */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-center">
                      <div className="text-xl font-bold">{result.departureTime}</div>
                      <div className="text-sm text-muted-foreground flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {searchParams.from}
                      </div>
                    </div>
                    <div className="flex-1 px-4">
                      <div className="text-center text-sm text-muted-foreground flex items-center justify-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {result.duration}
                      </div>
                      <div className="w-full h-px bg-border mt-1"></div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold">{result.arrivalTime}</div>
                      <div className="text-sm text-muted-foreground flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {searchParams.to}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Amenities */}
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Amenities</div>
                  <div className="flex flex-wrap gap-2">
                    {result.amenities.map((amenity) => (
                      <div 
                        key={amenity}
                        className="flex items-center space-x-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs"
                      >
                        {getAmenityIcon(amenity)}
                        <span className="capitalize">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <div className="flex items-end justify-end">
                  <Button 
                    onClick={() => handleBookNow(result.id)}
                    className="w-full md:w-auto px-6"
                    disabled={result.seatsAvailable === 0}
                  >
                    {result.seatsAvailable === 0 ? 'Sold Out' : 'Book Now'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredResults.length === 0 && (
        <Card className="p-8 text-center">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">No {searchParams.type}s available</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or selecting a different date.
            </p>
          </div>
        </Card>
      )}
    </div>
  )
}