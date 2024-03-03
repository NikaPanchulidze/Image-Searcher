import { Photo, specificPhoto } from "../vite-env";
import { useMostPopularPhotos } from "../hooks/useMostPopularPhotos";
import { useSearchPhotos } from "../hooks/useSearchPhoto";
import { useCallback, useEffect, useState } from "react";
import { getPhotos } from "../services/apiPhotos";
import { useSearch } from "../context/searchContext";
import { useQueryClient } from "@tanstack/react-query";
import PhotoItem from "./PhotoItem";
import Spinner from "./Spinner";

function PhotoList() {

  // Fetching popular photos and search results
  const {query, dispatch} = useSearch();
  const [hasMore, setHasMore] = useState(true);
  const {popularPhotos, isLoading: isLoadingPopular } = useMostPopularPhotos();
  const {queryPhotos, isLoading: isLoadingSearch, updateQueryCache } = useSearchPhotos();
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  const queryClient = useQueryClient(); // Initialize queryClient
  const cachedData = queryClient.getQueryData(["search", `query-${query}`]); 
  const pages = Math.ceil((cachedData as Photo[] | [])?.length / 20); //Check current page

  const [hasHistoryInUrl, setHasHistoryInUrl] = useState(false);

  // Checks if we are on history page
  useEffect(() => {
    // Check if the current URL includes the string "history"
    const urlIncludesHistory = window.location.href.includes('history');

    // Updates the state based on the check result
    setHasHistoryInUrl(urlIncludesHistory);
  }, []);
  
  // Memorizes current pictures for infinite loading
  const handleScroll = useCallback(async () => {
    // Checks if the user has scrolled to the bottom
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 100
      ) {
        // Increments the page number
        if (isLoadingMore || !hasMore || !query) return;
        
        const nextPage = +pages + 1;
        
        // Set loading flag to prevent multiple concurrent fetch requests
        setIsLoadingMore(true);
        updateUrl("plus");
        
        // Implement debouncing 
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(async () => {
          const newPhotos: specificPhoto[] | undefined = await getPhotos(query, nextPage);
          if(newPhotos && newPhotos.length <= 0) {
            setHasMore(false);
            updateUrl("minus");
          }
          
          // Update the query cache with the new photos
          newPhotos && updateQueryCache(newPhotos);
          
          // Reset loading flag after the fetch is complete
          setIsLoadingMore(false);
        }, 500); // 500 mili seconds because user needs to have enough time to delete query without saving in history
      } 

      // Handling current page logic. It prevent page number to exceeding its limits
      function updateUrl(action: "plus" | "minus" | undefined){
        if(action === "plus"){
          dispatch({type: "nextPage"})
        } else if(action === "minus"){
          dispatch({type: "prevPage"})
        }
      }
    }, [query, setIsLoadingMore, updateQueryCache, isLoadingMore, dispatch, hasMore, pages]);
  
  // For infinte scrolling
  useEffect(() => {
    // Attach the scroll event listener
    window.addEventListener("scroll", handleScroll);
    
    // Detach the scroll event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);
  
  // Checks if API sends new data (main purpose is not to fetch if the data does not exist)
  useEffect(function(){
    setHasMore(true);
  },[query]);

  // Disables and enables scroll features to prevent bugs when there is no content on the page
  useEffect(() => {
    if(isLoadingPopular || isLoadingSearch){
      document.body.style.overflow = 'hidden';
    } else if(popularPhotos && !query){
      document.body.style.overflow = 'visible';
    } else if(queryPhotos?.length === 0){
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'visible';
    }
  }, [isLoadingPopular, isLoadingSearch, query, queryPhotos, popularPhotos]);

  if (isLoadingPopular || isLoadingSearch) return <Spinner />;

  return (
    <section>
      {/* Display appropriate heading based on the query */}
      {query === "" && !hasHistoryInUrl && <h1>Most Popular</h1>}
      {query !== "" && <h2 className="results">Results: <span>{queryPhotos?.length}</span></h2>}
      <div className="photos">
        {!query &&
          popularPhotos &&
          !hasHistoryInUrl &&
          popularPhotos?.map((photo: Photo, i) => (
            <PhotoItem key={photo.id + i} photo={photo}/>
          ))}
        {query &&
          queryPhotos &&
          !hasHistoryInUrl &&
          queryPhotos?.map((photo: Photo, i) => (
            <PhotoItem key={photo.id + i} photo={photo}/>
          ))}
        {hasHistoryInUrl &&
          queryPhotos &&
          queryPhotos?.map((photo: Photo, i) => (
            <PhotoItem key={photo.id + i} photo={photo}/>
          ))}
      </div>
      {isLoadingMore && <Spinner />}
      {!hasMore && <h2>End :)</h2>}
    </section>
  );
}

export default PhotoList;

// Debouncing variables
let debounceTimeout: number;