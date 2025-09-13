import React from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { setViewMode } from "../../store/slices/uiSlice";

const ViewToggle: React.FC = () => {
  const dispatch = useAppDispatch();
  const viewMode = useAppSelector((state) => state.ui.viewMode);

  return (
    <div className="flex items-center bg-gray-100 rounded-lg p-1">
      <button
        onClick={() => dispatch(setViewMode("grid"))}
        className={`p-2 rounded-md transition-colors ${
          viewMode === "grid"
            ? "bg-white text-primary-600 shadow-sm"
            : "text-gray-500 hover:text-gray-700"
        }`}
        aria-label="Grid view"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
          />
        </svg>
      </button>
      <button
        onClick={() => dispatch(setViewMode("list"))}
        className={`p-2 rounded-md transition-colors ${
          viewMode === "list"
            ? "bg-white text-primary-600 shadow-sm"
            : "text-gray-500 hover:text-gray-700"
        }`}
        aria-label="List view"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 10h16M4 14h16M4 18h16"
          />
        </svg>
      </button>
    </div>
  );
};

export default ViewToggle;
