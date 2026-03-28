import React, { useState, useEffect, useCallback } from "react";
import {
  getPropertyChecks,
  createPropertyCheck,
  updatePropertyCheck,
  deletePropertyCheck,
  getDashboard,
} from "../../service/propertyService";
import NewPropertyCheckModal from "../../components/NewPropertyCheckModal";
import ViewPropertyDetailsModal from "../../components/ViewPropertyDetailsModal";
import {
  ClipboardDocumentCheckIcon,
  CheckCircleIcon,
  BuildingLibraryIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { FieldVerificationMetrics } from "../../components/DashboardComponents";

const PropertyChecks = () => {
  const [properties, setProperties] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isNewPropertyCheckModalOpen, setIsNewPropertyCheckModalOpen] =
    useState(false);
  const [isViewDetailsModalOpen, setIsViewDetailsModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);

  // Fetch all property checks from API
  // Service returns full axios response, so we unwrap .data
  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getPropertyChecks();
      setProperties(response.data);
    } catch (err) {
      setError("Failed to load property checks. Please try again.");
      console.error("Error fetching property checks:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch dashboard stats from API
  const fetchDashboard = useCallback(async () => {
    try {
      const response = await getDashboard();
      setDashboardStats(response.data);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    }
  }, []);

  useEffect(() => {
    fetchProperties();
    fetchDashboard();
  }, [fetchProperties, fetchDashboard]);

  // Build stats cards — prefer live dashboard data if available
  const propertyStats = [
    {
      title: "Total Properties",
      mainValue: dashboardStats?.total_properties ?? properties.length,
      subText: "↑ 12 this month",
      trendValue: 12,
      trendType: "up",
      icon: BuildingLibraryIcon,
    },
    {
      title: "Pending Checks",
      mainValue:
        dashboardStats?.pending_checks ??
        properties.filter((p) => p.status?.toLowerCase() === "pending").length,
      subText: "Requires attention",
      trendValue: 5,
      trendType: "down",
      icon: ClipboardDocumentCheckIcon,
    },
    {
      title: "In Progress",
      mainValue:
        dashboardStats?.in_progress ??
        properties.filter((p) =>
          ["in progress", "in-progress"].includes(p.status?.toLowerCase())
        ).length,
      subText: "On schedule",
      trendValue: 12,
      trendType: "up",
      icon: ClockIcon,
    },
    {
      title: "Completed",
      mainValue:
        dashboardStats?.completed ??
        properties.filter((p) => p.status?.toLowerCase() === "completed")
          .length,
      subText: "This month",
      trendValue: 25,
      trendType: "up",
      icon: CheckCircleIcon,
    },
  ];

  const getStatusColor = (status) => {
    const colors = {
      Pending: "yellow",
      "In Progress": "blue",
      Completed: "green",
      pending: "yellow",
      "in-progress": "blue",
      "in progress": "blue",
      completed: "green",
      "not-started": "gray",
    };
    return colors[status] || "gray";
  };

  const filteredProperties = properties.filter((prop) => {
    const propStatus = prop.status?.toLowerCase() ?? "";
    if (filter !== "all" && propStatus !== filter.toLowerCase()) return false;
    if (
      searchQuery &&
      !prop.name?.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !prop.id?.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  // Update a single check item's status via API
  const handleCheckItemUpdate = async (propertyId, itemId, newStatus) => {
    // Optimistically update local state
    setProperties((prevProperties) =>
      prevProperties.map((property) =>
        property.id === propertyId
          ? {
              ...property,
              checkItems: property.checkItems?.map((item) =>
                item.id === itemId ? { ...item, status: newStatus } : item
              ),
            }
          : property
      )
    );

    try {
      const property = properties.find((p) => p.id === propertyId);
      if (!property) return;

      const updatedCheckItems = property.checkItems?.map((item) =>
        item.id === itemId ? { ...item, status: newStatus } : item
      );

      await updatePropertyCheck(propertyId, {
        ...property,
        checkItems: updatedCheckItems,
      });
    } catch (err) {
      console.error("Error updating check item:", err);
      // Revert optimistic update on failure
      fetchProperties();
    }
  };

  // Called when a new property check is created via modal
  const handleCreatePropertyCheck = async (data) => {
    try {
      const response = await createPropertyCheck(data);
      setProperties((prev) => [...prev, response.data]); // unwrap .data
      setIsNewPropertyCheckModalOpen(false);
      fetchDashboard();
    } catch (err) {
      console.error("Error creating property check:", err);
      throw err;
    }
  };

  // Delete a property check
  const handleDeletePropertyCheck = async (propertyId) => {
    try {
      await deletePropertyCheck(propertyId);
      setProperties((prev) => prev.filter((p) => p.id !== propertyId));
      fetchDashboard();
    } catch (err) {
      console.error("Error deleting property check:", err);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Property Checks</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and track property inspection checklists
          </p>
        </div>
        <button
          onClick={() => setIsNewPropertyCheckModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          New Property Check
        </button>
      </div>

      {/* Statistics Cards */}
      <FieldVerificationMetrics items={propertyStats} />

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
          {/* Status Filter */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <label className="text-sm text-gray-600">Status:</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border rounded-lg w-full md:w-auto"
            >
              <option value="all">All Properties</option>
              <option value="pending">Pending</option>
              <option value="in progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Search Input */}
          <div className="flex-1 w-full">
            <input
              type="search"
              placeholder="Search by property name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
            />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-500">Loading properties...</span>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
            <p className="text-red-700 text-sm">{error}</p>
            <button
              onClick={fetchProperties}
              className="text-red-600 hover:text-red-800 text-sm font-medium underline ml-4"
            >
              Retry
            </button>
          </div>
        )}

        {/* Properties Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProperties.map((property) => (
              <div
                key={property.id}
                className="border rounded-lg overflow-hidden"
              >
                <div className="p-4 border-b bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {property.name}
                      </h3>
                      <p className="text-sm text-gray-500">{property.id}</p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full bg-${getStatusColor(
                        property.status
                      )}-100 text-${getStatusColor(property.status)}-800`}
                    >
                      {property.status}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    <p>{property.type}</p>
                    <p>{property.location}</p>
                  </div>
                </div>

                <div className="p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    Check Items
                  </h4>
                  {property.checkItems?.length > 0 ? (
                    <ul className="space-y-2">
                      {property.checkItems.map((item) => (
                        <li
                          key={item.id}
                          className="flex items-center justify-between"
                        >
                          <span className="text-sm text-gray-600">
                            {item.item}
                          </span>
                          <select
                            value={item.status}
                            onChange={(e) =>
                              handleCheckItemUpdate(
                                property.id,
                                item.id,
                                e.target.value
                              )
                            }
                            className={`text-sm px-2 py-1 rounded border bg-${getStatusColor(
                              item.status
                            )}-100 text-${getStatusColor(item.status)}-800`}
                          >
                            <option value="not-started">Not Started</option>
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                          </select>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-400 italic">
                      No check items
                    </p>
                  )}
                </div>

                <div className="p-4 border-t bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      Assigned to:{" "}
                      <span className="text-gray-900">
                        {property.assignedTo ?? property.assigned_to ?? "—"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          setSelectedProperty(property);
                          setIsViewDetailsModalOpen(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleDeletePropertyCheck(property.id)}
                        className="text-red-500 hover:text-red-700 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && filteredProperties.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No properties match your filters.
          </div>
        )}
      </div>

      {/* Property Check Guidelines */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          Property Check Guidelines
        </h3>
        <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
          <li>Complete all check items in the specified order</li>
          <li>Document any issues with photographs</li>
          <li>Verify all measurements against property documents</li>
          <li>Check for any unauthorized modifications</li>
          <li>Report any safety concerns immediately</li>
        </ul>
      </div>

      <NewPropertyCheckModal
        isOpen={isNewPropertyCheckModalOpen}
        onClose={() => setIsNewPropertyCheckModalOpen(false)}
        onSubmit={handleCreatePropertyCheck}
      />

      <ViewPropertyDetailsModal
        isOpen={isViewDetailsModalOpen}
        onClose={() => setIsViewDetailsModalOpen(false)}
        property={selectedProperty}
      />
    </div>
  );
};

export default PropertyChecks;
