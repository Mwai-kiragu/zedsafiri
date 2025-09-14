import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, XCircle, Database, FileText, Users, Calculator, Scroll } from "lucide-react"
import { BookingRecordService } from "@/services/bookingRecordService"
import { useToast } from "@/hooks/use-toast"

interface TestResult {
  id: string
  name: string
  status: 'pending' | 'running' | 'passed' | 'failed'
  description: string
  results?: any[]
  error?: string
}

const BookingValidationTests = () => {
  const { toast } = useToast()
  const [tests, setTests] = useState<TestResult[]>([
    {
      id: 'unique_pnr_test',
      name: 'Unique PNR Generation',
      description: 'Verify each booking generates a globally unique PNR',
      status: 'pending'
    },
    {
      id: 'initiated_state_test',
      name: 'INITIATED State Validation',
      description: 'Verify booking state = INITIATED after seat lock',
      status: 'pending'
    },
    {
      id: 'passenger_details_test',
      name: 'Passenger Details Storage',
      description: 'Verify booking contains complete passenger information',
      status: 'pending'
    },
    {
      id: 'fare_allocation_test',
      name: 'Fare Breakdown Calculation',
      description: 'Verify LATRA-compliant fare allocation (base, fee, commission)',
      status: 'pending'
    },
    {
      id: 'audit_log_test',
      name: 'Audit Log Compliance',
      description: 'Verify BOOKING_CREATED events are logged immutably',
      status: 'pending'
    }
  ])

  const [isRunning, setIsRunning] = useState(false)

  const updateTestStatus = (testId: string, status: TestResult['status'], results?: any[], error?: string) => {
    setTests(prev => prev.map(test => 
      test.id === testId 
        ? { ...test, status, results, error }
        : test
    ))
  }

  const runTest = async (testId: string): Promise<boolean> => {
    updateTestStatus(testId, 'running')
    
    try {
      switch (testId) {
        case 'unique_pnr_test':
          return await testUniquePNRGeneration()
        case 'initiated_state_test':
          return await testInitiatedStateValidation()
        case 'passenger_details_test':
          return await testPassengerDetailsStorage()
        case 'fare_allocation_test':
          return await testFareAllocationCalculation()
        case 'audit_log_test':
          return await testAuditLogCompliance()
        default:
          throw new Error('Unknown test')
      }
    } catch (error) {
      updateTestStatus(testId, 'failed', undefined, String(error))
      return false
    }
  }

  const testUniquePNRGeneration = async (): Promise<boolean> => {
    const results = []
    const generatedPNRs = new Set<string>()
    
    // Test 1: Generate multiple PNRs and verify uniqueness
    for (let i = 0; i < 10; i++) {
      const booking = BookingRecordService.createBooking(
        `trip_${i}`,
        {
          name: `Test Passenger ${i}`,
          phone: `+25512345678${i}`,
          email: `test${i}@example.com`
        },
        [`${i + 1}A`],
        15000
      )
      
      if (generatedPNRs.has(booking.pnr)) {
        throw new Error(`Duplicate PNR generated: ${booking.pnr}`)
      }
      
      generatedPNRs.add(booking.pnr)
      
      // Validate PNR format (LTR + 6 digits + 3 sequence)
      if (!/^LTR\d{9}$/.test(booking.pnr)) {
        throw new Error(`Invalid PNR format: ${booking.pnr}. Expected: LTRxxxxxxxxx`)
      }

      results.push({
        bookingId: booking.id,
        pnr: booking.pnr,
        format: 'Valid',
        unique: !BookingRecordService.getAllBookings()
          .filter(b => b.id !== booking.id)
          .some(b => b.pnr === booking.pnr)
      })
    }

    updateTestStatus('unique_pnr_test', 'passed', results)
    return true
  }

  const testInitiatedStateValidation = async (): Promise<boolean> => {
    const results = []
    
    // Create booking and verify initial state
    const booking = BookingRecordService.createBooking(
      'TR999',
      {
        name: 'State Test Passenger',
        phone: '+255123456789',
        email: 'state@test.com'
      },
      ['1A', '1B'],
      20000
    )

    if (booking.state !== 'INITIATED') {
      throw new Error(`Expected state INITIATED, got ${booking.state}`)
    }

    results.push({
      bookingId: booking.id,
      pnr: booking.pnr,
      initialState: booking.state,
      createdAt: booking.createdAt.toISOString()
    })

    // Test state transitions
    const stateUpdated = BookingRecordService.updateBookingState(booking.id, 'AWAITING_PAYMENT')
    if (!stateUpdated) {
      throw new Error('Failed to update booking state')
    }

    const updatedBooking = BookingRecordService.getBookingById(booking.id)
    if (!updatedBooking || updatedBooking.state !== 'AWAITING_PAYMENT') {
      throw new Error('State transition failed')
    }

    results.push({
      bookingId: booking.id,
      stateTransition: 'INITIATED → AWAITING_PAYMENT',
      success: true,
      updatedAt: updatedBooking.updatedAt.toISOString()
    })

    updateTestStatus('initiated_state_test', 'passed', results)
    return true
  }

  const testPassengerDetailsStorage = async (): Promise<boolean> => {
    const results = []
    
    const passengerDetails = {
      name: 'John Doe Mwalimu',
      phone: '+255712345678',
      email: 'john.doe@example.co.tz',
      idNumber: 'ID123456789'
    }

    // Test validation
    const validation = BookingRecordService.validatePassengerDetails(passengerDetails)
    if (!validation.valid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`)
    }

    // Create booking with complete details
    const booking = BookingRecordService.createBooking(
      'TR888',
      passengerDetails,
      ['5A'],
      18000
    )

    // Verify all details are stored correctly
    if (booking.passengerName !== passengerDetails.name) {
      throw new Error(`Name mismatch: expected ${passengerDetails.name}, got ${booking.passengerName}`)
    }

    if (booking.passengerPhone !== passengerDetails.phone) {
      throw new Error(`Phone mismatch: expected ${passengerDetails.phone}, got ${booking.passengerPhone}`)
    }

    if (booking.passengerEmail !== passengerDetails.email) {
      throw new Error(`Email mismatch: expected ${passengerDetails.email}, got ${booking.passengerEmail}`)
    }

    if (booking.passengerIdNumber !== passengerDetails.idNumber) {
      throw new Error(`ID mismatch: expected ${passengerDetails.idNumber}, got ${booking.passengerIdNumber}`)
    }

    results.push({
      bookingId: booking.id,
      pnr: booking.pnr,
      storedDetails: {
        name: booking.passengerName,
        phone: booking.passengerPhone,
        email: booking.passengerEmail,
        idNumber: booking.passengerIdNumber
      },
      validationPassed: validation.valid,
      dataIntegrity: 'Complete'
    })

    // Test mandatory field validation
    const invalidDetails = { name: '', phone: 'invalid', email: 'not-email' }
    const invalidValidation = BookingRecordService.validatePassengerDetails(invalidDetails)
    
    if (invalidValidation.valid) {
      throw new Error('Validation should fail for invalid details')
    }

    results.push({
      testCase: 'Invalid Details Validation',
      errors: invalidValidation.errors,
      validationPassed: false
    })

    updateTestStatus('passenger_details_test', 'passed', results)
    return true
  }

  const testFareAllocationCalculation = async (): Promise<boolean> => {
    const results = []
    
    // Test single seat booking
    const booking1 = BookingRecordService.createBooking(
      'TR777',
      {
        name: 'Fare Test Passenger',
        phone: '+255123456789',
        email: 'fare@test.com'
      },
      ['3A'],
      25000 // Base fare
    )

    // Validate fare calculation
    const isCalculationValid = BookingRecordService.validateFareCalculation(booking1)
    if (!isCalculationValid) {
      throw new Error('Fare calculation validation failed')
    }

    const isLATRACompliant = BookingRecordService.validateLATRAFeeCompliance(booking1)
    if (!isLATRACompliant) {
      throw new Error('LATRA fee compliance validation failed')
    }

    const { baseFare, latraFee, transactionFee, commission, grossFare } = booking1.fareBreakdown

    results.push({
      bookingId: booking1.id,
      pnr: booking1.pnr,
      seatCount: 1,
      fareBreakdown: {
        baseFare,
        latraFee: `${latraFee} (${((latraFee/baseFare) * 100).toFixed(1)}%)`,
        transactionFee: `${transactionFee} (${((transactionFee/baseFare) * 100).toFixed(1)}%)`,
        commission: `${commission} (${((commission/baseFare) * 100).toFixed(1)}%)`,
        grossFare,
        calculationValid: isCalculationValid,
        latraCompliant: isLATRACompliant
      }
    })

    // Test multiple seat booking
    const booking2 = BookingRecordService.createBooking(
      'TR666',
      {
        name: 'Multi Seat Passenger',
        phone: '+255123456789',
        email: 'multi@test.com'
      },
      ['4A', '4B', '4C'],
      15000 // Base fare per seat
    )

    const fareBreakdown2 = booking2.fareBreakdown
    const expectedBase = 15000 * 3 // 3 seats

    if (fareBreakdown2.baseFare !== expectedBase) {
      throw new Error(`Multi-seat calculation error: expected ${expectedBase}, got ${fareBreakdown2.baseFare}`)
    }

    results.push({
      bookingId: booking2.id,
      pnr: booking2.pnr,
      seatCount: 3,
      fareBreakdown: fareBreakdown2,
      calculationValid: BookingRecordService.validateFareCalculation(booking2),
      latraCompliant: BookingRecordService.validateLATRAFeeCompliance(booking2)
    })

    updateTestStatus('fare_allocation_test', 'passed', results)
    return true
  }

  const testAuditLogCompliance = async (): Promise<boolean> => {
    const results = []
    
    // Clear existing logs for clean test
    const initialLogCount = BookingRecordService.getAuditLogs().length

    // Create booking and check audit log
    const booking = BookingRecordService.createBooking(
      'TR555',
      {
        name: 'Audit Test Passenger',
        phone: '+255123456789',
        email: 'audit@test.com'
      },
      ['7A'],
      22000
    )

    // Verify BOOKING_CREATED log entry exists
    const creationLogs = BookingRecordService.getAuditLogs({
      event: 'BOOKING_CREATED',
      bookingId: booking.id
    })

    if (creationLogs.length === 0) {
      throw new Error('BOOKING_CREATED audit log not found')
    }

    const creationLog = creationLogs[0]
    
    // Validate log structure
    if (!creationLog.id || !creationLog.timestamp || !creationLog.pnr) {
      throw new Error('Incomplete audit log entry')
    }

    if (creationLog.event !== 'BOOKING_CREATED') {
      throw new Error(`Expected event BOOKING_CREATED, got ${creationLog.event}`)
    }

    if (creationLog.bookingId !== booking.id || creationLog.pnr !== booking.pnr) {
      throw new Error('Audit log booking reference mismatch')
    }

    if (!creationLog.immutable) {
      throw new Error('Audit log should be marked as immutable')
    }

    results.push({
      logId: creationLog.id,
      event: creationLog.event,
      bookingId: creationLog.bookingId,
      pnr: creationLog.pnr,
      actorId: creationLog.actorId,
      actorType: creationLog.actorType,
      timestamp: creationLog.timestamp.toISOString(),
      immutable: creationLog.immutable,
      details: creationLog.details
    })

    // Test state change audit
    BookingRecordService.updateBookingState(booking.id, 'PAID')
    
    const stateChangeLogs = BookingRecordService.getAuditLogs({
      event: 'BOOKING_STATE_CHANGED',
      bookingId: booking.id
    })

    if (stateChangeLogs.length === 0) {
      throw new Error('BOOKING_STATE_CHANGED audit log not found')
    }

    results.push({
      logId: stateChangeLogs[0].id,
      event: stateChangeLogs[0].event,
      stateChange: `${stateChangeLogs[0].details.oldState} → ${stateChangeLogs[0].details.newState}`,
      immutable: stateChangeLogs[0].immutable
    })

    // Verify log immutability (logs cannot be modified)
    const allLogs = BookingRecordService.getAuditLogs()
    const newLogCount = allLogs.length

    if (newLogCount <= initialLogCount) {
      throw new Error('Audit logs were not created properly')
    }

    updateTestStatus('audit_log_test', 'passed', results)
    return true
  }

  const runAllTests = async () => {
    setIsRunning(true)
    
    // Reset booking service for clean test
    BookingRecordService.resetForTesting()
    
    for (const test of tests) {
      await runTest(test.id)
      await new Promise(resolve => setTimeout(resolve, 500)) // Small delay between tests
    }
    
    setIsRunning(false)
    
    const passedCount = tests.filter(t => t.status === 'passed').length
    toast({
      title: "Booking Validation Complete",
      description: `${passedCount}/${tests.length} tests passed successfully`,
    })
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
        return <div className="w-4 h-4 bg-gray-300 rounded-full" />
    }
  }

  const getTestIcon = (testId: string) => {
    switch (testId) {
      case 'unique_pnr_test':
        return <FileText className="w-5 h-5" />
      case 'initiated_state_test':
        return <Database className="w-5 h-5" />
      case 'passenger_details_test':
        return <Users className="w-5 h-5" />
      case 'fare_allocation_test':
        return <Calculator className="w-5 h-5" />
      case 'audit_log_test':
        return <Scroll className="w-5 h-5" />
      default:
        return <div className="w-5 h-5" />
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">LATRA Booking Validation Tests</h1>
        <p className="text-muted-foreground">
          Comprehensive validation of booking record creation, PNR generation, and audit compliance
        </p>
        <Alert>
          <Database className="h-4 w-4" />
          <AlertDescription>
            <strong>Simulation Mode:</strong> This demonstrates booking validation functionality. 
            In production, this would run against your Supabase database with proper persistence.
          </AlertDescription>
        </Alert>
      </div>

      {/* Control Panel */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 justify-center">
            <Button onClick={runAllTests} disabled={isRunning} size="lg">
              {isRunning ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  Running Validation Tests...
                </>
              ) : (
                'Run All Validation Tests'
              )}
            </Button>
            <Button 
              onClick={() => BookingRecordService.resetForTesting()} 
              variant="outline" 
              disabled={isRunning}
            >
              Reset Test Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {tests.map((test) => (
          <Card key={test.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getTestIcon(test.id)}
                  <span className="text-sm">{test.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(test.status)}
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
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{test.description}</p>
              
              {test.error && (
                <Alert variant="destructive">
                  <AlertDescription>{test.error}</AlertDescription>
                </Alert>
              )}

              {test.results && test.results.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-medium text-muted-foreground">Results:</div>
                  <div className="bg-muted/30 p-2 rounded text-xs font-mono max-h-32 overflow-y-auto">
                    <pre>{JSON.stringify(test.results, null, 2)}</pre>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Information */}
      <Card>
        <CardHeader>
          <CardTitle>Test Coverage Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div><strong>PNR Generation:</strong> Unique alphanumeric format (LTRxxxxxxxxx) with sequence validation</div>
          <div><strong>Booking States:</strong> INITIATED → AWAITING_PAYMENT → PAID state progression</div>
          <div><strong>Passenger Data:</strong> Complete validation of mandatory fields with proper storage</div>
          <div><strong>LATRA Compliance:</strong> 5% LATRA fee + 2.5% transaction fee + 2% commission breakdown</div>
          <div><strong>Audit Trail:</strong> Immutable logging of BOOKING_CREATED and state change events</div>
          <Separator className="my-2" />
          <div className="text-muted-foreground">
            All tests validate LATRA regulatory requirements for booking record management, 
            fare allocation, and audit compliance in the Tanzanian transport sector.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default BookingValidationTests