import CustomWebcam from "./components/WebCamera";
import ImageGallery from "./components/ImageGallery";
import "./App.css";
import { useState,useEffect } from "react";

function App() { 
  const [images, setImages] = useState([]);

  const [capturedImage, setCapturedImage] = useState(null);

  

  const handleCapture = (imageData) => {
    setCapturedImage(imageData);
  
    // Do something with the captured image data, e.g., save it to state or send it to the server
  
    // Fetch the images again
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
      .then((data) => { console.log(data);setImages(data)})
      .catch((error) => console.error("Error fetching images:", error));
  }, []);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative">
        <CustomWebcam  onCapture={handleCapture} />
        <ImageGallery  images={images} onDelete={handleDeleteImage}/>
      </div>
    </div>
  );
}

export default App;
