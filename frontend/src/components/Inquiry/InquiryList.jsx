import React, { useEffect, useState } from "react";
import { useInquiryStore } from "../../stores/inquiry.store";
import { useAuthStore } from "../../stores/auth.store";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

export default function InquiryList() {
  const { inquiries, loading, getInquiries, deleteInquiry } = useInquiryStore();
  const { authUser } = useAuthStore();
  const [statusFilter, setStatusFilter] = useState(null);
  const [page, setPage] = useState(1);

  // Fetch inquiries on mount or when filter/page changes
  useEffect(() => {
    if (authUser) {
      getInquiries(statusFilter, page);
    }
  }, [authUser, statusFilter, page]);

  const handleDelete = async (inquiryId) => {
    if (window.confirm("Are you sure you want to delete this inquiry?")) {
      try {
        await deleteInquiry(inquiryId);
      } catch (error) {
        console.error("Error deleting inquiry:", error);
      }
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "pending":
        return "badge-warning";
      case "processing":
        return "badge-info";
      case "responded":
        return "badge-success";
      case "completed":
        return "badge-primary";
      default:
        return "badge-gray";
    }
  };

  const getStatusLabel = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (!authUser) {
    return (
      <div className="w-full max-w-[1180px] p-8 text-center">
        <p className="text-gray-500">Please login to view your inquiries</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1180px] p-6 bg-base-100 rounded border border-gray-300 mt-4">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">My Inquiries</h2>

        {/* Filter Buttons */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => {
              setStatusFilter(null);
              setPage(1);
            }}
            className={`btn btn-sm ${
              statusFilter === null ? "btn-primary" : "btn-outline"
            }`}
          >
            All
          </button>
          <button
            onClick={() => {
              setStatusFilter("pending");
              setPage(1);
            }}
            className={`btn btn-sm ${
              statusFilter === "pending" ? "btn-warning" : "btn-outline"
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => {
              setStatusFilter("processing");
              setPage(1);
            }}
            className={`btn btn-sm ${
              statusFilter === "processing" ? "btn-info" : "btn-outline"
            }`}
          >
            Processing
          </button>
          <button
            onClick={() => {
              setStatusFilter("responded");
              setPage(1);
            }}
            className={`btn btn-sm ${
              statusFilter === "responded" ? "btn-success" : "btn-outline"
            }`}
          >
            Responded
          </button>
          <button
            onClick={() => {
              setStatusFilter("completed");
              setPage(1);
            }}
            className={`btn btn-sm ${
              statusFilter === "completed" ? "btn-primary" : "btn-outline"
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      )}

      {/* Empty State */}
      {!loading && inquiries.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded">
          <p className="text-gray-500 mb-2">No inquiries found</p>
          <p className="text-sm text-gray-400">
            Send an inquiry to get quotes from suppliers
          </p>
        </div>
      )}

      {/* Inquiries Table */}
      {!loading && inquiries.length > 0 && (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Status</th>
                <th>Responses</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map((inquiry) => (
                <tr key={inquiry._id} className="hover">
                  <td>
                    <div>
                      <p className="font-medium text-sm">{inquiry.itemName}</p>
                      {inquiry.description && (
                        <p className="text-xs text-gray-500 truncate max-w-[200px]">
                          {inquiry.description}
                        </p>
                      )}
                    </div>
                  </td>
                  <td>
                    {inquiry.quantity} {inquiry.unit}
                  </td>
                  <td>
                    <div className={`badge ${getStatusBadgeColor(inquiry.status)}`}>
                      {getStatusLabel(inquiry.status)}
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-outline">
                      {inquiry.responses?.length || 0} responses
                    </span>
                  </td>
                  <td className="text-sm">
                    {new Date(inquiry.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <Link
                        to={`/inquiry/${inquiry._id}`}
                        className="btn btn-xs btn-info"
                      >
                        View
                      </Link>
                      {inquiry.status === "pending" && (
                        <button
                          onClick={() => handleDelete(inquiry._id)}
                          className="btn btn-xs btn-error"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {!loading && inquiries.length > 0 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="btn btn-sm btn-outline"
          >
            Previous
          </button>
          <span className="px-4 py-2">Page {page}</span>
          <button
            onClick={() => setPage(page + 1)}
            className="btn btn-sm btn-outline"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
