import React from "react";
import Header from "./Header";
import Product from "./Product";
import "./index.css";

export const SearchContext = React.createContext();

function App() {
  const [ids, setids] = React.useState([]);
  const [products, setproducts] = React.useState([]);
  const [searchByName, setSearchByName] = React.useState([]);

  return (
    <div>
      <SearchContext.Provider
        value={{
          ids,
          setids,
          products,
          setproducts,
          searchByName,
          setSearchByName,
        }}
      >
        <Header />
        <Product />
      </SearchContext.Provider>
    </div>
  );
}

export default App;
