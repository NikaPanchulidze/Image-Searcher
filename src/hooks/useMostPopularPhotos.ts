import { useQuery } from "@tanstack/react-query";
import { getMostPopularPhotos } from "../services/apiPhotos";

export function useMostPopularPhotos() {
  const {isLoading, data: popularPhotos, error} = useQuery({
    queryKey: ["popular"],
    queryFn: getMostPopularPhotos,
  })

  return {isLoading, popularPhotos, error};
}
