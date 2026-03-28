import { User, Phone, Mail, Building2, Tag, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import QuickActionButtons from './QuickActionButtons';

const ContactCard = ({ contact, isSelected, viewMode, onSelect, onEdit, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getStatusColor = (status) => {
    return status === 'Active' 
      ? 'bg-green-100 text-green-700' 
      : 'bg-red-100 text-red-600';
  };

  const name = contact.full_name || contact.fullName || '';
  const id = contact.id || contact.pk || '';
  const mobile = contact.mobile_number || contact.mobile || '';
  const email = contact.email || '';
  const accountName = contact.accountName || contact.account_name || '';
  const status = contact.status || 'Unknown';
  const tags = Array.isArray(contact.tags)
    ? contact.tags
    : (contact.tags ? String(contact.tags).split(',').map(t => t.trim()).filter(Boolean) : []);

  return (
    <div
      className={`bg-white rounded-2xl border-2 transition-all cursor-pointer hover:shadow-md ${
        isSelected ? 'border-indigo-600' : 'border-gray-200'
      }`}
      onClick={onSelect}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
              <span className="text-indigo-600 font-semibold text-lg">
                {name.charAt(0) || '-'}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{name}</h3>
              <p className="text-xs text-gray-500">{id}</p>
            </div>
          </div>

          <div className="relative" ref={menuRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-1 hover:bg-gray-100 rounded-lg transition"
            >
              <MoreVertical className="w-4 h-4 text-gray-600" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-xl shadow-lg z-10">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 rounded-t-xl"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-b-xl"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-2 mb-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone className="w-4 h-4" />
            <span>{mobile}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Mail className="w-4 h-4" />
            <span className="truncate">{email}</span>
          </div>
          {accountName && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Building2 className="w-4 h-4" />
              <span className="truncate">{accountName}</span>
            </div>
          )}
        </div>

        {/* Tags & Status */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(status)}`}>
            {status}
          </span>
          {tags.map((tag, idx) => (
            <span key={idx} className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
              {tag}
            </span>
          ))}
        </div>

        {/* Quick Actions */}
        <QuickActionButtons contact={contact} />
      </div>
    </div>
  );
};

export default ContactCard;