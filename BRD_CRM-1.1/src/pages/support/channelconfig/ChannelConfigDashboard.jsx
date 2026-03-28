import React, { useState } from 'react';
import {
    Radio,
    Activity,
    TrendingUp,
    Settings,
    AlertCircle,
    ShieldCheck,
    Zap,
    Filter
} from 'lucide-react';

import ChannelDirectory from './ChannelDirectory';
import ROIPerformance from './ROIPerformance';
import TechnicalHealth from './TechnicalHealth';
import AddSourceModal from './AddSourceModal';

const ChannelConfigDashboard = () => {
    const [activeTab, setActiveTab] = useState('config');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const tabs = [
        { id: 'config', label: 'Source Configuration', icon: Settings },
        { id: 'roi', label: 'ROI Diagnostic', icon: TrendingUp },
        { id: 'health', label: 'Technical Health', icon: Activity },
    ];

    const stats = [
        { label: 'Total Channels', value: 'NA', icon: Radio, color: 'blue', detail: '8 Active' },
        { label: 'System Health', value: 'NA', icon: ShieldCheck, color: 'green', detail: 'API Stable' },
        { label: 'Avg. CPL', value: 'NA', icon: Zap, color: 'purple', detail: 'Within Budget' },
        { label: 'Open Incidents', value: 'NA', icon: AlertCircle, color: 'red', detail: 'SLA: 2h' }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* 1. Header & Operational Stats */}
            <div className="bg-white border-b border-gray-200 px-4 py-6 sm:py-8 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-indigo-100 rounded-lg shadow-lg">
                                <Radio className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
                            </div>
                            <div>
                                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Channel & Infrastructure</h1>
                                <p className="text-xs sm:text-sm text-gray-500 italic">Support & Operations Module</p>
                            </div>
                        </div>
                        <button onClick={() => setIsAddModalOpen(true)} className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-all">
                            <Settings size={14} /> Add Lead Source
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {stats.map((stat, idx) => (
                            <div key={idx} className="bg-gray-50 rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all">

                                <div className="flex items-center justify-between">
                                    <div>
                                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                                    <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                                    <p className={`text-[10px] font-bold mt-1 uppercase ${stat.color === 'red' ? 'text-red-500' : 'text-gray-400'}`}>{stat.detail}</p>
                                    </div>
                                    <div className={`p-4 rounded-lg bg-${stat.color}-100`}>
                                        <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 2. Navigation Tabs */}
            <div className="bg-white border-b border-gray-200 px-4 lg:px-8 sticky top-0 z-20 overflow-x-auto no-scrollbar">
                <div className="max-w-7xl mx-auto">
                    <nav className="flex space-x-4 sm:space-x-8 whitespace-nowrap">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center space-x-2 py-4 border-b-2 transition-all text-xs sm:text-sm font-medium ${activeTab === tab.id
                                        ? 'border-blue-600 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            {/* 3. Sub-Module Content */}
            <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-8 lg:px-8">
                <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm min-h-[500px] overflow-hidden">
                    {activeTab === 'config' && <ChannelDirectory />}
                    {activeTab === 'roi' && <ROIPerformance />}
                    {activeTab === 'health' && <TechnicalHealth />}
                </div>
            </div>
            {isAddModalOpen && (
                <AddSourceModal onClose={() => setIsAddModalOpen(false)} />
            )}
        </div>
    );
};

export default ChannelConfigDashboard;