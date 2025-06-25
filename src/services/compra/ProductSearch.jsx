import React, { useState } from "react";

const ProductSearch = ({ onSearch, loading }) => {
  const [query, setQuery] = useState("");

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value); 
  };

  return (
    <div className="product-search">
      <input
        type="text"
        placeholder="Buscar producto..."
        value={query}
        onChange={handleInputChange}
      />
      {loading && <p>Buscando...</p>}
    </div>
  );
};

export default ProductSearch;