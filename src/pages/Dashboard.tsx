import { useState } from "react"
import { BookingSearch } from "@/components/BookingSearch"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BusIcon, TrainIcon, MapPin, Clock, MoreVertical, Bell, Globe, Settings, Calendar } from "lucide-react"
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
    <div className="min-h-screen bg-brand-light">
      {/* Header */}
      <header className="bg-white border-b border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">ZS</span>
                </div>
                <span className="text-xl font-bold text-primary">Zed Safiri</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                <Globe className="w-4 h-4 mr-2" />
                English
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground">
                <Bell className="w-4 h-4" />
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">AK</span>
                </div>
                <div className="hidden md:block">
                  <div className="text-sm font-medium">Alex Kamau</div>
                  <div className="text-xs text-muted-foreground">Passenger</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <nav className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start text-primary bg-primary/10">
                      <Calendar className="w-4 h-4 mr-3" />
                      Home
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <Calendar className="w-4 h-4 mr-3" />
                      Bookings
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <Settings className="w-4 h-4 mr-3" />
                      Settings
                    </Button>
                  </nav>
                </CardContent>
              </Card>

              {/* Upcoming Bookings Widget */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Upcoming</CardTitle>
                    <Badge variant="secondary">{upcomingBookings.length}</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">Bookings</div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  {upcomingBookings.length > 0 ? (
                    <div className="space-y-3">
                      {upcomingBookings.slice(0, 2).map((booking) => (
                        <div key={booking.id} className="flex items-center space-x-3 text-sm">
                          {booking.type === 'bus' ? (
                            <BusIcon className="w-4 h-4 text-primary flex-shrink-0" />
                          ) : (
                            <TrainIcon className="w-4 h-4 text-primary flex-shrink-0" />
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="font-medium truncate">{booking.route}</div>
                            <div className="text-muted-foreground">{booking.date}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-sm text-muted-foreground py-4">
                      No upcoming bookings
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Welcome Section */}
            <div className="relative">
              <div className="bg-gradient-to-r from-blue-400 to-blue-600 rounded-3xl p-8 text-white">
                <div className="relative z-10">
                  <h1 className="text-3xl font-bold mb-2">
                    Hi Alex 👋
                  </h1>
                  <p className="text-blue-100 text-lg">
                    Good to have you back!
                  </p>
                </div>
                {/* Decorative waves */}
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-blue-500/20 to-transparent rounded-b-3xl"></div>
              </div>
            </div>

            {/* Booking Search */}
            <BookingSearch onSearch={handleSearch} />

            {/* Recent Bookings */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                {mockRecentBookings.length > 0 ? (
                  <div className="space-y-4">
                    {mockRecentBookings.map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center space-x-4">
                          {booking.type === 'bus' ? (
                            <BusIcon className="w-5 h-5 text-primary" />
                          ) : (
                            <TrainIcon className="w-5 h-5 text-primary" />
                          )}
                          <div>
                            <div className="font-medium">{booking.operator}</div>
                            <div className="text-sm text-muted-foreground flex items-center">
                              <MapPin className="w-3 h-3 mr-1" />
                              {booking.route}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="font-medium">KSh {booking.price.toLocaleString()}</div>
                            <div className="text-sm text-muted-foreground">{booking.date}</div>
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
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No recent bookings</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard