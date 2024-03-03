import { useEffect, useState } from "react";
import { useSearch } from "../context/searchContext";
import { useQueryClient } from "@tanstack/react-query";
import { NavLink } from "react-router-dom";


function Search() {
  const { query: contextQuery, dispatch } = useSearch();
  // Current Query (in search)
  const [curQuery, setCurQuery] = useState<string | undefined>(contextQuery);
  const queryClient = useQueryClient();
  const [normalizedOutput, setNormalizedOutput] = useState('');

  useEffect(() => {
    const normalizedString = curQuery?.replace(/\s+/g, ' ').trim();
    setNormalizedOutput(normalizedString);
  }, [curQuery]);

  // Every 1000ms clear empty queries in cache, changes every time we type
  useEffect(() => {
    const timeoutId: number = setTimeout(() => {
      const queryCache = queryClient.getQueryCache();

      // Gets all queries
      queryCache.getAll().forEach((cacheEntry) => {
        const queryKey = cacheEntry.queryKey;
        // It returns nothing but is necessary to prevent refetching every time a string is deleted in the search
        if (queryKey[1] === "query-") return;

        const data = queryClient.getQueryData(queryKey) as Array<string>;
        // Check if queris are empty and delete them from cache
        if (data?.length === 0) {
          queryClient.invalidateQueries({ queryKey: queryKey });
          queryClient.removeQueries({ queryKey: queryKey });
        }
      });
    }, 650);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [curQuery, contextQuery, dispatch, queryClient]);

  // Adds delay in order to prevent spam in API, and makes search history work correctly
  useEffect(() => {
    if (queryClient.getQueryData(["search", `query-${normalizedOutput}`])) {
    // If something that already exists in the query, it returns the result without artificial delay.
      return dispatch({ type: "updateQuery", payload: String(normalizedOutput) as string });
    }

    // The string changes visibly instantly, but it updates the context API and content only after 550ms
    const timeoutId: number = setTimeout(() => {
      dispatch({ type: "updateQuery", payload: normalizedOutput as string });
      if (normalizedOutput !== "") dispatch({ type: "updateHistory", payload: String(normalizedOutput) as string });
    }, 550);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [normalizedOutput, dispatch, queryClient]);

  // Every time we click the navigation button, it resets the current query
  function handleClick() {
    setCurQuery("");
    dispatch({ type: "updateQuery", payload: "" });
  }

  return (
    <section className="section-search">
      <div className="input-container">
        <input
          className="input"
          type="text"
          placeholder="Search..."
          value={curQuery}
          onChange={(e) => setCurQuery(e.target.value)}
        />
        <img className="search-icon" src="public/searchIcon.svg" alt="search icon" />
      </div>
      <NavLink className="navBtn" to="/history">
        <button onClick={handleClick} className="btn">
          History
        </button>
      </NavLink>
    </section>
  );
}

export default Search;
