import { useSearchParams, useNavigate } from "react-router-dom"
import { SearchResults as SearchResultsComponent } from "@/components/SearchResults"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

const SearchResults = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const searchData = {
    from: searchParams.get('from') || '',
    to: searchParams.get('to') || '',
    departureDate: searchParams.get('date') || '',
    type: (searchParams.get('type') as 'bus' | 'train') || 'bus',
    passengers: parseInt(searchParams.get('passengers') || '1')
  }

  return (
    <div className="min-h-screen bg-brand-light">
      {/* Header */}
      <header className="bg-white border-b border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate('/dashboard')}
                className="mr-2"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">ZS</span>
                </div>
                <span className="text-xl font-bold text-primary">Zed Safiri</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SearchResultsComponent searchParams={searchData} />
      </div>
    </div>
  )
}

export default SearchResults