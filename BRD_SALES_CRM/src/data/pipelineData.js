export const pipelineColumns = [
  {
    stage: 'New',
    leads: [
      {
        name: 'Rohit Malhotra',
        loan: 'Working Capital',
        amount: '₹12L',
        timeAgo: '2h',
        owner: 'me',
        pendingDocs: true,
        payoutDue: false,
      },
      {
        name: 'Infy Traders',
        loan: 'Invoice Finance',
        amount: '₹8L',
        timeAgo: '4h',
        owner: 'team',
        pendingDocs: false,
        payoutDue: false,
      },
    ],
  },
  {
    stage: 'Contacted',
    leads: [
      {
        name: 'Avantika Shah',
        loan: 'Personal Loan',
        amount: '₹18L',
        timeAgo: '6h',
        owner: 'me',
        pendingDocs: false,
        payoutDue: false,
      },
      {
        name: 'NutriHealth Pvt.',
        loan: 'Equipment Finance',
        amount: '₹25L',
        timeAgo: '1d',
        owner: 'team',
        pendingDocs: true,
        payoutDue: false,
      },
    ],
  },
  {
    stage: 'Application Submitted',
    leads: [
      {
        name: 'Aarav Mehta',
        loan: 'Home Loan',
        amount: '₹56L',
        timeAgo: '1d',
        owner: 'me',
        pendingDocs: false,
        payoutDue: true,
      },
      {
        name: 'Sarthak Foods',
        loan: 'SME Loan',
        amount: '₹32L',
        timeAgo: '2d',
        owner: 'team',
        pendingDocs: true,
        payoutDue: false,
      },
    ],
  },
  {
    stage: 'Approved',
    leads: [
      {
        name: 'Kavya Steel',
        loan: 'Machinery Loan',
        amount: '₹41L',
        timeAgo: '2d',
        owner: 'team',
        pendingDocs: false,
        payoutDue: true,
      },
    ],
  },
  {
    stage: 'Disbursed',
    leads: [
      {
        name: 'Vihaan Infra',
        loan: 'Project Finance',
        amount: '₹1.2Cr',
        timeAgo: '3d',
        owner: 'me',
        pendingDocs: false,
        payoutDue: true,
      },
    ],
  },
];

export const quickFilterLabels = {
  'my-leads': 'My leads',
  'team-leads': 'Team leads',
  'pending-docs': 'Pending docs',
  'payout-due': 'Payout due',
};

const matchesFilter = (lead, filter) => {
  if (!filter) return true;
  switch (filter) {
    case 'my-leads':
      return lead.owner === 'me';
    case 'team-leads':
      return lead.owner !== 'me';
    case 'pending-docs':
      return lead.pendingDocs;
    case 'payout-due':
      return lead.payoutDue;
    default:
      return true;
  }
};

export const applyPipelineFilter = (columns, filter) => {
  const totalLeads = columns.reduce((sum, col) => sum + col.leads.length, 0);

  if (!filter) {
    return { columns, matched: true, filteredCount: totalLeads };
  }

  const filtered = columns
    .map((col) => ({
      ...col,
      leads: col.leads.filter((lead) => matchesFilter(lead, filter)),
    }))
    .filter((col) => col.leads.length > 0);

  const filteredCount = filtered.reduce((sum, col) => sum + col.leads.length, 0);

  if (!filteredCount) {
    return { columns, matched: false, filteredCount: 0 };
  }

  return {
    columns: filtered,
    matched: true,
    filteredCount,
  };
};
