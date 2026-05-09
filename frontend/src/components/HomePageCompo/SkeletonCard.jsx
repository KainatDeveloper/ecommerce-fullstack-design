import React from "react";

export function SkeletonCard({ className = "" }) {
  return (
    <div className={`animate-pulse bg-white rounded-lg border border-gray-200 overflow-hidden ${className}`}>
      <div className="aspect-square bg-gray-200"></div>
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="flex items-center gap-2">
          <div className="h-5 bg-gray-200 rounded w-16"></div>
          <div className="h-3 bg-gray-200 rounded w-12"></div>
        <div className="h-3 bg-gray-200 rounded w-20"></div>
    </div>
  );
}

export function SkeletonSaleCard({ className = "" }) {
  return (
    <div className={`animate-pulse flex flex-col items-center w-[179px] border-l border-t border-gray-200 h-[235px] gap-2 py-4 ${className}`}>
      <div className="w-[140px] h-[140px] bg-gray-200 rounded"></div>
      <div className="h-4 bg-gray-200 rounded w-24"></div>
      <div className="h-7 bg-gray-200 rounded-full w-16"></div>
  );
}

export function SkeletonBanner({ className = "" }) {
  return (
    <div className={`animate-pulse bg-gray-200 ${className}`}></div>
  );
}
