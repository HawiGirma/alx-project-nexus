import React from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { setSort } from "../../store/slices/sortSlice";
import { SortState } from "../../types";

const SortDropdown: React.FC = () => {
  const dispatch = useAppDispatch();
  const sort = useAppSelector((state) => state.sort);

  const sortOptions = [
    { field: "title" as const, direction: "asc" as const, label: "Name (A-Z)" },
    {
      field: "title" as const,
      direction: "desc" as const,
      label: "Name (Z-A)",
    },
    {
      field: "price" as const,
      direction: "asc" as const,
      label: "Price (Low to High)",
    },
    {
      field: "price" as const,
      direction: "desc" as const,
      label: "Price (High to Low)",
    },
    {
      field: "rating" as const,
      direction: "desc" as const,
      label: "Rating (Highest)",
    },
    {
      field: "stock" as const,
      direction: "desc" as const,
      label: "Stock (Most Available)",
    },
  ];

  const handleSortChange = (option: {
    field: SortState["field"];
    direction: SortState["direction"];
  }) => {
    dispatch(setSort(option));
  };

  const currentSortLabel =
    sortOptions.find(
      (option) =>
        option.field === sort.field && option.direction === sort.direction
    )?.label || "Sort by...";

  return (
    <div className="relative">
      <select
        value={`${sort.field}-${sort.direction}`}
        onChange={(e) => {
          const [field, direction] = e.target.value.split("-") as [
            SortState["field"],
            SortState["direction"]
          ];
          handleSortChange({ field, direction });
        }}
        className="select appearance-none pr-8"
      >
        {sortOptions.map((option, index) => (
          <option key={index} value={`${option.field}-${option.direction}`}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
        <svg
          className="h-5 w-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
};

export default SortDropdown;
