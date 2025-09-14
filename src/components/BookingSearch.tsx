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
    <div className="w-full bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-8 shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Book Your Next Trip</h2>
      </div>

      <div className="space-y-6">
        {/* Transport Type Selector */}
        <div className="flex space-x-2">
          <Button
            onClick={() => setSearchData(prev => ({ ...prev, type: 'bus' }))}
            className={cn(
              "px-6 py-3 rounded-lg font-medium transition-colors",
              searchData.type === 'bus'
                ? "bg-white text-blue-600"
                : "bg-white/20 text-white hover:bg-white/30"
            )}
          >
            <BusIcon className="w-4 h-4 mr-2" />
            Bus
          </Button>
          <Button
            onClick={() => setSearchData(prev => ({ ...prev, type: 'train' }))}
            className={cn(
              "px-6 py-3 rounded-lg font-medium transition-colors",
              searchData.type === 'train'
                ? "bg-white text-blue-600"
                : "bg-white/20 text-white hover:bg-white/30"
            )}
          >
            <TrainIcon className="w-4 h-4 mr-2" />
            Train
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* From Location */}
          <div className="lg:col-span-1">
            <Select value={searchData.from} onValueChange={(value) => setSearchData(prev => ({ ...prev, from: value }))}>
              <SelectTrigger className="bg-white border-0 h-12 text-gray-700">
                <SelectValue placeholder="From" />
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* To Location */}
          <div className="lg:col-span-1">
            <Select value={searchData.to} onValueChange={(value) => setSearchData(prev => ({ ...prev, to: value }))}>
              <SelectTrigger className="bg-white border-0 h-12 text-gray-700">
                <SelectValue placeholder="To" />
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Departure Date */}
          <div className="lg:col-span-1">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full h-12 justify-start text-left font-normal bg-white border-0 text-gray-700"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {searchData.departureDate ? format(searchData.departureDate, "MM/dd/yyyy") : <span>mm/dd/yyyy</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={searchData.departureDate}
                  onSelect={(date) => setSearchData(prev => ({ ...prev, departureDate: date }))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Return Date */}
          <div className="lg:col-span-1">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full h-12 justify-start text-left font-normal bg-white border-0 text-gray-700"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {searchData.returnDate ? format(searchData.returnDate, "MM/dd/yyyy") : <span>mm/dd/yyyy</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={searchData.returnDate}
                  onSelect={(date) => setSearchData(prev => ({ ...prev, returnDate: date }))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Search Button */}
          <div className="lg:col-span-1">
            <Button 
              onClick={handleSearch}
              className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg"
              disabled={!searchData.from || !searchData.to || !searchData.departureDate}
            >
              Search
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}