import React from "react";
import { IoSearchOutline } from "react-icons/io5";
import { SearchProps } from "./types";

export default function SearchComponent(props: SearchProps) {

  const { filterText, onFilter, wrapperStyle } = props;

  return (
    <div style={{
      ...(wrapperStyle ? wrapperStyle : {
        border: '1px solid #E2E8F0',
        width: '300px',
        borderRadius: '8px',
      }),
      display: 'flex',
      alignItems: 'center',
      alignContent: 'center',
      gap: '2px',
      padding: '10px',
      margin: '2px'
    }}>
      <div style={{ display: 'flex', justifyContent: "center", alignItems: "center" }}>
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


