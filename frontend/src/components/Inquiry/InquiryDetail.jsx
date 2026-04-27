import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useInquiryStore } from "../../stores/inquiry.store";
import { useAuthStore } from "../../stores/auth.store";
import toast from "react-hot-toast";

export default function InquiryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentInquiry, loading, getInquiryById, deleteInquiry, clearCurrentInquiry } =
    useInquiryStore();
  const { authUser } = useAuthStore();

  useEffect(() => {
    if (id && authUser) {
      getInquiryById(id);
    }

    return () => clearCurrentInquiry();
  }, [id, authUser]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!currentInquiry) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Inquiry not found</p>
          <button
            onClick={() => navigate(-1)}
            className="btn btn-primary"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this inquiry?")) {
      try {
        await deleteInquiry(currentInquiry._id);
        navigate("/inquiries");
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

  return (
    <div className="w-full min-h-screen bg-base-200 py-8">
      <div className="max-w-[800px] mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Inquiry Details</h1>
          <button
            onClick={() => navigate(-1)}
            className="btn btn-outline"
          >
            Back
          </button>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded border border-gray-300 p-8 space-y-6">
          {/* Inquiry Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-500">Item Name</label>
              <p className="text-lg font-semibold text-gray-900">{currentInquiry.itemName}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Status</label>
              <div className={`badge badge-lg ${getStatusBadgeColor(currentInquiry.status)} mt-1`}>
                {getStatusLabel(currentInquiry.status)}
              </div>
            </div>
          </div>

          {/* Description */}
          {currentInquiry.description && (
            <div>
              <label className="text-sm text-gray-500">Description</label>
              <p className="text-gray-700 whitespace-pre-wrap">{currentInquiry.description}</p>
            </div>
          )}

          {/* Quantity and Unit */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-500">Quantity</label>
              <p className="text-lg font-semibold text-gray-900">{currentInquiry.quantity}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Unit</label>
              <p className="text-lg font-semibold text-gray-900">{currentInquiry.unit}</p>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
            <div>
              <label>Created</label>
              <p>{new Date(currentInquiry.createdAt).toLocaleString()}</p>
            </div>
            <div>
              <label>Updated</label>
              <p>{new Date(currentInquiry.updatedAt).toLocaleString()}</p>
            </div>
          </div>

          {/* Divider */}
          <div className="divider"></div>

          {/* Responses */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Supplier Responses ({currentInquiry.responses?.length || 0})
            </h2>

            {currentInquiry.responses && currentInquiry.responses.length > 0 ? (
              <div className="space-y-4">
                {currentInquiry.responses.map((response, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded p-4 bg-gray-50"
                  >
                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div>
                        <label className="text-xs text-gray-500">Supplier</label>
                        <p className="font-semibold text-gray-900">{response.supplier}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Price</label>
                        <p className="font-semibold text-green-600">${response.price}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Delivery Time</label>
                        <p className="font-semibold text-gray-900">{response.deliveryTime}</p>
                      </div>
                    </div>
                    {response.message && (
                      <div>
                        <label className="text-xs text-gray-500">Message</label>
                        <p className="text-gray-700">{response.message}</p>
                      </div>
                    )}
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(response.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded">
                <p className="text-gray-500">No responses yet</p>
                <p className="text-sm text-gray-400 mt-1">
                  Suppliers will respond to your inquiry soon
                </p>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="divider"></div>

          {/* Actions */}
          <div className="flex gap-4">
            {currentInquiry.status === "pending" && (
              <>
                <button
                  onClick={() => navigate(`/inquiry/${currentInquiry._id}/edit`)}
                  className="btn btn-primary"
                >
                  Edit Inquiry
                </button>
                <button
                  onClick={handleDelete}
                  className="btn btn-error"
                >
                  Delete Inquiry
                </button>
              </>
            )}
            {currentInquiry.responses && currentInquiry.responses.length > 0 && (
              <button
                onClick={() => {
                  // Could implement messaging or contact feature
                  toast.info("Contact feature coming soon");
                }}
                className="btn btn-outline"
              >
                Contact Best Supplier
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
