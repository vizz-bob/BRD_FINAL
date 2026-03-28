// utils/forecastCalculations.js

/**
 * Calculate forecast metrics based on raw data
 * @param {Object} rawData - Raw forecast data from API
 * @param {Object} filters - Current filter settings
 * @returns {Object} Calculated metrics
 */
export const calculateForecastMetrics = (rawData, filters) => {
  if (!rawData || !rawData.agentData) {
    return getDefaultMetrics();
  }

  const agents = rawData.agentData;
  
  // Calculate totals
  const totalTarget = agents.reduce((sum, agent) => sum + agent.target, 0);
  const totalAchieved = agents.reduce((sum, agent) => sum + agent.achieved, 0);
  const totalHotLeads = agents.reduce((sum, agent) => sum + agent.hotLeads, 0);
  const totalExpectedDeals = agents.reduce((sum, agent) => sum + agent.expectedDeals, 0);
  
  // Calculate achievement percentage
  const achievementPercentage = (totalAchieved / totalTarget) * 100;
  
  // Calculate growth metrics (comparing to previous period)
  const previousPeriodAchieved = totalAchieved * 0.9; // Mock previous period data
  const dealsGrowth = ((totalAchieved - previousPeriodAchieved) / previousPeriodAchieved) * 100;
  const revenueGrowth = dealsGrowth; // Simplified for now
  
  // Count active/inactive forecasts
  const activeForecasts = agents.filter(agent => !agent.isInactive).length;
  const inactiveForecasts = agents.filter(agent => agent.isInactive).length;
  
  return {
    expectedDeals: totalExpectedDeals,
    hotLeads: totalHotLeads,
    projectedRevenue: totalAchieved,
    targetRevenue: totalTarget,
    achievementPercentage,
    dealsGrowth: parseFloat(dealsGrowth.toFixed(1)),
    revenueGrowth: parseFloat(revenueGrowth.toFixed(1)),
    activeForecasts,
    inactiveForecasts
  };
};

/**
 * Generate mock forecast data for testing
 * @param {Object} filters - Current filter settings
 * @returns {Object} Mock forecast data
 */
export const getMockForecastData = (filters) => {
  // Funnel Data
  const funnelData = {
    rawLeads: 5000,
    qualifiedLeads: 3200,
    hotLeads: 1800,
    followUp: 1200,
    deals: 650
  };

  // Lead Source Data
  const sourceData = [
    { source: 'Email', count: 1200, revenue: 25000000, percentage: 24 },
    { source: 'SMS', count: 980, revenue: 18000000, percentage: 19.6 },
    { source: 'Dialer', count: 1500, revenue: 32000000, percentage: 30 },
    { source: 'Landing Page', count: 750, revenue: 15000000, percentage: 15 },
    { source: 'Third Party', count: 570, revenue: 10000000, percentage: 11.4 }
  ];

  // Weekly Trends Data
  const trendsData = generateTrendsData(filters.period);

  // Agent Performance Data
  const agentData = generateAgentData();

  return {
    funnelData,
    sourceData,
    trendsData,
    agentData
  };
};

/**
 * Generate trends data based on period
 * @param {string} period - monthly, quarterly, yearly
 * @returns {Array} Trends data
 */
const generateTrendsData = (period) => {
  const today = new Date();
  const data = [];
  
  if (period === 'monthly') {
    // Generate 4 weeks of data
    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - (i * 7));
      
      data.push({
        period: `Week ${4 - i}`,
        date: weekStart.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
        target: 50000000 + (Math.random() * 10000000),
        achieved: 42000000 + (Math.random() * 15000000)
      });
    }
  } else if (period === 'quarterly') {
    // Generate 3 months of data
    for (let i = 2; i >= 0; i--) {
      const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
      
      data.push({
        period: month.toLocaleDateString('en-IN', { month: 'short' }),
        date: month.getFullYear().toString(),
        target: 150000000 + (Math.random() * 30000000),
        achieved: 125000000 + (Math.random() * 40000000)
      });
    }
  } else {
    // Generate 4 quarters of data
    const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
    const currentQuarter = Math.floor(today.getMonth() / 3);
    
    for (let i = 3; i >= 0; i--) {
      const qIndex = (currentQuarter - i + 4) % 4;
      
      data.push({
        period: quarters[qIndex],
        date: today.getFullYear().toString(),
        target: 450000000 + (Math.random() * 100000000),
        achieved: 380000000 + (Math.random() * 120000000)
      });
    }
  }
  
  return data;
};

/**
 * Generate mock agent performance data
 * @returns {Array} Agent data
 */
