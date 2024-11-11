import { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import {
    RefreshCcwDot,
    Square,
    RectangleHorizontal,
    RectangleVertical,
    ZoomIn,
    ZoomOut,
} from "lucide-react";

const CustomWebcam = ({ onCapture }) => {
    const webcamRef = useRef(null);
    const [imgSrc, setImgSrc] = useState(null);
    const [zoom, setZoom] = useState(1);
    const [aspectRatio, setAspectRatio] = useState("16:9");
    const [facingMode, setFacingMode] = useState("user");
    const [isFlashing, setIsFlashing] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

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

    const handleClick = (call) => {
        console.log(call);
        switch (call) {
            case "capture":
                setIsFlashing(true);
                capture();
                setTimeout(() => setIsFlashing(false), 200); // animation duration + delay
                break;
            case "zoomIn":
                handleZoomIn();
                break;
            case "zoomOut":
                handleZoomOut();
                break;
            case "aspectRatio":
                handleAspectRatioChange();
                break;
            case "facingMode":
                handleFacingModeChange();
                break;
            default:
                break;
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
                    style={{
                        transform: `scale(${zoom})`,
                        marginLeft: "auto",
                        marginRight: "auto",
                    }}
                />
            </div>
            <div className="py-10 z-10 flex justify-between items-middle max-w-96 min-w-96 md:absolute bottom-0">
                <button
                    onClick={() => handleClick("zoomIn")}
                    className="w-16 h-16"
                >
                    <ZoomIn width={40} height={40} />
                </button>

                <button
                    onClick={() => handleClick("zoomOut")}
                    className="w-16 h-16"
                >
                    <ZoomOut width={40} height={40} />
                </button>

                <button
                    onClick={() => handleClick("capture")}
                    className={`w-16 h-16 rounded-full border-4 border-white ${
                        isFlashing ? "animate-flash-white-red" : "bg-red-600"
                    }`}
                />
                <button
                    onClick={() => handleClick("facingMode")}
                    className="w-16 h-16"
                >
                    <RefreshCcwDot width={40} height={40} />
                </button>

                <button
                    onMouseEnter={() => setIsOpen(true)}
                    onMouseLeave={() => setIsOpen(false)}
                    onClick={() => handleClick("aspectRatio")}
                    className="w-16 h-16"
                >
                    {isOpen ? (
                        <div className="w-16 h-40 flex flex-col justify-between">
                            <RectangleHorizontal
                                onClick={() => setAspectRatio("16:9")}
                                width={40}
                                height={40}
                            />
                            <RectangleVertical
                                onClick={() => setAspectRatio("4:3")}
                                width={40}
                                height={40}
                            />
                            <Square
                                onClick={() => setAspectRatio("1:1")}
                                width={40}
                                height={40}
                            />
                        </div>
                    ) : aspectRatio === "16:9" ? (
                        <RectangleHorizontal width={40} height={40} />
                    ) : aspectRatio === "4:3" ? (
                        <RectangleVertical width={40} height={40} />
                    ) : (
                        <Square width={40} height={40} />
                    )}
                </button>
            </div>
        </div>
    );
};

export default CustomWebcam;
