import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, XCircle, Clock, Users, TestTube, RefreshCw } from "lucide-react"
import { SeatLockService } from "@/services/seatLockService"
import { SeatConfigService } from "@/services/seatConfigService"
import { useToast } from "@/hooks/use-toast"

interface TestResult {
  id: string
  name: string
  status: 'pending' | 'running' | 'passed' | 'failed'
  description: string
  error?: string
  duration?: number
}

const SeatLockTestSuite = () => {
  const { toast } = useToast()
  const [tests, setTests] = useState<TestResult[]>([
    {
      id: 'layout_test',
      name: 'Seat Map Layout Test',
      description: 'Verify seat map loads correct layout for different trip classes',
      status: 'pending'
    },
    {
      id: 'occupied_seats_test',
      name: 'Occupied Seats Test', 
      description: 'Verify users cannot select pre-occupied seats',
      status: 'pending'
    },
    {
      id: 'seat_locking_test',
      name: 'Seat Locking Test',
      description: 'Verify seats are locked when selected by a passenger',
      status: 'pending'
    },
    {
      id: 'ttl_expiry_test',
      name: 'TTL Expiration Test',
      description: 'Verify seat locks expire after configured TTL duration',
      status: 'pending'
    },
    {
      id: 'cancel_booking_test',
      name: 'Cancel Booking Test',
      description: 'Verify locks are released when passenger cancels booking',
      status: 'pending'
    },
    {
      id: 'concurrency_test',
      name: 'Concurrency Test',
      description: 'Verify two users cannot hold the same seat simultaneously',
      status: 'pending'
    },
    {
      id: 'seat_switching_test',
      name: 'Seat Switching Test',
      description: 'Verify locks are updated correctly when changing seat selection',
      status: 'pending'
    }
  ])

  const [isRunning, setIsRunning] = useState(false)
  const [currentTestIndex, setCurrentTestIndex] = useState(0)

  // Test trip configurations
  const testTrips = {
    economy: {
      id: 'TR123',
      routeId: 'dar_dodoma',
      operatorId: 'scandinavian_express',
      vehicleId: 'vehicle_scandinavian_express_1',
      origin: 'Dar es Salaam',
      destination: 'Dodoma',
      departureTime: '2024-01-01 08:00',
      arrivalTime: '2024-01-01 14:00',
      class: 'Economy' as const,
      status: 'Scheduled' as const,
      baseFare: 18000,
      seatsAvailable: 35,
      totalSeats: 48
    },
    business: {
      id: 'TR124',
      routeId: 'dar_dodoma',
      operatorId: 'royal_coach',
      vehicleId: 'vehicle_royal_coach_1',
      origin: 'Dar es Salaam',
      destination: 'Dodoma',
      departureTime: '2024-01-01 09:00',
      arrivalTime: '2024-01-01 15:00',
      class: 'Business' as const,
      status: 'Scheduled' as const,
      baseFare: 25000,
      seatsAvailable: 25,
      totalSeats: 35
    },
    royal: {
      id: 'TR125',
      routeId: 'dar_dodoma',
      operatorId: 'royal_coach',
      vehicleId: 'vehicle_royal_coach_2',
      origin: 'Dar es Salaam',
      destination: 'Dodoma',
      departureTime: '2024-01-01 10:00',
      arrivalTime: '2024-01-01 16:00',
      class: 'Royal' as const,
      status: 'Scheduled' as const,
      baseFare: 35000,
      seatsAvailable: 20,
      totalSeats: 28
    }
  }

  const updateTestStatus = (testId: string, status: TestResult['status'], error?: string, duration?: number) => {
    setTests(prev => prev.map(test => 
      test.id === testId 
        ? { ...test, status, error, duration }
        : test
    ))
  }

  const runTest = async (testId: string): Promise<boolean> => {
    updateTestStatus(testId, 'running')
    const startTime = Date.now()
    
    try {
      switch (testId) {
        case 'layout_test':
          return await testSeatMapLayout()
        case 'occupied_seats_test':
          return await testOccupiedSeats()
        case 'seat_locking_test':
          return await testSeatLocking()
        case 'ttl_expiry_test':
          return await testTTLExpiry()
        case 'cancel_booking_test':
          return await testCancelBooking()
        case 'concurrency_test':
          return await testConcurrency()
        case 'seat_switching_test':
          return await testSeatSwitching()
        default:
          throw new Error('Unknown test')
      }
    } catch (error) {
      const duration = Date.now() - startTime
      updateTestStatus(testId, 'failed', String(error), duration)
      return false
    }
  }

  const testSeatMapLayout = async (): Promise<boolean> => {
    // Test 1: Verify different classes have different layouts
    const economyLayout = SeatConfigService.getLayoutForTrip(testTrips.economy)
    const businessLayout = SeatConfigService.getLayoutForTrip(testTrips.business)
    const royalLayout = SeatConfigService.getLayoutForTrip(testTrips.royal)

    if (economyLayout.totalSeats <= businessLayout.totalSeats || 
        businessLayout.totalSeats <= royalLayout.totalSeats) {
      throw new Error('Seat counts should decrease: Economy > Business > Royal')
    }

    if (economyLayout.class !== 'Economy' || 
        businessLayout.class !== 'Business' || 
        royalLayout.class !== 'Royal') {
      throw new Error('Layout classes do not match trip classes')
    }

    // Test that TR123 has seat 1A marked as occupied (test precondition)
    SeatLockService.initializeSeats(testTrips.economy.id, testTrips.economy)
    const seatStatus = SeatLockService.getSeatStatus(testTrips.economy.id)
    if (seatStatus.get(`${testTrips.economy.id}-1A`) !== 'OCCUPIED') {
      throw new Error('Test seat 1A should be pre-occupied for TR123')
    }

    updateTestStatus('layout_test', 'passed', undefined, Date.now() - Date.now())
    return true
  }

  const testOccupiedSeats = async (): Promise<boolean> => {
    const tripId = testTrips.economy.id
    SeatLockService.initializeSeats(tripId, testTrips.economy)
    
    // Mark additional test seat as occupied
    SeatLockService.markSeatOccupied(tripId, '2A')
    
    // Try to hold occupied seat - should fail
    const result = await SeatLockService.holdSeats(tripId, [`${tripId}-1A`], 'user_test_1')
    if (result.success) {
      throw new Error('Should not be able to hold occupied seat 1A')
    }

    // Try to hold another occupied seat - should fail
    const result2 = await SeatLockService.holdSeats(tripId, [`${tripId}-2A`], 'user_test_1')
    if (result2.success) {
      throw new Error('Should not be able to hold occupied seat 2A')
    }

    updateTestStatus('occupied_seats_test', 'passed', undefined, Date.now() - Date.now())
    return true
  }

  const testSeatLocking = async (): Promise<boolean> => {
    const tripId = testTrips.economy.id
    SeatLockService.initializeSeats(tripId, testTrips.economy)
    
    // User A selects seat 3A
    const resultA = await SeatLockService.holdSeats(tripId, [`${tripId}-3A`], 'user_a')
    if (!resultA.success || !resultA.lockId) {
      throw new Error('User A should be able to hold free seat 3A')
    }

    // User B tries to select same seat - should fail
    const resultB = await SeatLockService.holdSeats(tripId, [`${tripId}-3A`], 'user_b')
    if (resultB.success) {
      throw new Error('User B should not be able to hold seat 3A already held by User A')
    }

    // Verify seat status is HELD
    const seatStatus = SeatLockService.getSeatStatus(tripId)
    if (seatStatus.get(`${tripId}-3A`) !== 'HELD') {
      throw new Error('Seat 3A should show status HELD')
    }

    updateTestStatus('seat_locking_test', 'passed', undefined, Date.now() - Date.now())
    return true
  }

  const testTTLExpiry = async (): Promise<boolean> => {
    const tripId = testTrips.business.id
    SeatLockService.initializeSeats(tripId, testTrips.business)
    
    // Hold seat with short TTL for testing (we'll simulate expiry)
    const result = await SeatLockService.holdSeats(tripId, [`${tripId}-1B`], 'user_ttl_test')
    if (!result.success || !result.lockId) {
      throw new Error('Should be able to hold seat for TTL test')
    }

    const lockId = result.lockId
    
    // Simulate TTL expiry by waiting a short time
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // Manually trigger lock expiration (simulating TTL timeout)
    SeatLockService['expireLock'](lockId)
    
    // Verify seat is now free
    const seatStatus = SeatLockService.getSeatStatus(tripId)
    if (seatStatus.get(`${tripId}-1B`) !== 'FREE') {
      throw new Error('Seat should be FREE after lock expiry')
    }

    // Another user should now be able to hold it
    const result2 = await SeatLockService.holdSeats(tripId, [`${tripId}-1B`], 'user_after_expiry')
    if (!result2.success) {
      throw new Error('Should be able to hold seat after previous lock expired')
    }

    updateTestStatus('ttl_expiry_test', 'passed', undefined, Date.now() - Date.now())
    return true
  }

  const testCancelBooking = async (): Promise<boolean> => {
    const tripId = testTrips.royal.id
    SeatLockService.initializeSeats(tripId, testTrips.royal)
    
    // User holds seats
    const result = await SeatLockService.holdSeats(tripId, [`${tripId}-1A`, `${tripId}-1B`], 'user_cancel_test')
    if (!result.success) {
      throw new Error('Should be able to hold seats initially')
    }

    // Verify seats are held
    const statusBefore = SeatLockService.getSeatStatus(tripId)
    if (statusBefore.get(`${tripId}-1A`) !== 'HELD' || statusBefore.get(`${tripId}-1B`) !== 'HELD') {
      throw new Error('Seats should be HELD before cancellation')
    }

    // User cancels booking
    const canceled = SeatLockService.cancelBooking('user_cancel_test')
    if (!canceled) {
      throw new Error('Cancel booking should return true')
    }

    // Verify seats are free
    const statusAfter = SeatLockService.getSeatStatus(tripId)
    if (statusAfter.get(`${tripId}-1A`) !== 'FREE' || statusAfter.get(`${tripId}-1B`) !== 'FREE') {
      throw new Error('Seats should be FREE after cancellation')
    }

    updateTestStatus('cancel_booking_test', 'passed', undefined, Date.now() - Date.now())
    return true
  }

  const testConcurrency = async (): Promise<boolean> => {
    const tripId = testTrips.economy.id
    SeatLockService.initializeSeats(tripId, testTrips.economy)
    
    // Simulate near-simultaneous requests
    const promises = [
      SeatLockService.holdSeats(tripId, [`${tripId}-5A`], 'user_concurrent_1'),
      SeatLockService.holdSeats(tripId, [`${tripId}-5A`], 'user_concurrent_2')
    ]

    const results = await Promise.all(promises)
    
    // Only one should succeed
    const successCount = results.filter(r => r.success).length
    if (successCount !== 1) {
      throw new Error(`Expected exactly 1 success, got ${successCount}`)
    }

    // One should fail with conflict
    const failureCount = results.filter(r => !r.success && r.conflictSeats?.length).length
    if (failureCount !== 1) {
      throw new Error(`Expected exactly 1 failure with conflicts, got ${failureCount}`)
    }

    updateTestStatus('concurrency_test', 'passed', undefined, Date.now() - Date.now())
    return true
  }

  const testSeatSwitching = async (): Promise<boolean> => {
    const tripId = testTrips.business.id
    SeatLockService.initializeSeats(tripId, testTrips.business)
    
    // User selects seat 1C
    const result1 = await SeatLockService.holdSeats(tripId, [`${tripId}-1C`], 'user_switch')
    if (!result1.success) {
      throw new Error('Should be able to hold initial seat')
    }

    // User changes to seat 2C (releases 1C, holds 2C)
    const result2 = await SeatLockService.holdSeats(tripId, [`${tripId}-2C`], 'user_switch')
    if (!result2.success) {
      throw new Error('Should be able to switch to new seat')
    }

    // Verify 1C is free and 2C is held
    const seatStatus = SeatLockService.getSeatStatus(tripId)
    if (seatStatus.get(`${tripId}-1C`) !== 'FREE') {
      throw new Error('Previous seat 1C should be FREE after switching')
    }
    if (seatStatus.get(`${tripId}-2C`) !== 'HELD') {
      throw new Error('New seat 2C should be HELD after switching')
    }

    updateTestStatus('seat_switching_test', 'passed', undefined, Date.now() - Date.now())
    return true
  }

  const runAllTests = async () => {
    setIsRunning(true)
    setCurrentTestIndex(0)
    
    for (let i = 0; i < tests.length; i++) {
      setCurrentTestIndex(i)
      const test = tests[i]
      const passed = await runTest(test.id)
      
      if (!passed) {
        break // Stop on first failure
      }
      
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500))
    }
    
    setIsRunning(false)
    toast({
      title: "Test Suite Complete",
      description: `${tests.filter(t => t.status === 'passed').length}/${tests.length} tests passed`,
    })
  }

  const resetTests = () => {
    setTests(prev => prev.map(test => ({
      ...test,
      status: 'pending' as const,
      error: undefined,
      duration: undefined
    })))
    setCurrentTestIndex(0)
  }

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />
      case 'running':
        return <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      default:
        return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold flex items-center justify-center gap-2">
          <TestTube className="w-6 h-6" />
          Seat Locking Test Suite
        </h1>
        <p className="text-muted-foreground">
          Comprehensive testing of LATRA-compliant seat locking functionality
        </p>
      </div>

      {/* Control Panel */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 justify-center">
            <Button onClick={runAllTests} disabled={isRunning} size="lg">
              {isRunning ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  Running Tests...
                </>
              ) : (
                'Run All Tests'
              )}
            </Button>
            <Button onClick={resetTests} variant="outline" disabled={isRunning}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      <div className="space-y-4">
        {tests.map((test, index) => (
          <Card key={test.id} className={`${isRunning && index === currentTestIndex ? 'ring-2 ring-blue-500' : ''}`}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(test.status)}
                  <span>{test.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  {test.duration && (
                    <Badge variant="outline">{test.duration}ms</Badge>
                  )}
                  <Badge variant={
                    test.status === 'passed' ? 'default' : 
                    test.status === 'failed' ? 'destructive' :
                    test.status === 'running' ? 'secondary' : 'outline'
                  }>
                    {test.status}
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{test.description}</p>
              {test.error && (
                <Alert className="mt-2" variant="destructive">
                  <AlertDescription>{test.error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Test Trip Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Test Trip Configurations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div><strong>TR123 (Economy):</strong> Scandinavian Express - Seat 1A pre-occupied</div>
          <div><strong>TR124 (Business):</strong> Royal Coach - Clean slate for testing</div>
          <div><strong>TR125 (Royal):</strong> Royal Coach - Premium layout testing</div>
          <Separator className="my-2" />
          <div className="text-muted-foreground">
            Tests simulate real passenger behavior including concurrent bookings, 
            seat switching, cancellations, and TTL expiry scenarios.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default SeatLockTestSuite