const generateAgentData = () => {
  const teams = ['Team A', 'Team B', 'Team C'];
  const agents = [];
  
  for (let i = 1; i <= 15; i++) {
    const target = 30000000 + (Math.random() * 20000000);
    const achieved = target * (0.5 + Math.random() * 0.6); // 50-110% achievement
    const hotLeads = Math.floor(80 + Math.random() * 60);
    const expectedDeals = Math.floor(hotLeads * 0.45); // 45% closing ratio
    
    const daysWithoutUpdate = Math.floor(Math.random() * 15);
    
    agents.push({
      id: `AGT-${String(i).padStart(3, '0')}`,
      name: `Agent ${String.fromCharCode(64 + i)}`,
      team: teams[i % 3],
      target: Math.floor(target),
      achieved: Math.floor(achieved),
      achievementPercentage: (achieved / target) * 100,
      variance: Math.floor(achieved - target),
      hotLeads,
      expectedDeals,
      lastUpdated: daysWithoutUpdate === 0 ? 'Today' : `${daysWithoutUpdate}d ago`,
      isInactive: daysWithoutUpdate >= 7
    });
  }
  
  return agents;
};

/**
 * Get default metrics when no data available
 * @returns {Object} Default metrics
 */
const getDefaultMetrics = () => {
  return {
    expectedDeals: 0,
    hotLeads: 0,
    projectedRevenue: 0,
    targetRevenue: 0,
    achievementPercentage: 0,
    dealsGrowth: 0,
    revenueGrowth: 0,
    activeForecasts: 0,
    inactiveForecasts: 0
  };
};

/**
 * Calculate closing ratio based on historical data
 * @param {number} hotLeads - Number of hot leads
 * @param {number} historicalClosingRate - Historical closing rate (default 0.45)
 * @returns {number} Expected deals
 */
export const calculateExpectedDeals = (hotLeads, historicalClosingRate = 0.45) => {
  return Math.floor(hotLeads * historicalClosingRate);
};

/**
 * Check if forecast gap alert should be triggered
 * @param {number} achievementPercentage - Current achievement percentage
 * @param {number} dayOfMonth - Current day of month
 * @returns {boolean} Should trigger alert
 */
export const shouldTriggerForecastGapAlert = (achievementPercentage, dayOfMonth) => {
  return dayOfMonth >= 20 && achievementPercentage < 60;
};

/**
 * Calculate variance color class
 * @param {number} variance - Variance value
 * @returns {string} Tailwind color class
 */
export const getVarianceColorClass = (variance) => {
  if (variance >= 0) return 'text-green-600';
  if (variance > -5000000) return 'text-yellow-600';
  return 'text-red-600';
};

/**
 * Format currency for display
 * @param {number} value - Numerical value
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (value) => {
  if (value >= 10000000) {
    return `₹${(value / 10000000).toFixed(2)}Cr`;
  } else if (value >= 100000) {
    return `₹${(value / 100000).toFixed(1)}L`;
  }
  return `₹${(value / 1000).toFixed(0)}K`;
};

/**
 * Get performance status based on achievement percentage
 * @param {number} percentage - Achievement percentage
 * @returns {Object} Status object with label and color
 */
export const getPerformanceStatus = (percentage) => {
  if (percentage >= 80) {
    return { label: 'On Track', color: 'green', icon: 'CheckCircle' };
  } else if (percentage >= 60) {
    return { label: 'Needs Attention', color: 'yellow', icon: 'Clock' };
  } else {
    return { label: 'Behind Target', color: 'red', icon: 'AlertCircle' };
  }
};

/**
 * Calculate pipeline health score
 * @param {Object} funnelData - Funnel stage data
 * @returns {Object} Health score and recommendations
 */
export const calculatePipelineHealth = (funnelData) => {
  const conversionRates = {
    rawToQualified: (funnelData.qualifiedLeads / funnelData.rawLeads) * 100,
    qualifiedToHot: (funnelData.hotLeads / funnelData.qualifiedLeads) * 100,
    hotToDeals: (funnelData.deals / funnelData.hotLeads) * 100
  };

  // Calculate overall health score (0-100)
  const healthScore = (
    conversionRates.rawToQualified * 0.3 +
    conversionRates.qualifiedToHot * 0.3 +
    conversionRates.hotToDeals * 0.4
  );

  const recommendations = [];
  
  if (conversionRates.rawToQualified < 50) {
    recommendations.push('Improve lead qualification process');
  }
  if (conversionRates.qualifiedToHot < 40) {
    recommendations.push('Focus on lead nurturing and engagement');
  }
  if (conversionRates.hotToDeals < 30) {
    recommendations.push('Strengthen closing strategies and follow-ups');
  }

  return {
    score: Math.round(healthScore),
    conversionRates,
    recommendations,
    status: healthScore >= 70 ? 'healthy' : healthScore >= 50 ? 'moderate' : 'critical'
  };
};