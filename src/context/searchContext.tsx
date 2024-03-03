import { createContext, useContext, useReducer, ReactNode, Dispatch } from "react";

// Define the types for the state and action
type SearchState = {
  query: string;
  page: number;
  curPage: number;
  searchedHistory: string[];
};

type SearchAction =
  | { type: 'nextPage' }
  | { type: 'updateQuery'; payload: string }
  | { type: 'prevPage' }
  | { type: 'curPage'; payload: number }
  | { type: 'updateHistory'; payload: string };

// Define the context type
type SearchContextType = SearchState & {
  dispatch: Dispatch<SearchAction>;
};

// Create the context with initial values
const SearchContext = createContext<SearchContextType | undefined>(undefined);

const initialState: SearchState = {
  query: "",
  page: 1,
  curPage: 1,
  searchedHistory: [],
};

function reducer(state: SearchState, action: SearchAction): SearchState {
  switch (action.type) {
    case 'nextPage':
      return { ...state, page: state.page + 1 };
    case 'updateQuery':
      return { ...state, query: action.payload, page: 1 };
    case 'prevPage':
      return { ...state, page: state.page - 1 };
    case 'curPage':
      return { ...state, page: action.payload };
    case 'updateHistory':
      return { ...state, searchedHistory: [...state.searchedHistory, action.payload] };
    default:
      throw new Error("Action unknown");
  }
}

type SearchProviderProps = {
  children: ReactNode;
};

function SearchProvider({ children }: SearchProviderProps): JSX.Element {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  return (
    <SearchContext.Provider value={{
      ...state,
      dispatch,
    }}>
      {children}
    </SearchContext.Provider>
  );
}

function useSearch(): SearchContextType {
  const context = useContext(SearchContext);
  if (context === undefined) throw new Error("Search provider is out of reaching scope...");
  return context;
}

export { SearchProvider, useSearch };
