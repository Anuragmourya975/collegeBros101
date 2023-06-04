import React, { useState, useEffect } from "react";
import axios from "axios";
import FormDataCard from "./FormDataCard";
import Masonry from "react-masonry-css";
import "./styles/style.css"
function Card() {
  const [allFormData, setAllFormData] = useState([]);
  

  useEffect(() => {
    const fetchAllFormData = async () => {
      try {
        // Send a GET request to fetch all form data
        const response = await axios.get("http://localhost:5000/api/formdata");
        setAllFormData(response.data);
      } catch (error) {
        console.error("Error fetching form data:", error);
        // Handle the error
      }
    };

    fetchAllFormData();
  }, []);

  const breakpointColumnsObj = {
    default: 4, // Number of columns by default
    1100: 3, // Number of columns for screen size 1100px and above
    700: 2, // Number of columns for screen size 700px and above
    500: 1, // Number of columns for screen size 500px and above
  };

  return (
    <div className="container mx-auto">
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {allFormData.map((formData) => (
          <div key={formData._id} className="my-masonry-grid_item">
            <FormDataCard formData={formData} />
          </div>
        ))}
      </Masonry>
    </div>
  );
}

export default Card;
