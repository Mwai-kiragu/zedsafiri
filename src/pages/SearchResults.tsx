import { useSearchParams, useNavigate } from "react-router-dom"
import { SearchResults as SearchResultsComponent } from "@/components/SearchResults"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Layout from "@/components/Layout"

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
    <Layout>
      <div className="min-h-screen bg-brand-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/dashboard')}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
          <SearchResultsComponent searchParams={searchData} />
        </div>
      </div>
    </Layout>
  )
}

export default SearchResults