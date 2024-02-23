import React from "react";
import { IoSearchOutline } from "react-icons/io5";
import { SearchProps } from "./types";

export default function SearchComponent(props: SearchProps) {

  const { filterText, onFilter } = props;

  return (
    <div style={{
      display: 'flex', gap: '2px', padding: '10px',
      border: '1px solid #E2E8F0',
      width: '300px',
      borderRadius: '8px',
    }}>
      <div style={{}}>
        <IoSearchOutline />
      </div>
      <input
        id="search"
        type="text"
        placeholder="Search"
        value={filterText}
        onChange={onFilter}
        style={{
          width: '200px',
          border: 'none',
          outline: 'none',
        }}
      />

    </div>
  )

}


