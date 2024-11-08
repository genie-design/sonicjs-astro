import { useCallback } from "react";

export const TableSearch = ({ columnFilters, setColumnFilters }) => {
  const filterValue =
    columnFilters.find((filter) => filter.id === "title")?.value || "";
  console.log("filterValue", filterValue);
  const onFilterChange = (id, value) =>
    setColumnFilters((prev) =>
      prev.filter((f) => f.id !== id).concat({ id, value })
    );

  const searchInput = useCallback((inputElement) => {
    if (inputElement) {
      inputElement.focus();
    }
  }, []);

  return (
    <div class="w-96">
      <div class="mt-2">
        <div class="flex rounded-md bg-white/5 ring-1 ring-inset ring-white/10 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500">
          <input
            type="text"
            name="search"
            id="search"
            value={filterValue}
            onChange={(e) => {
              onFilterChange("title", e.target.value);
            }}
            class="flex-1 border-0 bg-transparent py-1.5 pl-2 text-white focus:ring-0 sm:text-sm sm:leading-6"
            placeholder="Search"
            autofocus
            ref={searchInput}
          />
        </div>
      </div>
    </div>
  );
};
