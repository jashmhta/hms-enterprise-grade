import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../ui/card';
import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Alert,
  AlertDescription,
  Progress,
  Separator,
} from '../ui';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Building2,
  Users,
  DollarSign,
  Activity,
  AlertTriangle,
  Shield,
  Settings,
  Bell,
  TrendingUp,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  Eye,
  Edit,
  Search,
  Filter,
  Download,
  RefreshCw,
} from 'lucide-react';

interface DashboardStats {
  total_hospitals: number;
  active_subscriptions: number;
  trial_subscriptions: number;
  expired_subscriptions: number;
  total_revenue_monthly: number;
  total_users: number;
  total_patients: number;
  active_alerts: number;
  system_health: string;
}

interface Hospital {
  id: number;
  name: string;
  subscription: {
    tier: { name: string; tier_type: string };
    status: string;
    days_remaining: number;
    monthly_amount: number;
  };
  total_users: number;
  total_patients: number;
  created_at: string;
}

interface Alert {
  id: number;
  title: string;
  severity: string;
  alert_type: string;
  is_active: boolean;
  created_at: string;
}

const SuperadminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showPriceEstimator, setShowPriceEstimator] = useState(false);
  const [showNewAlert, setShowNewAlert] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTier, setFilterTier] = useState('all');

  // Price Estimator State
  const [priceEstimate, setPriceEstimate] = useState({
    services: [{ name: '', quantity: 1 }],
    patient_type: 'OPD',
    insurance_type: 'NONE',
    room_type: 'GENERAL',
    duration_days: 1,
  });
  const [estimateResult, setEstimateResult] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Simulate API calls
      const mockStats: DashboardStats = {
        total_hospitals: 247,
        active_subscriptions: 198,
        trial_subscriptions: 49,
        expired_subscriptions: 12,
        total_revenue_monthly: 458750,
        total_users: 12847,
        total_patients: 156234,
        active_alerts: 3,
        system_health: 'Excellent',
      };

      const mockHospitals: Hospital[] = [
        {
          id: 1,
          name: 'Apollo Hospitals',
          subscription: {
            tier: { name: 'Enterprise', tier_type: 'ENTERPRISE' },
            status: 'ACTIVE',
            days_remaining: 347,
            monthly_amount: 9999,
          },
          total_users: 1250,
          total_patients: 8934,
          created_at: '2023-01-15T10:30:00Z',
        },
        {
          id: 2,
          name: 'Fortis Healthcare',
          subscription: {
            tier: { name: 'Premium', tier_type: 'PREMIUM' },
            status: 'ACTIVE',
            days_remaining: 89,
            monthly_amount: 4999,
          },
          total_users: 890,
          total_patients: 5678,
          created_at: '2023-03-22T14:15:00Z',
        },
        {
          id: 3,
          name: 'Max Healthcare',
          subscription: {
            tier: { name: 'Basic', tier_type: 'BASIC' },
            status: 'TRIAL',
            days_remaining: 12,
            monthly_amount: 1999,
          },
          total_users: 234,
          total_patients: 1456,
          created_at: '2024-01-10T09:45:00Z',
        },
      ];

      const mockAlerts: Alert[] = [
        {
          id: 1,
          title: 'System Maintenance Scheduled',
          severity: 'MEDIUM',
          alert_type: 'MAINTENANCE',
          is_active: true,
          created_at: '2024-01-15T10:30:00Z',
        },
        {
          id: 2,
          title: 'High CPU Usage Detected',
          severity: 'HIGH',
          alert_type: 'WARNING',
          is_active: true,
          created_at: '2024-01-15T11:20:00Z',
        },
        {
          id: 3,
          title: 'New Feature Release',
          severity: 'LOW',
          alert_type: 'INFO',
          is_active: true,
          created_at: '2024-01-15T08:15:00Z',
        },
      ];

      setStats(mockStats);
      setHospitals(mockHospitals);
      setAlerts(mockAlerts);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePriceEstimate = async () => {
    try {
      // Simulate price estimation API call
      const result = {
        total_estimate: 15750,
        breakdown: [
          { service: 'Consultation', quantity: 1, unit_cost: 500, total_cost: 500 },
          { service: 'Blood Test', quantity: 3, unit_cost: 200, total_cost: 600 },
          { service: 'X-Ray', quantity: 2, unit_cost: 800, total_cost: 1600 },
          { service: 'Private Room (3 days)', quantity: 3, unit_cost: 2500, total_cost: 7500 },
        ],
        insurance_coverage: 9450,
        patient_responsibility: 6300,
        discount_available: 1575,
        estimated_savings: 1575,
      };
      setEstimateResult(result);
    } catch (error) {
      console.error('Error calculating price estimate:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'TRIAL': return 'bg-blue-100 text-blue-800';
      case 'EXPIRED': return 'bg-red-100 text-red-800';
      case 'SUSPENDED': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'bg-red-100 text-red-800';
      case 'HIGH': return 'bg-orange-100 text-orange-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'LOW': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredHospitals = hospitals.filter(hospital => {
    const matchesSearch = hospital.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier = filterTier === 'all' || hospital.subscription.tier.tier_type === filterTier;
    return matchesSearch && matchesTier;
  });

  const revenueData = [
    { month: 'Jan', revenue: 380000 },
    { month: 'Feb', revenue: 420000 },
    { month: 'Mar', revenue: 445000 },
    { month: 'Apr', revenue: 458750 },
  ];

  const subscriptionData = [
    { name: 'Active', value: stats?.active_subscriptions || 0, color: '#10B981' },
    { name: 'Trial', value: stats?.trial_subscriptions || 0, color: '#3B82F6' },
    { name: 'Expired', value: stats?.expired_subscriptions || 0, color: '#EF4444' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-lg">Loading Dashboard...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Superadmin Control Panel</h1>
              <p className="text-gray-600 mt-1">Enterprise HMS Management Dashboard</p>
            </div>
            <div className="flex space-x-3">
              <Button
                onClick={() => setShowPriceEstimator(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <DollarSign className="h-4 w-4 mr-2" />
                Price Estimator
              </Button>
              <Button
                onClick={() => setShowNewAlert(true)}
                variant="outline"
              >
                <Bell className="h-4 w-4 mr-2" />
                New Alert
              </Button>
              <Button
                onClick={fetchDashboardData}
                variant="outline"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* System Health Alert */}
        {stats?.system_health !== 'Excellent' && (
          <Alert className="mb-6 border-orange-200 bg-orange-50">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              System health is currently: <strong>{stats?.system_health}</strong>. 
              {stats?.active_alerts} active alerts require attention.
            </AlertDescription>
          </Alert>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Hospitals</p>
                  <p className="text-3xl font-bold">{stats?.total_hospitals}</p>
                </div>
                <Building2 className="h-8 w-8 text-blue-200" />
              </div>
              <div className="mt-4">
                <span className="text-blue-100 text-sm">+12% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Monthly Revenue</p>
                  <p className="text-3xl font-bold">${(stats?.total_revenue_monthly || 0).toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-200" />
              </div>
              <div className="mt-4">
                <span className="text-green-100 text-sm">+8.3% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Total Users</p>
                  <p className="text-3xl font-bold">{stats?.total_users?.toLocaleString()}</p>
                </div>
                <Users className="h-8 w-8 text-purple-200" />
              </div>
              <div className="mt-4">
                <span className="text-purple-100 text-sm">Active across all hospitals</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">System Health</p>
                  <p className="text-2xl font-bold">{stats?.system_health}</p>
                </div>
                <Activity className="h-8 w-8 text-orange-200" />
              </div>
              <div className="mt-4">
                <span className="text-orange-100 text-sm">{stats?.active_alerts} active alerts</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="hospitals">Hospitals</TabsTrigger>
            <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Revenue Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']} />
                      <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Subscription Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Subscription Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={subscriptionData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {subscriptionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="hospitals" className="space-y-6">
            {/* Search and Filter */}
            <Card>
              <CardContent className="p-4">
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Search hospitals..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <Select value={filterTier} onValueChange={setFilterTier}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by tier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Tiers</SelectItem>
                      <SelectItem value="BASIC">Basic</SelectItem>
                      <SelectItem value="PREMIUM">Premium</SelectItem>
                      <SelectItem value="ENTERPRISE">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Hospitals Table */}
            <Card>
              <CardHeader>
                <CardTitle>Hospitals ({filteredHospitals.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredHospitals.map((hospital) => (
                    <div key={hospital.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div>
                            <h3 className="font-semibold text-lg">{hospital.name}</h3>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge className={getStatusColor(hospital.subscription.status)}>
                                {hospital.subscription.status}
                              </Badge>
                              <Badge variant="outline">
                                {hospital.subscription.tier.name}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${hospital.subscription.monthly_amount}/month</p>
                        <p className="text-sm text-gray-600">
                          {hospital.subscription.days_remaining} days remaining
                        </p>
                        <p className="text-sm text-gray-500">
                          {hospital.total_users} users, {hospital.total_patients} patients
                        </p>
                      </div>
                      <div className="ml-4">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Active Alerts ({alerts.length})</span>
                  <Button onClick={() => setShowNewAlert(true)} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    New Alert
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {alerts.map((alert) => (
                    <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <AlertTriangle className="h-5 w-5 text-orange-500" />
                          <div>
                            <h3 className="font-semibold">{alert.title}</h3>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge className={getSeverityColor(alert.severity)}>
                                {alert.severity}
                              </Badge>
                              <Badge variant="outline">
                                {alert.alert_type}
                              </Badge>
                              <span className="text-sm text-gray-500">
                                {new Date(alert.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Price Estimator Modal */}
        <Dialog open={showPriceEstimator} onOpenChange={setShowPriceEstimator}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                Quick Price Estimator
              </DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Input Form */}
              <div className="space-y-4">
                <div>
                  <Label>Patient Type</Label>
                  <Select
                    value={priceEstimate.patient_type}
                    onValueChange={(value) => setPriceEstimate({...priceEstimate, patient_type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="OPD">Out Patient (OPD)</SelectItem>
                      <SelectItem value="IPD">In Patient (IPD)</SelectItem>
                      <SelectItem value="EMERGENCY">Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Services</Label>
                  {priceEstimate.services.map((service, index) => (
                    <div key={index} className="flex space-x-2 mt-2">
                      <Input
                        placeholder="Service name"
                        value={service.name}
                        onChange={(e) => {
                          const newServices = [...priceEstimate.services];
                          newServices[index].name = e.target.value;
                          setPriceEstimate({...priceEstimate, services: newServices});
                        }}
                      />
                      <Input
                        type="number"
                        placeholder="Qty"
                        value={service.quantity}
                        onChange={(e) => {
                          const newServices = [...priceEstimate.services];
                          newServices[index].quantity = parseInt(e.target.value) || 1;
                          setPriceEstimate({...priceEstimate, services: newServices});
                        }}
                        className="w-20"
                      />
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => setPriceEstimate({
                      ...priceEstimate,
                      services: [...priceEstimate.services, { name: '', quantity: 1 }]
                    })}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Service
                  </Button>
                </div>

                {priceEstimate.patient_type === 'IPD' && (
                  <div>
                    <Label>Room Type</Label>
                    <Select
                      value={priceEstimate.room_type}
                      onValueChange={(value) => setPriceEstimate({...priceEstimate, room_type: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GENERAL">General Ward</SelectItem>
                        <SelectItem value="PRIVATE">Private Room</SelectItem>
                        <SelectItem value="DELUXE">Deluxe Room</SelectItem>
                        <SelectItem value="SUITE">Suite</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <Button onClick={handlePriceEstimate} className="w-full">
                  Calculate Estimate
                </Button>
              </div>

              {/* Results */}
              {estimateResult && (
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-2">Price Breakdown</h3>
                    <div className="space-y-2">
                      {estimateResult.breakdown.map((item, index) => (
                        <div key={index} className="flex justify-between">
                          <span>{item.service} (x{item.quantity})</span>
                          <span>${item.total_cost}</span>
                        </div>
                      ))}
                    </div>
                    <Separator className="my-3" />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total Estimate</span>
                      <span>${estimateResult.total_estimate}</span>
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Insurance & Savings</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Insurance Coverage</span>
                        <span className="text-green-600">-${estimateResult.insurance_coverage}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Available Discount</span>
                        <span className="text-green-600">-${estimateResult.discount_available}</span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between font-semibold">
                        <span>Patient Responsibility</span>
                        <span>${estimateResult.patient_responsibility}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default SuperadminDashboard;
