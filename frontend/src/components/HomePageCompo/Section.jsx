import React from "react";
import { Link } from "react-router-dom";

export default function Section({
  title,
  subtitle,
  children,
  showViewAll = false,
  viewAllLink = "/products",
  className = "",
  contentClassName = "",
}) {
  return (
    <div className={`w-full max-w-[1180px] mx-auto px-0 sm:px-2 ${className}`}>
