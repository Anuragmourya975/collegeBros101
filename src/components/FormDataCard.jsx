import React from "react";

const FormDataCard = ({ formData }) => {
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
        <a
          href={`/server/uploads/${formData.resourceMedia}`}
          download
        >
          <button
            type="button"
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          >
            Download
          </button>
        </a>
      </div>
    </div>
  );
};

export default FormDataCard;
