import React, { useState } from "react";
import axios from "axios";
import { Trash } from "lucide-react";

const ImageGallery = ({ images, onDelete }) => {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const handleDelete = async (imageUrl) => {
        try {
            const filename = imageUrl.split("/").pop();
            const response = await axios.delete(
                `https://imagegallery-6.onrender.com/images/${filename}`
            );
            if (response.status === 200) {
                onDelete(imageUrl);
            } else {
                console.error("Failed to delete image");
            }
        } catch (error) {
            console.error("Error deleting image:", error);
        }
    };

    return (
        <div className="container mx-auto px-4 z-0">
            <h1 className="text-2xl font-bold mb-8">Image Gallery</h1>
            <div className="gallery">
                {images.map((imageUrl, index) => (
                    <div
                        key={index}
                        className="relative break-inside-avoid mb-4"
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                        <img
                            src={imageUrl}
                            alt="Uploaded"
                            className={`w-full rounded-md h-auto object-cover transition-transform duration-300 ${
                                hoveredIndex === index
                                    ? "transform scale-105"
                                    : ""
                            }`}
                        />
                        <button
                            className="absolute top-2 right-2 rounded-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-2 text-xs"
                            onClick={() => handleDelete(imageUrl)}
                        >
                            <Trash width={20} height={20} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ImageGallery;
