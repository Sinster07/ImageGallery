import CustomWebcam from "./components/WebCamera";
import ImageGallery from "./components/ImageGallery";
import { useState, useEffect } from "react";

function App() {
  const [images, setImages] = useState([]);
  const [capturedImage, setCapturedImage] = useState(null);

  const handleCapture = (imageData) => {
    setCapturedImage(imageData);

    fetch("https://imagegallery-6.onrender.com/getAllImages")
      .then((response) => response.json())
      .then((data) => setImages(data))
      .catch((error) => console.error("Error fetching images:", error));
  };

  const handleDeleteImage = (imageUrl) => {
    setImages(images.filter((image) => image !== imageUrl));
  };

  useEffect(() => {
    fetch("https://imagegallery-6.onrender.com/getAllImages")
      .then((response) => response.json())
      .then((data) => setImages(data))
      .catch((error) => console.error("Error fetching images:", error));
  }, []);

  return (
    <div className="min-h-screen bg-grey ">
      <div className="p-4">
        <div className="bg-grey flex md:flex-row flex-col justify-between">
          <div className="mb-4 md:w-1/2">
            <h1 className="text-2xl font-bold mb-2">Web Camera</h1>
            <CustomWebcam onCapture={handleCapture} />
          </div>
          <div className="md:w-1/2">
            {/* <h2 className="text-2xl font-bold mb-2">Image Gallery</h2> */}
            <ImageGallery images={images} onDelete={handleDeleteImage} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;