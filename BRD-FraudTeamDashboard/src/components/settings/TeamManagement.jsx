import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { settingsApi } from "../../api/settingsApi";
import { HiUserCircle } from "react-icons/hi";

export default function TeamManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const data = await settingsApi.getUsers();
            setUsers(data || []);
        } catch {
            toast.error("Failed to load team members");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    if (loading) return (
        <div className="p-4 sm:p-6 bg-white rounded-xl border border-gray-200 shadow-sm animate-pulse text-sm">
            Loading team...
        </div>
    );

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <div>
                    <h2 className="text-base sm:text-lg font-bold text-gray-800">Team Members</h2>
                    <p className="text-sm text-gray-500 mt-1">Manage your team and their active status</p>
                </div>
                <span className="self-start sm:self-auto bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                    {users.length} Total
                </span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left" style={{ minWidth: "600px" }}>
                    <thead className="bg-gray-50 text-gray-600 font-semibold uppercase tracking-wider text-[11px]">
                        <tr>
                            <th className="px-4 sm:px-6 py-3 sm:py-4">User</th>
                            <th className="px-4 sm:px-6 py-3 sm:py-4">Contact</th>
                            <th className="px-4 sm:px-6 py-3 sm:py-4">Groups / Teams</th>
                            <th className="px-4 sm:px-6 py-3 sm:py-4">Role</th>
                            <th className="px-4 sm:px-6 py-3 sm:py-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-4 sm:px-6 py-3 sm:py-4">
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100 shadow-sm flex-shrink-0">
                                            <HiUserCircle size={20} />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="font-bold text-gray-900 text-xs sm:text-sm truncate">
                                                {user.first_name} {user.last_name}
                                            </div>
                                            <div className="text-xs text-gray-500 truncate">@{user.username}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 sm:px-6 py-3 sm:py-4">
                                    <div className="text-gray-800 font-medium text-xs sm:text-sm truncate max-w-[140px]">
                                        {user.email}
                                    </div>
                                    <div className="text-xs text-gray-400 mt-0.5">{user.phone || "No phone"}</div>
                                </td>
                                <td className="px-4 sm:px-6 py-3 sm:py-4">
                                    <div className="flex flex-wrap gap-1">
                                        {(user.groups_list || []).map(group => (
                                            <span key={group} className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tight">
                                                {group}
                                            </span>
                                        ))}
                                        {(!user.groups_list || user.groups_list.length === 0) && (
                                            <span className="text-gray-400 italic text-[10px]">No groups</span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-4 sm:px-6 py-3 sm:py-4">
                                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-semibold whitespace-nowrap">
                                        {user.role || "Member"}
                                    </span>
                                </td>
                                <td className="px-4 sm:px-6 py-3 sm:py-4">
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)] flex-shrink-0"></span>
                                        <span className="text-green-700 font-bold text-xs uppercase tracking-tight whitespace-nowrap">Active</span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {users.length === 0 && (
                <div className="p-8 sm:p-12 text-center text-gray-400 text-sm">
                    No team members found in database
                </div>
            )}
        </div>
    );
}