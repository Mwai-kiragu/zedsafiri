import { useState } from "react"
import { BookingSearch } from "@/components/BookingSearch"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BusIcon, TrainIcon, MapPin, MoreVertical, Bell, Globe, Settings, Home, Calendar } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface SearchData {
  type: 'bus' | 'train'
  from: string
  to: string
  departureDate: Date | undefined
  returnDate?: Date | undefined
  passengers: number
}

interface RecentBooking {
  id: string
  type: 'bus' | 'train'
  operator: string
  route: string
  date: string
  status: 'confirmed' | 'pending' | 'cancelled'
  price: number
}

const mockRecentBookings: RecentBooking[] = [
  {
    id: '1',
    type: 'bus',
    operator: 'Modern Coast',
    route: 'Nairobi → Mombasa',
    date: 'Dec 25, 2024',
    status: 'confirmed',
    price: 1500
  },
  {
    id: '2',
    type: 'train',
    operator: 'Kenya Railways',
    route: 'Nairobi → Kisumu',
    date: 'Dec 20, 2024',
    status: 'pending',
    price: 800
  }
]

const Dashboard = () => {
  const navigate = useNavigate()
  const [upcomingBookings] = useState(mockRecentBookings.filter(b => b.status !== 'cancelled'))

  const handleSearch = (searchData: SearchData) => {
    const searchParams = new URLSearchParams({
      from: searchData.from,
      to: searchData.to,
      date: searchData.departureDate?.toISOString() || '',
      type: searchData.type,
      passengers: searchData.passengers.toString()
    })
    navigate(`/search/results?${searchParams.toString()}`)
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      confirmed: 'default',
      pending: 'secondary',
      cancelled: 'destructive'
    } as const
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold">
                <span className="text-red-500">zed</span>
                <span className="text-blue-600"> safiri</span>
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-blue-600 border border-blue-200">
                <Globe className="w-4 h-4 mr-2" />
                English
              </Button>
              <Button variant="ghost" size="icon">
                <Bell className="w-5 h-5 text-gray-600" />
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">AK</span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">Alex Kamau</div>
                  <div className="text-xs text-gray-500">Passenger</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white h-screen p-6 border-r">
          <nav className="space-y-1">
            <Button variant="ghost" className="w-full justify-start bg-blue-50 text-blue-600 font-medium">
              <Home className="w-4 h-4 mr-3" />
              Home
            </Button>
            <Button variant="ghost" className="w-full justify-start text-gray-600">
              <Calendar className="w-4 h-4 mr-3" />
              Bookings
            </Button>
            <Button variant="ghost" className="w-full justify-start text-gray-600">
              <Settings className="w-4 h-4 mr-3" />
              Settings
            </Button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-start mb-8">
              <div>
                {/* Welcome Section */}
                <div className="mb-8">
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    Hi Alex 👋
                  </h1>
                  <p className="text-lg text-gray-600">
                    Good to have you back!
                  </p>
                </div>
              </div>
              
              {/* Upcoming Bookings Counter */}
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-1">{upcomingBookings.length}</div>
                <div className="text-sm text-gray-600">
                  <div>Upcoming</div>
                  <div>Bookings</div>
                </div>
              </div>
            </div>

            {/* Booking Search */}
            <BookingSearch onSearch={handleSearch} />

            {/* Recent Bookings */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Bookings</h2>
              {mockRecentBookings.length > 0 ? (
                <div className="space-y-4">
                  {mockRecentBookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                      <div className="flex items-center space-x-4">
                        {booking.type === 'bus' ? (
                          <BusIcon className="w-5 h-5 text-blue-600" />
                        ) : (
                          <TrainIcon className="w-5 h-5 text-blue-600" />
                        )}
                        <div>
                          <div className="font-semibold text-gray-900">{booking.operator}</div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {booking.route}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">KSh {booking.price.toLocaleString()}</div>
                          <div className="text-sm text-gray-500">{booking.date}</div>
                        </div>
                        {getStatusBadge(booking.status)}
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No recent bookings</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard