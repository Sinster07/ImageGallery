import { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import axios from "axios";

const CustomWebcam = ({ onCapture }) => {
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [facingMode, setFacingMode] = useState("user");

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
    onCapture(imageSrc);

    // Convert base64 string to Blob
    const byteString = atob(imageSrc.split(",")[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: "image/jpeg" });

    saveImage(blob);
  }, [webcamRef, setImgSrc, onCapture]);

  const saveImage = async (imageBlob) => {
    console.log("Saved screenshot");
    try {
      const formData = new FormData();
      formData.append("image", imageBlob, "image.jpg");
      const response = await axios.post(
        "https://imagegallery-6.onrender.com/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        console.log("Image saved successfully");
      } else {
        console.error("Failed to save image");
      }
    } catch (error) {
      console.error("Error saving image:", error);
    }
  };

  const handleZoomIn = () => {
    setZoom(zoom + 0.1);
  };

  const handleZoomOut = () => {
    if (zoom > 0.2) {
      setZoom(zoom - 0.1);
    }
  };

  const handleAspectRatioChange = (e) => {
    setAspectRatio(e.target.value);
  };

  const handleFacingModeChange = () => {
    setFacingMode(facingMode === "user" ? "environment" : "user");
  };

  const getVideoConstraints = () => {
    switch (aspectRatio) {
      case "16:9":
        return { aspectRatio: 16 / 9, facingMode: facingMode };
      case "4:3":
        return { aspectRatio: 4 / 3, facingMode: facingMode };
      case "1:1":
        return { aspectRatio: 1, facingMode: facingMode };
      default:
        return { aspectRatio: 16 / 9, facingMode: facingMode };
    }
  };

  return (
    <div className="flex flex-col justify-center items-center mt-10">
      <div className="overflow-hidden relative w-full max-w-screen-md">
        <Webcam
          height={600}
          width={600}
          ref={webcamRef}
          videoConstraints={getVideoConstraints()}
          style={{ transform: `scale(${zoom})`, marginLeft: "auto", marginRight: "auto" }}
        />
      </div>

      <div className="flex flex-col mt-5 w-full max-w-screen-md">
        <select
          className="bg-gray-200 text-gray-700 py-2 px-4 border border-gray-300 rounded mb-3"
          value={aspectRatio}
          onChange={handleAspectRatioChange}
        >
          <option value="16:9">16:9</option>
          <option value="4:3">4:3</option>
          <option value="1:1">1:1</option>
        </select>

        <div className="flex justify-around">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-3"
            onClick={capture}
          >
            Capture photo
          </button>

          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-3"
            onClick={handleZoomIn}
          >
            Zoom In
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-3"
            onClick={handleZoomOut}
          >
            Zoom Out
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleFacingModeChange}
          >
            Switch Camera
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomWebcam;
