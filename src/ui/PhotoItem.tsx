import React, { useState } from "react";
import Modal from "./Modal";
import PhotoDetails from "./PhotoDetails";
import { Photo, PhotoStats } from "../vite-env"; // Adjust the path based on your project structure
import { getDetails } from "../services/apiPhotos";

interface PhotoItemProps {
  photo: Photo;
}

// Renders photos
const PhotoItem: React.FC<PhotoItemProps> = ({ photo }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [photoDetails, setPhotoDetails] = useState<PhotoStats | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Disable scroll if the picture is open
  if (isOpen) document.body.style.overflow = "hidden";
  else document.body.style.overflow = "visible";

  // Getting more information about specific picture from API
  async function handleClick() {
    setIsLoading(true);
    setIsOpen((prevIsOpen) => !prevIsOpen);
    const info = await getDetails(photo.id);
    setIsLoading(false);
    setPhotoDetails(info); 
  }

  return (
    <>
      <div className="img-container">
        <img onClick={handleClick} className="img" src={photo.urls.small} alt={photo.alt_description} />
      </div>
      {isOpen && <Modal onClose={() => setIsOpen(false)}><PhotoDetails isLoading={isLoading} photo={photo} photoDetails={photoDetails} /></Modal>}
    </>
  );
};

export default PhotoItem;
