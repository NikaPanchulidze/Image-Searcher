import { useQuery } from "@tanstack/react-query";
import { getPhotos } from "../services/apiPhotos";
import { useQueryClient } from "@tanstack/react-query";
import { useSearch } from "../context/searchContext";
import { Photo } from "../vite-env";

type UseSearchPhotosResult = {
  isLoading: boolean;
  queryPhotos: Photo[] | undefined;
  error: Error | null;
  updateQueryCache: (newPhotos: Photo[]) => void;
};

export function useSearchPhotos(): UseSearchPhotosResult {
  const { query } = useSearch();
  const queryClient = useQueryClient(); // Initialize queryClient
  const cachedData = queryClient.getQueryData(["search", `query-${query}`]);

  const { isLoading, data: queryPhotos, error } = useQuery({
    queryKey: ["search", `query-${query}`],
    queryFn: () => getPhotos(query || "", 1),
    enabled: !cachedData,
  });

  const updateQueryCache = (newPhotos: Photo[]) => {
    queryClient.setQueryData(["search", `query-${query}`], (oldData: Photo[]) => {
      // Assuming oldData is an array, concatenate the new photos to the existing data
      return [...oldData, ...newPhotos];
    });
  };

  return { isLoading, queryPhotos, error, updateQueryCache };
}
