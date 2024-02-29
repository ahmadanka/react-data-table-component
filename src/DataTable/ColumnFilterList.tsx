import React, { useState } from 'react';

interface Position {
  x: number;
  y: number;
}

interface FilterListProps {
  position: Position;
  theme?: any;
  listData: any;
  handleFilteredData: (data: string[]) => void;
  selectedFilterList?: string[];
}
const ColumnFilterList: React.FC<FilterListProps> = ({ position, listData, handleFilteredData, selectedFilterList, theme }) => {
  const listStyle: React.CSSProperties = {
    width: '170px',
    maxHeight: '200px',
    position: 'absolute',
    overflow: 'auto',
    padding: '10px',
    borderRadius: '12px',
    gap: '5px',
    boxShadow: '0px 4px 3px rgba(0, 0, 0, 0.2)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: theme.table.style.backgroundColor,
    left: `${position?.x}px`,
    top: `${position?.y}px`,
  };
  const [filterData, setFilterData] = useState(listData);
  const [selectedFilter, setSelectedFilter] = useState<string[]>(selectedFilterList || []);

  const handleFilter = (event: any) => {
    const searchText = event.target.value;
    const filteredData = listData.filter((item: string) => item.toLowerCase().includes(searchText.toLowerCase()));
    setFilterData(filteredData);
  }

  const handleCheckboxChange = (value: string) => {
    setSelectedFilter(prevState => {
      let newFilter;
      if (prevState.includes(value)) {
        newFilter = prevState.filter(item => item !== value);
      } else {
        newFilter = [...prevState, value];
      }
      // Call the function passed in through props
      handleFilteredData(newFilter);

      return newFilter;
    });
  };


  return (
    <div style={listStyle} id="filterBox">
      <input type="text" onChange={handleFilter} placeholder='Search ' style={{ padding: '5px', border: '1px solid #E2E8F0', borderRadius: '8px' }} />
      {filterData.map((value: string, index: number) => (
        <div key={index} style={{ display: 'flex', justifyContent: "flex-start", alignItems: "center", gap: "2px" }}>
          <input
            type="checkbox"
            onChange={() => handleCheckboxChange(value)}
            checked={selectedFilter?.includes(value)}
          />
          {value.length > 10 ? value.substring(0, 10) + '...' : value}
        </div>
      ))}
    </div>
  );
};

export default ColumnFilterList;