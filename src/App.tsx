import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Main from "./pages/Main";
import History from "./pages/History";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SearchProvider } from "./context/searchContext";
import PageNotFound from "./pages/PageNotFound";

// Query should upadate instantly if something changes on server
const quearyClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
    }
  }
})

function App() {
  return(
    <SearchProvider>
      <BrowserRouter>
        <QueryClientProvider client={quearyClient}>
          <ReactQueryDevtools initialIsOpen={false} />
          <Routes>
            <Route index element={<Navigate replace to="main" />}/>
            <Route path="main" element={<Main />} />
            <Route path="history" element={<History />} />
            <Route path="*" element={<PageNotFound />}/>
          </Routes>
        </QueryClientProvider>
      </BrowserRouter>
    </SearchProvider>
  );
}

export default App;