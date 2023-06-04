import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import socketIOClient from 'socket.io-client';

const FormDataCard = ({ formData }) => {
  const [upvoted, setUpvoted] = useState(false);
  const [upvotes, setUpvotes] = useState(formData.upvotes || 0);
  const dispatch = useDispatch();

  useEffect(() => {
    // Check if the user has already upvoted this card
    const upvotedCards = JSON.parse(localStorage.getItem("upvotedCards")) || [];
    if (upvotedCards.includes(formData._id)) {
      setUpvoted(true);
    }
  }, [formData._id]);

  const upvoteForm = () => {
    dispatch({ type: "UPVOTE", value: formData.upvotes + 1 });
  };

  const handleUpvote = async () => {
    try {
      // Check if the user has already upvoted this card
      const upvotedCards = JSON.parse(localStorage.getItem("upvotedCards")) || [];
      if (upvotedCards.includes(formData._id)) {
        return; // User has already upvoted this card
      }

      // Make a POST request to the server to update the upvotes count
      const response = await axios.post(
        `http://localhost:5000/api/formdata/upvote/${formData._id}`
      );

      if (response.status === 200) {
        // Update the upvotes count in the state and mark the card as upvoted
        upvoteForm();
        setUpvotes(upvotes + 1);
        setUpvoted(true);

        // Store the upvoted card's ID in the user's data
        upvotedCards.push(formData._id);
        localStorage.setItem("upvotedCards", JSON.stringify(upvotedCards));
      } else {
        throw new Error("Upvote failed");
      }

      // TODO: Handle the response or perform any additional actions
    } catch (error) {
      console.error("Error upvoting card:", error);
      // TODO: Handle the error, e.g., display an error message to the user
    }
  };

  const handlePreview = () => {
    if (formData.resourceMedia) {
      window.open(
        `http://localhost:5000/uploads/${formData.resourceMedia}`,
        "_blank"
      );
    }
  };

  const handleDownload = () => {
    if (formData.resourceMedia) {
      const downloadUrl = `http://localhost:5000/uploads/${formData.resourceMedia}`;
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = formData.resourceName;
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl); // Clean up the object URL
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-xl font-bold mb-2">{formData.resourceName}</h3>
      <p className="text-gray-600 mb-2">Description: {formData.description}</p>
      <p className="text-gray-600 mb-2">Publisher: {formData.publisher}</p>
      <div className="aspect-w-16 aspect-h-9 mb-4">
        <img
          src={`/server/uploads/${formData.thumbnail}`}
          alt="Thumbnail"
          className="object-cover rounded-lg"
        />
      </div>
      <div className="aspect-w-16 aspect-h-9">
        {/* <img
          src={formData.resourceMedia}
          alt="Resource Media"
          className="object-cover rounded-lg"
        /> */}
      </div>
      <div className="mt-4">
        <button
          onClick={handlePreview}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 mr-2 rounded"
        >
          Preview
        </button>
        <a href={`/server/uploads/${formData.resourceMedia}`} download>
          <button
            type="button"
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          >
            Download
          </button>
        </a>
      </div>
      <div className="mt-4">
        <button
          onClick={handleUpvote}
          className={`text-blue-500 ${upvoted ? "disabled" : ""}`}
          disabled={upvoted}
        >
          Upvote
        </button>
        <span className="ml-2">{upvotes} Upvotes</span>
      </div>
    </div>
  );
};

export default FormDataCard;
