import React from "react";
import { Photo, PhotoStats } from "../vite-env";

interface PhotoDetailsProps {
  photo: Photo;
  photoDetails: PhotoStats | undefined;
  isLoading: boolean;
}

const PhotoDetails: React.FC<PhotoDetailsProps> = ({ photo, photoDetails, isLoading }) => {
  // Function to format numbers using Intl.NumberFormat
  const formatNumber = (number: number) => {
    return new Intl.NumberFormat().format(number);
  };

  return (
    <div className="details-container">
      <img className="modal-img" src={photo.urls.full} alt={photo.alt_description} />
      <div className="text-container">
        <p>Likes: {isLoading ? "Loading..." : <span>{formatNumber(photo?.likes)}</span>}</p>
        {photoDetails && <p>Views: {isLoading ? "Loading..." : <span>{formatNumber(photoDetails?.views?.total)}</span>}</p>}
        {photoDetails && <p>Downloads: {isLoading ? "Loading..." : <span>{formatNumber(photoDetails?.downloads?.total)}</span>}</p>}
      </div>
    </div>
  );
};

export default PhotoDetails;
