import CustomWebcam from "./components/WebCamera";
import ImageGallery from "./components/ImageGallery";
import { useState, useEffect } from "react";

function App() {
  const [images, setImages] = useState([]);
  const [capturedImage, setCapturedImage] = useState(null);

  const handleCapture = (imageData) => {
    setCapturedImage(imageData);

    fetch("http://localhost:3001/getAllImages")
      .then((response) => response.json())
      .then((data) => setImages(data))
      .catch((error) => console.error("Error fetching images:", error));
  };

  const handleDeleteImage = (imageUrl) => {
    setImages(images.filter((image) => image !== imageUrl));
  };

  useEffect(() => {
    fetch("http://localhost:3001/getAllImages")
      .then((response) => response.json())
      .then((data) => setImages(data))
      .catch((error) => console.error("Error fetching images:", error));
  }, []);

  return (
    <div className="min-h-screen bg-grey flex items-center justify-center">
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-grey p-4">
          <div className="mb-4">
            <h1 className="text-2xl font-bold mb-2">Web Camera</h1>
            <CustomWebcam onCapture={handleCapture} />
          </div>
          <div>
            {/* <h2 className="text-2xl font-bold mb-2">Image Gallery</h2> */}
            <ImageGallery images={images} onDelete={handleDeleteImage} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
