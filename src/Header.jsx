import React from "react";
import { Input, Select } from "antd";
import { SearchContext } from "./App";

function Header() {
  const { setSearchByName } = React.useContext(SearchContext);

  return (
    <div style={{ background: "#9de2ab" }}>
      <Input
        style={{
          marginBottom: 30,
          width: "20%",
          marginLeft: 20,
          marginRight: 30,
          marginTop: 30,
        }}
        placeholder="Поиск..."
        onChange={(event) => setSearchByName(event.target.value)}
      />
      <Select
        mode="multiple"
        placeholder="Select Brand"
        style={{
          width: "20%",
        }}
      ></Select>
    </div>
  );
}

export default Header;
