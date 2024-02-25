/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";
import md5 from "md5";
import { Card, Pagination } from "antd";
import { SearchContext } from "./App";

function Product() {
  const { ids, setids, products, setproducts, searchByName, setSearchByName } =
    React.useContext(SearchContext);
  const [currentPage, setCurrentPage] = React.useState(1);

  const totalPages = 5;
  const itemsPerPage = 20;

  const filteredProducts = products.filter(
    (products) =>
      products.product &&
      typeof searchByName === "string" &&
      products.product.toLowerCase().includes(searchByName.toLowerCase())
  );

  React.useEffect(() => {
    async function fetchData() {
      try {
        const password = "Valantis";
        const timestamp = new Date()
          .toISOString()
          .slice(0, 10)
          .replace(/-/g, "");
        const xAuth = md5(`${password}_${timestamp}`);

        const requestBody = {
          action: "get_ids",
          params: { limit: 100 },
        };

        const response = await axios.post(
          "http://api.valantis.store:40000/",
          requestBody,
          {
            headers: {
              "X-Auth": xAuth,
            },
            "Access-Control-Allow-Credentials": true, //что это такое
          }
        );

        if (response.status === 200) {
          const result = response.data.result;
          const startIndex = (currentPage - 1) * itemsPerPage;
          const endIndex = startIndex + itemsPerPage;
          const currentPageItems = result.slice(startIndex, endIndex);
          setids(currentPageItems);
        } else {
          console.error("Request failed with status code:", response.status);
        }
      } catch (error) {
        console.error("Error fetching ids:", error.message);
      }
    }

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  React.useEffect(() => {
    async function fetchproducts() {
      try {
        const password = "Valantis";
        const timestamp = new Date()
          .toISOString()
          .slice(0, 10)
          .replace(/-/g, "");
        const xAuth = md5(`${password}_${timestamp}`);

        const requestBody = {
          action: "get_items",
          params: { ids },
        };

        const response = await axios.post(
          "http://api.valantis.store:40000/",
          requestBody,
          {
            headers: {
              "X-Auth": xAuth,
            },
          }
        );

        if (response.status === 200) {
          const result = response.data.result;
          setproducts(result);
        } else {
          console.error("Request failed with status code:", response.status);
        }
      } catch (error) {
        console.error("Error fetching product details:", error.message);
      }
    }
    if (ids.length) {
      fetchproducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids]);

  React.useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const requestBody = {
          action: "get_fields",
          params: {
            field: "product",
            limit: 100,
          },
        };
        const password = "Valantis";
        const timestamp = new Date()
          .toISOString()
          .slice(0, 10)
          .replace(/-/g, "");
        const xAuth = md5(`${password}_${timestamp}`);

        const response = await axios.post(
          "http://api.valantis.store:40000/",
          requestBody,
          {
            headers: {
              "X-Auth": xAuth,
            },
          }
        );

        if (isMounted && response.status === 200) {
          const filteredProducts = response.data.result;
          setSearchByName(filteredProducts);
        } else if (isMounted) {
          console.error("Request failed with status code:", response.status);
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error fetching filtered products:", error.message);
        }
      }
    };

    if (isMounted) {
      fetchData();
    }

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ padding: 10, margin: 50 }}>
      <ul
        style={{
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        {filteredProducts.map((product, index) => (
          <ul key={index}>
            <ProductCard
              name={product.product}
              productId={product.id}
              price={product.price}
              brand={product.brand}
            />
          </ul>
        ))}
      </ul>
      <Pagination
        defaultCurrent={1}
        total={totalPages * itemsPerPage}
        onChange={onPageChange}
      />
    </div>
  );
}

function ProductCard({ productId, name, brand, price }) {
  return (
    <Card
      hoverable
      style={{
        marginBottom: 30,
        marginTop: 20,
        width: 360,
        height: 250,
        background: "#ccc",
      }}
    >
      <p>ID: {productId}</p>
      <p>{name}</p>
      <p>Brand: {brand}</p>
      <p>Price: ${price}</p>
    </Card>
  );
}

export default Product;
