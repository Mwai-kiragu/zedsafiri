import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface RouteConfig {
  id: string;
  origin: string;
  destination: string;
  class: 'Economy' | 'Business' | 'Royal';
  baseFare: number;
  latraFee: number;
  transactionFee: number;
  commission: number;
  effectiveFrom: string;
  effectiveTo: string | null;
  status: 'Active' | 'Inactive';
  latraApproved: 'Approved' | 'Pending' | 'Rejected';
  distance?: number;
}

// Simulated route configuration data
const mockRoutes: RouteConfig[] = [
  {
    id: 'RT001',
    origin: 'Dar es Salaam',
    destination: 'Dodoma',
    class: 'Economy',
    baseFare: 15000,
    latraFee: 1000,
    transactionFee: 500,
    commission: 5,
    effectiveFrom: '2025-09-01',
    effectiveTo: '2025-12-31',
    status: 'Active',
    latraApproved: 'Approved',
    distance: 450
  },
  {
    id: 'RT002',
    origin: 'Dar es Salaam',
    destination: 'Arusha',
    class: 'Business',
    baseFare: 30000,
    latraFee: 1500,
    transactionFee: 800,
    commission: 7,
    effectiveFrom: '2025-09-01',
    effectiveTo: null,
    status: 'Active',
    latraApproved: 'Approved',
    distance: 635
  },
  {
    id: 'RT003',
    origin: 'Mwanza',
    destination: 'Kigoma',
    class: 'Royal',
    baseFare: 45000,
    latraFee: 2000,
    transactionFee: 1000,
    commission: 10,
    effectiveFrom: '2025-09-15',
    effectiveTo: '2025-10-31',
    status: 'Active',
    latraApproved: 'Pending',
    distance: 380
  },
  {
    id: 'RT004',
    origin: 'Arusha',
    destination: 'Nairobi',
    class: 'Economy',
    baseFare: 20000,
    latraFee: 1200,
    transactionFee: 600,
    commission: 5,
    effectiveFrom: '2025-09-01',
    effectiveTo: '2025-12-31',
    status: 'Inactive',
    latraApproved: 'Rejected',
    distance: 280
  }
];

const RouteConfigTable = () => {
  const [routes, setRoutes] = useState<RouteConfig[]>(mockRoutes);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<RouteConfig | null>(null);
  const { toast } = useToast();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
      case 'Inactive':
        return <Badge variant="secondary">Inactive</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getApprovalBadge = (approval: string) => {
    switch (approval) {
      case 'Approved':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        );
      case 'Pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case 'Rejected':
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="outline">{approval}</Badge>;
    }
  };

  const handleAddRoute = () => {
    // Simulate adding route
    toast({
      title: "Route Configuration Saved",
      description: "New route configuration submitted for LATRA approval.",
    });
    setIsAddDialogOpen(false);
  };

  const handleEditRoute = (route: RouteConfig) => {
    setEditingRoute(route);
  };

  const handleDeleteRoute = (routeId: string) => {
    // Simulate deletion
    setRoutes(routes.filter(r => r.id !== routeId));
    toast({
      title: "Route Deleted",
      description: "Route configuration has been removed.",
      variant: "destructive"
    });
  };

  const calculateGrossFare = (route: RouteConfig) => {
    return route.baseFare + route.latraFee + route.transactionFee + (route.baseFare * route.commission / 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Route Configuration</h2>
          <p className="text-muted-foreground mt-2">
            Manage routes, destinations, and LATRA-approved fare structures
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary">
              <Plus className="w-4 h-4 mr-2" />
              Add Route
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Route Configuration</DialogTitle>
              <DialogDescription>
                Configure a new route with LATRA-compliant fare structure
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="origin">Origin</Label>
                <Input id="origin" placeholder="e.g., Dar es Salaam" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="destination">Destination</Label>
                <Input id="destination" placeholder="e.g., Dodoma" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="class">Service Class</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Economy">Economy</SelectItem>
                    <SelectItem value="Business">Business</SelectItem>
                    <SelectItem value="Royal">Royal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="baseFare">Base Fare (TZS)</Label>
                <Input id="baseFare" type="number" placeholder="15000" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="latraFee">LATRA Fee (TZS)</Label>
                <Input id="latraFee" type="number" placeholder="1000" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="transactionFee">Transaction Fee (TZS)</Label>
                <Input id="transactionFee" type="number" placeholder="500" />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddRoute}>Save & Submit for Approval</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Routes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{routes.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Active Routes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {routes.filter(r => r.status === 'Active').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {routes.filter(r => r.latraApproved === 'Pending').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Avg Base Fare</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(routes.reduce((sum, r) => sum + r.baseFare, 0) / routes.length).toLocaleString()} TZS
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Routes Table */}
      <Card>
        <CardHeader>
          <CardTitle>Route Configurations</CardTitle>
          <CardDescription>
            All route configurations with fare breakdowns and LATRA approval status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Route ID</TableHead>
                <TableHead>Origin → Destination</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Base Fare</TableHead>
                <TableHead>LATRA Fee</TableHead>
                <TableHead>Gross Fare</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>LATRA Approval</TableHead>
                <TableHead>Effective Period</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {routes.map((route) => (
                <TableRow key={route.id}>
                  <TableCell className="font-mono">{route.id}</TableCell>
                  <TableCell>
                    <div className="font-medium">{route.origin}</div>
                    <div className="text-sm text-muted-foreground">→ {route.destination}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{route.class}</Badge>
                  </TableCell>
                  <TableCell>{route.baseFare.toLocaleString()} TZS</TableCell>
                  <TableCell>{route.latraFee.toLocaleString()} TZS</TableCell>
                  <TableCell className="font-medium">
                    {calculateGrossFare(route).toLocaleString()} TZS
                  </TableCell>
                  <TableCell>{getStatusBadge(route.status)}</TableCell>
                  <TableCell>{getApprovalBadge(route.latraApproved)}</TableCell>
                  <TableCell className="text-sm">
                    <div>{route.effectiveFrom}</div>
                    {route.effectiveTo && (
                      <div className="text-muted-foreground">to {route.effectiveTo}</div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditRoute(route)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteRoute(route.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* LATRA Compliance Notice */}
      <Card className="border-amber-200 bg-amber-50">
        <CardHeader>
          <CardTitle className="text-amber-800 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            LATRA Compliance Notice
          </CardTitle>
        </CardHeader>
        <CardContent className="text-amber-700">
          <ul className="space-y-2 text-sm">
            <li>• All fare structures must be approved by LATRA before activation</li>
            <li>• Base fares cannot exceed LATRA-mandated maximum rates</li>
            <li>• LATRA fees are mandatory and calculated as 5-8% of base fare</li>
            <li>• Route configurations are audited quarterly for compliance</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default RouteConfigTable;