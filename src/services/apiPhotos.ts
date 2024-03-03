import axios, { CancelTokenSource } from "axios";
import { Photo, PhotoStats, specificPhoto } from "../vite-env";

// Get most popular pictures only
export async function getMostPopularPhotos(): Promise<Photo[] | undefined> {
  try {
    const response = await axios.get(
      'https://api.unsplash.com/photos',
      {
        params: {
          page: 1,
          per_page: 20,
          order_by: 'popular',
        },
        headers: {
          Authorization: `Client-ID ${import.meta.env.VITE_API_KEY}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching photos:', error);
    throw new Error(`Error fetching photos:, ${error}`);
  }
}

let cancelToken: CancelTokenSource | undefined;

// Get pictures based on search query
export async function getPhotos(query: string, curPage: number = 1): Promise<specificPhoto[] | undefined> {
  if (cancelToken) {
    cancelToken.cancel();
  }

  // Create a new cancel token for the current request
  cancelToken = axios.CancelToken.source();

  try {
    const response = await axios.get('https://api.unsplash.com/search/photos', {
      params: {
        page: curPage,
        per_page: 20,
        query: query.split(" ").join("+"),
      },
      headers: {
        Authorization: `Client-ID ${import.meta.env.VITE_API_KEY}`,
      },
      cancelToken: cancelToken.token,
    });

    return response.data.results;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log('Request aborted:', error.message);
      throw new Error(`Request aborted:, ${error.message}`);
    } else {
      console.error('Error fetching photos:', error);
      throw new Error(`Error fetching photos: ${error}`);
    }
  }
}

// Get more details (downlaods, views, likes, ...) from specific picture
export async function getDetails(photoId: string): Promise<PhotoStats | undefined>{
  try {
    const response = await axios.get(
      `https://api.unsplash.com/photos/${photoId}/statistics`,
      {
        headers: {
          Authorization: `Client-ID ${import.meta.env.VITE_API_KEY}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching photo details:', error);
    throw new Error(`Error fetching photo details:, ${error}`);
  }
}