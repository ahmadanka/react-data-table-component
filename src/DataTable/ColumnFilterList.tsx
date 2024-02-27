import React, {  useState } from 'react';

interface Position {
  x: number;
  y: number;
}

interface FilterListProps {
  position: Position;
  darkTheme?: boolean;
  listData: any;
  handleFilteredData: (data: string[]) => void;
  selectedFilterList?: string[];
}
const ColumnFilterList: React.FC<FilterListProps> = ({ position, listData, handleFilteredData, selectedFilterList, darkTheme = false }) => {
  const listStyle: React.CSSProperties = {
    width: '135px',
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
    backgroundColor: '#FFFFFF',
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
      <input type="text" onChange={handleFilter} placeholder='Search ' />
      {filterData.map((value: string, index: number) => (
        <div key={index}>
          <input
            type="checkbox"
            onChange={() => handleCheckboxChange(value)}
            checked={selectedFilter?.includes(value)}
          />
        {value.length > 10 ? value.substring(0, 10)+'...' : value}
        </div>
      ))}
    </div>
  );
};

export default ColumnFilterList;