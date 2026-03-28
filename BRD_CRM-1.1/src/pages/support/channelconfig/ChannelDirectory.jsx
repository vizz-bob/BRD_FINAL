import React, { useEffect, useState } from 'react';
import {
    Globe, Share2, Database, MapPin, PhoneCall,
    MoreVertical, Settings2, ShieldCheck, Trash2, Edit3, AlertCircle
} from 'lucide-react';
import EditSourceModal from './EditSourceModal';
import ErrorLogModal from './ErrorLogModal';
import { deletechannels, disablechannels, enablechannels, getchannels, patchchannels } from '../../../services/roiService';

const ChannelDirectory = () => {
    // 1. Move static data to State so it can be changed
    const [channels, setChannels] = useState([]);

    const getIcon = (type) => {
        switch (type?.toLowerCase()) {
            case "aggregator":
                return <Database className="text-orange-600" size={18} />;
            case "social":
                return <Share2 className="text-blue-600" size={18} />;
            case "offline":
                return <MapPin className="text-red-600" size={18} />;
            default:
                return <Globe className="text-teal-600" size={18} />;
        }
    };

    const transformChannels = (data) => {
        return data.map((item, index) => ({
            id: item.id,
            name: `${item.channel_name}${item.integration_required ? " API" : ""}`,
            type: item.channel_type
                ? item.channel_type.charAt(0).toUpperCase() +
                item.channel_type.slice(1)
                : "Unknown",
            routing:
                item.Operational_valve?.toLowerCase() === "telecaller"
                    ? "Telecallers"
                    : "Field Agents",
            priority: item.priority,
            status: item.is_active ? "Active" : "Inactive",
            icon: getIcon(item.channel_type),
        }));
    };

    const loadChannels = async () => {
        try {
            const res = await getchannels();
            const mapped = transformChannels(res.data);
            setChannels(mapped);
        } catch (error) {
            console.error("Error loading channels:", error);
        }
    }

    useEffect(() => {
        loadChannels();
    }, [])

    const [openMenuId, setOpenMenuId] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const [selectedChannel, setSelectedChannel] = useState(null);

    const handleEditClick = (channel) => {
        setSelectedChannel(channel);
        setIsEditModalOpen(true);
        setOpenMenuId(null); 
    };

    const handleErrorClick = (channel) => {
        setSelectedChannel(channel);
        setIsErrorModalOpen(true);
        setOpenMenuId(null); 
    };

    // 2. Function to Toggle Valve Status (Point 1 of your docs)
    const toggleStatus = async (channel) => {
        try {
            if (channel.status === "Active") {
                await disablechannels(channel.id);
            } else {
                await enablechannels(channel.id);
            }
            setChannels(prev =>
                prev.map(ch =>
                    ch.id === channel.id
                        ? { ...ch, status: ch.status === "Active" ? "Inactive" : "Active" }
                        : ch
                )
            );

        } catch (error) {
            console.error("Failed to toggle channel status:", error);
            alert("Failed to update channel status.");
        }
    };

    // 3. Function to Delete a Channel
    const deleteChannel = async (id) => {
        if (window.confirm("Are you sure you want to disable this supply pipe?")) {
            try {
                await deletechannels(id);
                await loadChannels();
            }
            catch (error) {
                alert("Failed to delete channel.");
            }
            setOpenMenuId(null);
        }
    };

    const handleEdit = async (updatedChannel) => {
        try {
            await patchchannels(updatedChannel.id, {
                priority: updatedChannel.priority,
                Operational_valve:
                    updatedChannel.routing === "Telecallers"
                        ? "telecaller"
                        : "field agent"
            });

            await loadChannels();
            setIsEditModalOpen(false);

        } catch (error) {
            alert("Failed to update channel.");
        }
    };

    return (
        <div className="p-4 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h3 className="text-lg font-bold text-gray-900">Operational Lead Origins</h3>
                    <p className="text-xs text-gray-500 mt-1 italic">Manage active reservoirs and routing logic.</p>
                </div>
            </div>

            <div className="border border-gray-100 rounded-2xl overflow-visible shadow-sm bg-white">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Lead Source</th>
                                <th className="px-6 py-4">Operational Routing</th>
                                <th className="px-6 py-4">Priority Logic</th>
                                <th className="px-6 py-4">Valve Status</th>
                                <th className="px-6 py-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {channels.map((ch) => (
                                <tr key={ch.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-gray-50 rounded-lg">{ch.icon}</div>
                                            <div>
                                                <p className="font-bold text-gray-900">{ch.name}</p>
                                                <p className="text-[10px] text-gray-400 font-medium">{ch.type}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                                            {ch.routing === 'Telecallers' ? <PhoneCall size={14} className="text-blue-500" /> : <MapPin size={14} className="text-red-500" />}
                                            {ch.routing}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-[10px] font-bold uppercase ${ch.priority === 'Critical' ? 'text-red-600' : 'text-orange-600'
                                            }`}>
                                            ● {ch.priority}
                                        </span>
                                    </td>

                                    {/* FUNCTIONAL TOGGLE */}
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => toggleStatus(ch)}
                                            className="flex items-center gap-2 group outline-none"
                                        >
                                            <div className={`w-9 h-5 rounded-full relative transition-all duration-300 ${ch.status === 'Active' ? 'bg-green-500' : 'bg-gray-300'}`}>
                                                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 ${ch.status === 'Active' ? 'right-1' : 'left-1'}`} />
                                            </div>
                                            <span className={`text-[10px] font-bold uppercase transition-colors ${ch.status === 'Active' ? 'text-green-600' : 'text-gray-400'}`}>
                                                {ch.status}
                                            </span>
                                        </button>
                                    </td>

                                    {/* FUNCTIONAL ACTION MENU */}
                                    <td className="px-6 py-4 text-center relative">
                                        <button
                                            onClick={() => setOpenMenuId(openMenuId === ch.id ? null : ch.id)}
                                            className={`p-2 rounded-lg transition-all ${openMenuId === ch.id ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
                                        >
                                            <MoreVertical size={18} />
                                        </button>

                                        {openMenuId === ch.id && (
                                            <div className="absolute right-12 top-10 w-40 bg-white border border-gray-100 rounded-xl shadow-xl z-50 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                                <button onClick={() => handleEditClick(ch)} className="w-full px-4 py-2 text-left text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                                    <Edit3 size={14} /> Edit Source
                                                </button>
                                                <button onClick={() => handleErrorClick(ch)} className="w-full px-4 py-2 text-left text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                                    <AlertCircle size={14} /> View Error Logs
                                                </button>
                                                <div className="my-1 border-t border-gray-50" />
                                                <button
                                                    onClick={() => deleteChannel(ch.id)}
                                                    className="w-full px-4 py-2 text-left text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2"
                                                >
                                                    <Trash2 size={14} /> Remove Source
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {isEditModalOpen && (
                <EditSourceModal onEdit={handleEdit} channel={selectedChannel} onClose={() => setIsEditModalOpen(false)} />
            )}

            {isErrorModalOpen && (
                <ErrorLogModal channel={selectedChannel} onClose={() => setIsErrorModalOpen(false)} />
            )}
        </div>
    );
};

export default ChannelDirectory;