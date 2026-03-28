import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { settingsApi } from "../../api/settingsApi";
import { HiUserGroup } from "react-icons/hi";

export default function DepartmentManagement() {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadGroups = async () => {
        try {
            setLoading(true);
            const data = await settingsApi.getGroups();
            setGroups(data || []);
        } catch {
            toast.error("Failed to load departments");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadGroups();
    }, []);

    if (loading) return (
        <div className="p-4 sm:p-6 bg-white rounded-xl border border-gray-200 shadow-sm animate-pulse text-sm">
            Loading departments...
        </div>
    );

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6 sm:mb-8">
            <div className="p-4 sm:p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 bg-gradient-to-r from-gray-50 to-white">
                <div>
                    <h2 className="text-base sm:text-lg font-bold text-gray-800">Departments & Teams</h2>
                    <p className="text-sm text-gray-500 mt-1">Manage organizational units and user groups</p>
                </div>
                <span className="self-start sm:self-auto bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                    {groups.length} Active Units
                </span>
            </div>

            <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {groups.map((group) => (
                    <div
                        key={group.id}
                        className="p-4 rounded-xl border border-gray-100 hover:border-indigo-200 hover:shadow-md transition-all group bg-white cursor-pointer overflow-hidden relative"
                    >
                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                            <HiUserGroup size={40} className="text-indigo-600" />
                        </div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 flex-shrink-0">
                                <HiUserGroup size={18} />
                            </div>
                            <h3 className="font-bold text-gray-800 truncate pr-4 text-sm">{group.name}</h3>
                        </div>
                        <div className="flex items-end justify-between">
                            <div>
                                <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">Members</div>
                                <div className="text-xl font-bold text-gray-900">{group.user_count}</div>
                            </div>
                            <div className="pb-1">
                                <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded uppercase">Active</span>
                            </div>
                        </div>
                    </div>
                ))}

                {groups.length === 0 && (
                    <div className="col-span-full py-8 sm:py-12 text-center text-gray-400 border-2 border-dashed border-gray-100 rounded-xl text-sm">
                        No departments or teams found in backend.
                    </div>
                )}
            </div>
        </div>
    );
}