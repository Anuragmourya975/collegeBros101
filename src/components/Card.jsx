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

  const search = useSelector((state) => state.searchQuery);
    console.log("this is the search",search);
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
  }, []);

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
  };

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  return (
    <div className="container mx-2 my-2">
      <input
        type="text"
        name="searchQuery"
        placeholder="Search"
        value={searchQuery}
        onChange={handleSearchChange}
        style={{display:"none"}}
/>

      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {filteredFormData.map((formData) => (
          <div key={formData._id} className="my-masonry-grid_item">
            <FormDataCard formData={formData} />
          </div>
        ))}
      </Masonry>
    </div>
  );
}

export default Card;
