import { useQueryClient } from "@tanstack/react-query";
import { useSearch } from "../context/searchContext";
import { NavLink } from "react-router-dom";

function SearchedQueries() {
  const { searchedHistory, query, dispatch } = useSearch();
  const queryClient = useQueryClient();

  // If we click history titles, it set query to it and show photos from cache
  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    dispatch({ type: "updateQuery", payload: e.currentTarget.value });
  }

  // Resets the query (search string) and navigates back to the main page
  function handleClickNavigation(){
    dispatch({ type: "updateQuery", payload: "" })
  }

  // Extracts key names from the query and filters out duplicates. This helps in preventing duplication after a certain period of inactivity, when the query is lost.
  const matchingKeys = searchedHistory.filter((searched) =>
    queryClient.getQueryData(["search", `query-${searched}`])
  );

  const uniqueKeys = [...new Set(matchingKeys)];

  return (
    <>
      <div className="section-history">
        <h1>History</h1>
        <NavLink className="navBtn" to={"/main"}>
          <button onClick={handleClickNavigation} className="btn">Main</button>
        </NavLink>
      </div>
      {/* Renders searches titles */}
      {uniqueKeys.length === 0 && <h2 className="empty">Your history is empty. Search some photos!</h2>}
      <div className="history-items">
        {uniqueKeys.map((searched, i) => (
          <button
            key={i + 1000 / 3}
            onClick={(e) => handleClick(e)}
            value={searched}
            className={`btn-history ${searched === query ? 'active' : ''}`}
          >
            {searched}
          </button>
        ))}
      </div>
    </>
  );
}

export default SearchedQueries;
