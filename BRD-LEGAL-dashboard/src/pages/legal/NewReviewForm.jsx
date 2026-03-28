import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createReview } from "../../api/dashboardApi";
import { getAllUsers } from "../../api/authApi";
import { useMessage } from "../../context/MessageContext";

const NewReviewForm = () => {
  const navigate = useNavigate();
  const { addMessage } = useMessage();
  
  const [formData, setFormData] = useState({
    review_title: "",
    description: "",
    assigned_to: "",
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch available users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getAllUsers();
      const normalizedUsers = Array.isArray(response)
        ? response
        : response?.results || response?.users || [];
      setUsers(normalizedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      // Fallback: use hardcoded users if API fails
      setUsers([
        { id: 1, username: "harika" },
        { id: 2, username: "srinidhi" },
        { id: 3, username: "sri" },
        { id: 4, username: "nidhi" },
        { id: 5, username: "Lekha" },
        { id: 9, username: "test_reviewer" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.review_title.trim()) {
      addMessage("Please enter a review title", "error");
      return;
    }
    if (!formData.description.trim()) {
      addMessage("Please enter a description", "error");
      return;
    }
    if (!formData.assigned_to) {
      addMessage("Please assign the review to a user", "error");
      return;
    }

    try {
      setSubmitting(true);
      const reviewData = {
        review_title: formData.review_title,
        description: formData.description,
        assigned_to: parseInt(formData.assigned_to),
        status: "Pending",
      };

      console.log("Creating review with data:", reviewData);
      const response = await createReview(reviewData);
      
      console.log("Review created successfully:", response);
      addMessage("Review created successfully!", "success");
      
      // Reset form
      setFormData({
        review_title: "",
        description: "",
        assigned_to: "",
      });
      
      // Navigate back to dashboard after 1.5 seconds
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      console.error("Error creating review:", error);
      const errorMsg =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.message ||
        "Failed to create review";
      addMessage(`Error: ${errorMsg}`, "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Create New Review
        </h1>
        
        {loading && (
          <div className="mb-4 p-4 bg-blue-100 text-blue-700 rounded-md">
            Loading users...
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="review_title"
              className="block text-sm font-medium text-gray-700"
            >
              Review Title *
            </label>
            <input
              type="text"
              id="review_title"
              name="review_title"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.review_title}
              onChange={handleInputChange}
              placeholder="Enter review title"
              required
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              rows="4"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter review description"
              required
            ></textarea>
          </div>

          <div>
            <label
              htmlFor="assigned_to"
              className="block text-sm font-medium text-gray-700"
            >
              Assign To *
            </label>
            <select
              id="assigned_to"
              name="assigned_to"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.assigned_to}
              onChange={handleInputChange}
              required
            >
              <option value="">Select a user</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.username} (ID: {user.id})
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 disabled:bg-blue-400"
              disabled={submitting}
            >
              {submitting ? "Creating..." : "Create Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewReviewForm;
