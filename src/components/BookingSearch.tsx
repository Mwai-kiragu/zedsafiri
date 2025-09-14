import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, BusIcon, TrainIcon, ArrowRightLeft } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface BookingSearchProps {
  onSearch?: (data: SearchData) => void
}

interface SearchData {
  type: 'bus' | 'train'
  from: string
  to: string
  departureDate: Date | undefined
  returnDate?: Date | undefined
  passengers: number
}

const cities = [
  "Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret", 
  "Thika", "Malindi", "Garissa", "Kakamega", "Kitale"
]

export const BookingSearch = ({ onSearch }: BookingSearchProps) => {
  const [searchData, setSearchData] = useState<SearchData>({
    type: 'bus',
    from: '',
    to: '',
    departureDate: undefined,
    returnDate: undefined,
    passengers: 1
  })

  const handleSearch = () => {
    if (searchData.from && searchData.to && searchData.departureDate) {
      onSearch?.(searchData)
    }
  }

  const swapLocations = () => {
    setSearchData(prev => ({
      ...prev,
      from: prev.to,
      to: prev.from
    }))
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-gradient-to-br from-primary to-brand-dark rounded-3xl shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Book Your Next Trip</h2>
        <p className="text-blue-100">Search and book bus or train tickets conveniently</p>
      </div>

      <div className="space-y-6">
        {/* Transport Type Selector */}
        <Tabs 
          value={searchData.type} 
          onValueChange={(value) => setSearchData(prev => ({ ...prev, type: value as 'bus' | 'train' }))}
          className="w-full"
        >
          <TabsList className="grid w-fit grid-cols-2 bg-white/10 border-white/20">
            <TabsTrigger value="bus" className="data-[state=active]:bg-white data-[state=active]:text-primary">
              <BusIcon className="w-4 h-4 mr-2" />
              Bus
            </TabsTrigger>
            <TabsTrigger value="train" className="data-[state=active]:bg-white data-[state=active]:text-primary">
              <TrainIcon className="w-4 h-4 mr-2" />
              Train
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* From Location */}
          <div className="space-y-2">
            <Label htmlFor="from" className="text-white font-medium">From</Label>
            <Select value={searchData.from} onValueChange={(value) => setSearchData(prev => ({ ...prev, from: value }))}>
              <SelectTrigger className="bg-white border-white/20 h-12">
                <SelectValue placeholder="Select departure city" />
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Swap Button */}
          <div className="hidden lg:flex items-end justify-center pb-3">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={swapLocations}
              className="text-white hover:bg-white/10 rounded-full h-8 w-8"
            >
              <ArrowRightLeft className="h-4 w-4" />
            </Button>
          </div>

          {/* To Location */}
          <div className="space-y-2">
            <Label htmlFor="to" className="text-white font-medium">To</Label>
            <Select value={searchData.to} onValueChange={(value) => setSearchData(prev => ({ ...prev, to: value }))}>
              <SelectTrigger className="bg-white border-white/20 h-12">
                <SelectValue placeholder="Select destination city" />
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Departure Date */}
          <div className="space-y-2">
            <Label className="text-white font-medium">Departure Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full h-12 justify-start text-left font-normal bg-white border-white/20",
                    !searchData.departureDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {searchData.departureDate ? format(searchData.departureDate, "MMM dd, yyyy") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={searchData.departureDate}
                  onSelect={(date) => setSearchData(prev => ({ ...prev, departureDate: date }))}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Return Date */}
          <div className="space-y-2">
            <Label className="text-white font-medium">Return Date (Optional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full h-12 justify-start text-left font-normal bg-white border-white/20",
                    !searchData.returnDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {searchData.returnDate ? format(searchData.returnDate, "MMM dd, yyyy") : <span>Return date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={searchData.returnDate}
                  onSelect={(date) => setSearchData(prev => ({ ...prev, returnDate: date }))}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Passengers */}
          <div className="space-y-2">
            <Label htmlFor="passengers" className="text-white font-medium">Passengers</Label>
            <Select 
              value={searchData.passengers.toString()} 
              onValueChange={(value) => setSearchData(prev => ({ ...prev, passengers: parseInt(value) }))}
            >
              <SelectTrigger className="bg-white border-white/20 h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1,2,3,4,5,6,7,8].map((num) => (
                  <SelectItem key={num} value={num.toString()}>{num} {num === 1 ? 'Passenger' : 'Passengers'}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Search Button */}
        <div className="flex justify-center pt-4">
          <Button 
            onClick={handleSearch}
            className="w-full md:w-auto px-8 py-3 h-12 bg-white text-primary hover:bg-gray-50 font-semibold text-lg"
            disabled={!searchData.from || !searchData.to || !searchData.departureDate}
          >
            Search {searchData.type === 'bus' ? 'Buses' : 'Trains'}
          </Button>
        </div>
      </div>
    </div>
  )
}