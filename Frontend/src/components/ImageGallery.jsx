import React, { useState } from "react";
import axios from "axios";

const ImageGallery = ({ images, onDelete }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const handleDelete = async (imageUrl) => {
    console.log(imageUrl);
    try {
      // Extract the filename from the imageUrl
      const filename = imageUrl.split('/').pop();
      // Call your delete API endpoint with the filename
      const response = await axios.delete(`https://imagegallery-6.onrender.com/images/${filename}`);
      if (response.status === 200) {
        // If the delete is successful, call the onDelete function to update the image list
        onDelete(imageUrl);
      } else {
        console.error("Failed to delete image");
      }
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };
  

  return (
    <div className="container mx-auto px-4 mt-10">
      <h1 className="text-3xl font-bold mb-8">Image Gallery</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
        {images.map((imageUrl, index) => (
          <div
            key={index}
            className="relative"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <img
              src={imageUrl}
              alt="Uploaded"
              className={`w-full h-auto object-cover transition-transform duration-300 ${
                hoveredIndex === index ? "transform scale-105" : ""
              }`}
            />
              <button
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded-sm text-xs"
              onClick={() => handleDelete(imageUrl)}
            >
              Delete
            </button>
       
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;