import React from "react";
import ProductCard from "./ProductCard";

export default function BlockItemsGroup2({ techProducts }) {
  return (
    <div className="w-full max-w-[1180px] h-auto p-0 gap-0 border border-gray-300 rounded mt-4 bg-base-100 flex flex-col md:flex-row">
      {/* Category Banner Section */}
      <div className="relative max-w-[280px] md:min-h-[380px] overflow-hidden flex bg-gradient-to-br from-blue-100 to-blue-50">
        <img
          className="hidden md:block w-full h-full object-cover opacity-30"
          src="/Image/Esection.png"
          alt="Consumer electronics and gadgets"
        />
        <div className="w-full md:absolute z-10 md:p-5 space-y-4 mt-4 md:mt-0 px-4 md:px-0">
          <h1 className="text-[20px] md:text-[24px] font-bold text-black leading-tight">
            Consumer
          </h1>
          <h1 className="text-[20px] md:text-[24px] font-bold text-black leading-tight">
            electronics and gadgets
          </h1>
          <button className="hidden md:block btn btn-sm bg-white text-black hover:bg-gray-100">
            Source now
          </button>
        </div>
      </div>

      {/* Products Grid Section */}
      <div className="w-full flex-1 p-4 md:p-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {techProducts && techProducts.length > 0 ? (
          techProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))
        ) : (
          <div className="col-span-full flex items-center justify-center py-12 text-gray-500">
            <p>No products available</p>
          </div>
        )}
      </div>
    </div>
  );
}
