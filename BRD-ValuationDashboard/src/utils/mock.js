// mock.js - Fallback mock data for BRD Portal

export const MockAPI = {
  // ---------------------------------------------
  // 1. Valuation Dashboard Mock
  // ---------------------------------------------
  getDashboardData() {
    return Promise.resolve({
      kpis: {
        pendingValuations: 42,
        pendingTrend: -0.08,
        completedToday: 15,
        completedTrend: 0.0125,
        averageValue: 45.2,
        averageValueTrend: 0.012,
        successRate: 0.94,
        successRateTrend: 0.025,
      },
      valuationTrends: [
        { month: "Jun", avgValue: 42.6 },
        { month: "Jul", avgValue: 43.8 },
        { month: "Aug", avgValue: 44.2 },
        { month: "Sep", avgValue: 44.8 },
        { month: "Oct", avgValue: 45.1 },
        { month: "Nov", avgValue: 45.2 },
      ],
      propertyDistribution: [
        { type: "Residential", count: 120, color: "#4285F4" },
        { type: "Commercial", count: 80, color: "#15D15D" },
        { type: "Industrial", count: 40, color: "#FF9900" },
        { type: "Agricultural", count: 20, color: "#A05FCA" },
      ],
      monthlyComplition: [
        { month: "Jun", count: 70 },
        { month: "Jul", count: 92 },
        { month: "Aug", count: 88 },
        { month: "Sep", count: 95 },
        { month: "Oct", count: 85 },
        { month: "Nov", count: 94 },
      ],
      locationDistribution: [
  { place: "Mumbai", count: 200, topProperty: "Residential", avgLoan: 5000000 },
  { place: "Bangalore", count: 150, topProperty: "Commercial", avgLoan: 3500000 },
  { place: "Delhi", count: 120, topProperty: "Residential", avgLoan: 4000000 },
  { place: "Hyderabad", count: 100, topProperty: "Industrial", avgLoan: 3000000 },
  { place: "Chennai", count: 80, topProperty: "Residential", avgLoan: 2500000 },
],

    });
  },

  // ----------------------------------------------
  // 2. Field Verifications Mock
  // ---------------------------------------------
   getVerificationsList: () => {
    return Promise.resolve([
      {
        id: "FV-2001",
        property: "3 BHK Apartment",
        address: "Palm Grove Heights, Malad West, Mumbai",
        owner: "Rahul Mehta",
        date: "2025-11-04",
        status: "Pending",
        agent: "Priya Singh",
        priority: "High",
      },
      {
        id: "FV-2002",
        property: "Commercial Space",
        address: "Tech Park, Whitefield, Bangalore",
        owner: "TechCorp Ltd",
        date: "2025-11-04",
        status: "Scheduled",
        agent: "Amit Kumar",
        priority: "Medium",
      },
      {
        id: "FV-2003",
        property: "Industrial Unit",
        address: "MIDC, Pune",
        owner: "Manufacturing Solutions",
        date: "2025-11-03",
        status: "Completed",
        agent: "Rajesh Sharma",
        priority: "High",
      },
    ]);
  },

  // ---------------------------------------------
  // 3. Property Checks Mock
  // ---------------------------------------------
  getPropertyChecksList: () => {
    return Promise.resolve([
      {
        id: "PROP-1001",
        name: "Sunset Residency",
        location: "Andheri West, Mumbai",
        checkItems: [
          { title: "Structural Condition", status: "OK" },
          { title: "Electricity", status: "Issue" },
          { title: "Water Supply", status: "Pending" },
        ],
      },
      {
        id: "PROP-1002",
        name: "Green Valley Villa",
        location: "Whitefield, Bangalore",
        checkItems: [
          { title: "Roof Condition", status: "OK" },
          { title: "Walls", status: "OK" },
          { title: "Interior", status: "Issue" },
        ],
      },
    ]);
  },
};
