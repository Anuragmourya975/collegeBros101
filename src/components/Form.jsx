import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Form() {
  const dispatch = useDispatch();
  const isModalOpen = useSelector((state) => state.isModalOpen);
  const upvote = useSelector((state) => state.upvotes);
  const upvotForm = () => {
    dispatch({ type: "UPVOTE", value: formData.upvotes + 1 });
  };
  const [formData, setFormData] = useState({
    resourceName: "",
    description: "",
    thumbnail: null,
    resourceMedia: null,
    publisher: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    upvotForm();
    // Perform any necessary validation on the form data
    // ...

    const formDataObj = new FormData();
    formDataObj.append("resourceName", formData.resourceName);
    formDataObj.append("description", formData.description);
    formDataObj.append("publisher", formData.publisher);
    formDataObj.append("thumbnail", formData.thumbnail);
    formDataObj.append("resourceMedia", formData.resourceMedia);

    // Dispatch an action to store the form data in the backend
    dispatch({ type: "SAVE_FORM_DATA", value: formData });

    try {
      // Send a POST request to the backend
      const response = await axios.post(
        "http://localhost:5000/api/formdata",
        formDataObj
      );

      // Check the response status
      if (response.status === 200) {
        console.log("Form data saved successfully");
        // Reset the form
        setFormData({
          resourceName: "",
          description: "",
          thumbnail: null,
          resourceMedia: null,
          publisher: "",
        });

        // Close the modal or perform any other necessary action
        toggleModal();
      }
    } catch (error) {
      console.error("Error saving form data:", error);
      // Handle the error
    }
  };

  const toggleModal = () => {
    dispatch({ type: "SET_IS_MODAL_OPEN", value: !isModalOpen });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="resourceName"
          placeholder="Resource Name"
          value={formData.resourceName}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="publisher"
          placeholder="Publisher"
          value={formData.publisher}
          onChange={handleInputChange}
        />
        <input type="file" name="thumbnail" onChange={handleFileChange} />
        <input type="file" name="resourceMedia" onChange={handleFileChange} />
        <button type="submit">Submit</button>
      </form>
    </>
  );
}
