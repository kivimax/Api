/* eslint-disable react/prop-types */
import React from "react"
import axios from "axios"
import md5 from "md5"
import { Card, Pagination } from "antd"
import { SearchContext } from "./App"

const password = "Valantis"
const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, "")
const xAuth = md5(`${password}_${timestamp}`)

function Product() {
  const {
    ids,
    setids,
    products,
    setproducts,
    searchByName,
    setSearchByName,
    select,
    setSelect,
  } = React.useContext(SearchContext)
  const [currentPage, setCurrentPage] = React.useState(1)

  const totalPages = 2
  const itemsPerPage = 50

  React.useEffect(() => {
    //     "action": "get_ids",
    //     "params": {"offset": 10, "limit": 3}
    //     "action": "filter",
    //     "params": {"price": 17500.0}
    async function fetchData() {
      try {
        console.log(searchByName)
        let requestBody = {
          action: "get_ids",
          params: { limit: 300 },
        }

        if (searchByName) {
          requestBody = {
            action: "filter",
            params: {
              brand: searchByName,
              limit: 300,
            },
          }
        }

        const response = await axios.post(
          "http://api.valantis.store:40000/",
          requestBody,
          {
            headers: {
              "X-Auth": xAuth,
            },
            "Access-Control-Allow-Credentials": true, //что это такое
          }
        )

        if (response.status === 200) {
          setids(response.data.result)
        } else {
          console.error("Request failed with status code:", response.status)
        }
      } catch (error) {
        console.error("Error fetching ids:", error.message)
      }
    }

    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchByName])

  const onPageChange = (page) => {
    setCurrentPage(page)
  }

  React.useEffect(() => {
    async function fetchproducts() {
      try {
        const requestBody = {
          action: "get_items",
          params: { ids },
        }

        const response = await axios.post(
          "http://api.valantis.store:40000/",
          requestBody,
          {
            headers: {
              "X-Auth": xAuth,
            },
          }
        )

        if (response.status === 200) {
          const result = response.data.result
          setproducts(result)
        } else {
          console.error("Request failed with status code:", response.status)
        }
      } catch (error) {
        console.error("Error fetching product details:", error.message)
      }
    }
    if (ids.length) {
      fetchproducts()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids])

  return (
    <div style={{ padding: 10, margin: 50 }}>
      <ul
        style={{
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        {products.map((product, index) => (
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
  )
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
  )
}

export default Product
