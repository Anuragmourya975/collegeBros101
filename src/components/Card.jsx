import React, { useState, useEffect } from "react";
import axios from "axios";
import FormDataCard from "./FormDataCard";
import Masonry from "react-masonry-css";
import "./styles/style.css";
import { useSelector } from "react-redux";

function Card() {
  const [allFormData, setAllFormData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFormData, setFilteredFormData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const search = useSelector((state) => state.searchQuery);
  console.log("this is the search", search);
  const upvote = useSelector((state) => state.upvotes);
  console.log("this is the upvote", upvote);

  useEffect(() => {
    const fetchAllFormData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/formdata");
        setAllFormData(response.data);
      } catch (error) {
        console.error("Error fetching form data:", error);
        // Handle the error
      }
    };

    fetchAllFormData();
  }, [upvote]);

  useEffect(() => {
    const searchFormData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/formdata?search=${search}`
        );
        const formData = response.data;
        setFilteredFormData(formData);
      } catch (error) {
        console.error("Error searching form data:", error);
      }
    };

    // Debounce the search query to avoid excessive API calls
    const delayDebounceFn = setTimeout(() => {
      if (search.length > 0) {
        searchFormData();
      } else {
        setFilteredFormData(allFormData);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search, allFormData]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to the first page
  };

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };
  const sortedFormData = filteredFormData.sort((a, b) => b.upvotes - a.upvotes); // Render the FormDataCard components based on the sorted

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedFormData.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="container mx-2 my-2">
      <input
        type="text"
        name="searchQuery"
        placeholder="Search"
        value={searchQuery}
        onChange={handleSearchChange}
        style={{ display: "none" }}
      />

      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {currentItems.map((formData) => (
          <div key={formData._id} className="my-masonry-grid_item">
            <FormDataCard formData={formData} />
          </div>
        ))}
      </Masonry>

      <div className="pagination flex justify-center mt-4">
  <button
    className="px-4 py-2 bg-gray-200 text-gray-600 rounded-md hover:bg-gray-300 hover:text-gray-700 transition duration-300 ease-in-out disabled:bg-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed"
    disabled={currentPage === 1}
    onClick={() => setCurrentPage((prevPage) => prevPage - 1)}
  >
    Previous
  </button>
  <span className="px-4 py-2 text-gray-600">
    Page {currentPage}
  </span>
  <button
    className="px-4 py-2 bg-gray-200 text-gray-600 rounded-md hover:bg-gray-300 hover:text-gray-700 transition duration-300 ease-in-out disabled:bg-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed"
    disabled={indexOfLastItem >= sortedFormData.length}
    onClick={() => setCurrentPage((prevPage) => prevPage + 1)}
  >
    Next
  </button>
</div>

    </div>
  );
}

export default Card;
