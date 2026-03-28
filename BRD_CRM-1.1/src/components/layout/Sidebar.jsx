// Sidebar.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { menuItems } from '../../utils/constants';

const Sidebar = ({ isOpen, onClose }) => {
  const [expandedItem, setExpandedItem] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Auto-expand the active section on mount
  useEffect(() => {
    const currentPath = location.pathname;
    menuItems.forEach((item, idx) => {
      const mainPath = item.path || slugify(item.title);
      if (currentPath.includes(mainPath)) {
        setExpandedItem(idx);
      }
    });
  }, [location.pathname]);

  const slugify = (s) =>
    s
      .toLowerCase()
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

  const handleMainItemClick = (idx) => {
    setExpandedItem(expandedItem === idx ? null : idx);
  };

  const handleSubtabClick = (item, subtab) => {
    const mainPath = item.path || slugify(item.title);
    const subPath = subtab.path || slugify(subtab.name).replace(/-campaign$/, '');
    const route = `/dashboard/${mainPath}/${subPath}`;
    navigate(route);
    if (onClose) onClose();
  };

  const isSubtabActive = (item, subtab) => {
    const mainPath = item.path || slugify(item.title);
    const subPath = subtab.path || slugify(subtab.name).replace(/-campaign$/, '');
    const route = `/dashboard/${mainPath}/${subPath}`;
    return location.pathname === route;
  };

  const isMainItemActive = (item) => {
    const mainPath = item.path || slugify(item.title);
    return location.pathname.includes(mainPath);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:static inset-y-0 left-0 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-transform duration-300 ease-in-out z-50 w-64 bg-white text-gray-800 flex flex-col border-r border-gray-200`}
      >
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-indigo-600">CRM System</h2>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          {menuItems.map((item, idx) => (
            <div key={idx} className="mb-2">
              {/* Main Menu Item */}
              <button
                onClick={() => handleMainItemClick(idx)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors text-left ${
                  isMainItemActive(item)
                    ? 'bg-indigo-100 text-indigo-700 font-semibold'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.title}</span>
                </div>
                {expandedItem === idx ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>

              {/* Subtabs Dropdown */}
              {expandedItem === idx && (
                <div className="mt-1 ml-4 space-y-1 animate-slideDown">
                  {item.subtabs.map((subtab, subIdx) => (
                    <button
                      key={subIdx}
                      onClick={() => handleSubtabClick(item, subtab)}
                      className={`w-full flex items-center space-x-3 px-4 py-2 text-left rounded transition-colors text-sm ${
                        isSubtabActive(item, subtab)
                          ? 'bg-indigo-100 text-indigo-700 font-medium'
                          : 'hover:bg-gray-100 text-gray-600'
                      }`}
                    >
                      <subtab.icon className="w-4 h-4 flex-shrink-0" />
                      <span>{subtab.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
