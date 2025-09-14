import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { QrCode, MapPin, Clock, Ticket, Phone, Mail, CreditCard } from "lucide-react";
import { ticketService, type SavedTicket } from "@/services/ticketService";

const MyTickets = () => {
  const [tickets, setTickets] = useState<SavedTicket[]>([]);

  useEffect(() => {
    setTickets(ticketService.getUserTickets());
  }, []);

  const refreshTickets = () => {
    setTickets(ticketService.getUserTickets());
  };

  const handleCancelTicket = (ticketId: string) => {
    if (confirm('Are you sure you want to cancel this ticket?')) {
      ticketService.cancelTicket(ticketId);
      refreshTickets();
    }
  };

  if (tickets.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <Ticket className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No Tickets Found</h3>
          <p className="text-muted-foreground">
            Your purchased tickets will appear here after booking.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">My Tickets</h2>
        <Button variant="outline" onClick={refreshTickets}>
          Refresh
        </Button>
      </div>

      <div className="grid gap-6">
        {tickets.map((ticket) => (
          <Card key={ticket.id} className="overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{ticket.route}</CardTitle>
                  <div className="text-sm text-muted-foreground">
                    PNR: {ticket.pnr} • Ticket: {ticket.ticketNumber}
                  </div>
                </div>
                <Badge 
                  variant={
                    ticket.status === 'ISSUED' ? 'default' : 
                    ticket.status === 'CANCELLED' ? 'destructive' : 'secondary'
                  }
                >
                  {ticket.status}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Trip Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Operator</div>
                  <div className="flex items-center space-x-1">
                    <span>{ticket.operator}</span>
                    <Badge variant="outline" className="text-xs">
                      {ticket.vehicleType}
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Seats</div>
                  <div>{ticket.seatNumbers.join(', ')}</div>
                </div>

                <div>
                  <div className="text-sm font-medium text-muted-foreground">Departure</div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{ticket.departureTime}</span>
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium text-muted-foreground">Arrival</div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{ticket.arrivalTime}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Passenger Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Passenger:</span>
                  <span>{ticket.passengerName}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>{ticket.passengerEmail}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>{ticket.passengerPhone}</span>
                </div>
              </div>

              <Separator />

              {/* Payment & Travel Details */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="font-medium">Amount Paid</div>
                  <div>{ticket.currency} {ticket.totalAmount.toLocaleString()}</div>
                </div>
                <div>
                  <div className="font-medium">Payment Method</div>
                  <div className="flex items-center space-x-1">
                    <CreditCard className="w-4 h-4" />
                    <span>{ticket.paymentMethod}</span>
                  </div>
                </div>
                <div>
                  <div className="font-medium">Booking Date</div>
                  <div>{new Date(ticket.bookingDate).toLocaleDateString()}</div>
                </div>
                <div>
                  <div className="font-medium">Travel Date</div>
                  <div>{new Date(ticket.travelDate).toLocaleDateString()}</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <QrCode className="w-4 h-4" />
                  <span>QR: {ticket.qrCode}</span>
                </div>
                
                {ticket.status === 'ISSUED' && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleCancelTicket(ticket.id)}
                  >
                    Cancel Ticket
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MyTickets;