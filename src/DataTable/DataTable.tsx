import * as React from 'react';
import { ThemeProvider } from 'styled-components';
import { tableReducer } from './tableReducer';
import Table from './Table';
import Head from './TableHead';
import HeadRow from './TableHeadRow';
import Row from './TableRow';
import Column from './TableCol';
import ColumnCheckbox from './TableColCheckbox';
import Header from './TableHeader';
import Subheader from './TableSubheader';
import Body from './TableBody';
import ResponsiveWrapper from './ResponsiveWrapper';
import ProgressWrapper from './ProgressWrapper';
import Wrapper from './TableWrapper';
import ColumnExpander from './TableColExpander';
import { CellBase } from './Cell';
import NoData from './NoDataWrapper';
import NativePagination from './Pagination';
import useDidUpdateEffect from '../hooks/useDidUpdateEffect';
import { prop, getNumberOfPages, sort, isEmpty, isRowSelected, recalculatePage } from './util';
import { defaultProps } from './defaultProps';
import { createStyles } from './styles';
import {
	Action,
	AllRowsAction,
	SingleRowAction,
	TableRow,
	SortAction,
	TableProps,
	TableState,
	SortOrder,
} from './types';
import useColumns from '../hooks/useColumns';
import ActionsMenu from './ActionsMenu';
import { IoEllipsisHorizontalSharp, IoCloseSharp } from "react-icons/io5";
import SearchComponent from './SearchComponent';
import ColumnFilterList from './ColumnFilterList';


function DataTable<T>(props: TableProps<T>): JSX.Element {
	const {
		data = defaultProps.data,
		columns = defaultProps.columns,
		title = defaultProps.title,
		actions = defaultProps.actions,
		keyField = defaultProps.keyField,
		striped = defaultProps.striped,
		highlightOnHover = defaultProps.highlightOnHover,
		pointerOnHover = defaultProps.pointerOnHover,
		dense = defaultProps.dense,
		selectableRows = defaultProps.selectableRows,
		selectableRowsSingle = defaultProps.selectableRowsSingle,
		selectableRowsHighlight = defaultProps.selectableRowsHighlight,
		selectableRowsNoSelectAll = defaultProps.selectableRowsNoSelectAll,
		selectableRowsVisibleOnly = defaultProps.selectableRowsVisibleOnly,
		selectableRowSelected = defaultProps.selectableRowSelected,
		selectableRowDisabled = defaultProps.selectableRowDisabled,
		selectableRowsComponent = defaultProps.selectableRowsComponent,
		selectableRowsComponentProps = defaultProps.selectableRowsComponentProps,
		onRowExpandToggled = defaultProps.onRowExpandToggled,
		onSelectedRowsChange = defaultProps.onSelectedRowsChange,
		expandableIcon = defaultProps.expandableIcon,
		onChangeRowsPerPage = defaultProps.onChangeRowsPerPage,
		onChangePage = defaultProps.onChangePage,
		paginationServer = defaultProps.paginationServer,
		paginationServerOptions = defaultProps.paginationServerOptions,
		paginationTotalRows = defaultProps.paginationTotalRows,
		paginationDefaultPage = defaultProps.paginationDefaultPage,
		paginationResetDefaultPage = defaultProps.paginationResetDefaultPage,
		paginationPerPage = defaultProps.paginationPerPage,
		paginationRowsPerPageOptions = defaultProps.paginationRowsPerPageOptions,
		paginationIconLastPage = defaultProps.paginationIconLastPage,
		paginationIconFirstPage = defaultProps.paginationIconFirstPage,
		paginationIconNext = defaultProps.paginationIconNext,
		paginationIconPrevious = defaultProps.paginationIconPrevious,
		paginationComponent = defaultProps.paginationComponent,
		paginationComponentOptions = defaultProps.paginationComponentOptions,
		responsive = defaultProps.responsive,
		progressPending = defaultProps.progressPending,
		progressComponent = defaultProps.progressComponent,
		persistTableHead = defaultProps.persistTableHead,
		noDataComponent = defaultProps.noDataComponent,
		disabled = defaultProps.disabled,
		noTableHead = defaultProps.noTableHead,
		noHeader = defaultProps.noHeader,
		fixedHeader = defaultProps.fixedHeader,
		fixedHeaderScrollHeight = defaultProps.fixedHeaderScrollHeight,
		pagination = defaultProps.pagination,
		subHeader = defaultProps.subHeader,
		subHeaderAlign = defaultProps.subHeaderAlign,
		subHeaderWrap = defaultProps.subHeaderWrap,
		subHeaderComponent = defaultProps.subHeaderComponent,
		noContextMenu = defaultProps.noContextMenu,
		contextMessage = defaultProps.contextMessage,
		contextActions = defaultProps.contextActions,
		contextComponent = defaultProps.contextComponent,
		expandableRows = defaultProps.expandableRows,
		onRowClicked = defaultProps.onRowClicked,
		onRowDoubleClicked = defaultProps.onRowDoubleClicked,
		onRowMouseEnter = defaultProps.onRowMouseEnter,
		onRowMouseLeave = defaultProps.onRowMouseLeave,
		sortIcon = defaultProps.sortIcon,
		onSort = defaultProps.onSort,
		sortFunction = defaultProps.sortFunction,
		sortServer = defaultProps.sortServer,
		expandableRowsComponent = defaultProps.expandableRowsComponent,
		expandableRowsComponentProps = defaultProps.expandableRowsComponentProps,
		expandableRowDisabled = defaultProps.expandableRowDisabled,
		expandableRowsHideExpander = defaultProps.expandableRowsHideExpander,
		expandOnRowClicked = defaultProps.expandOnRowClicked,
		expandOnRowDoubleClicked = defaultProps.expandOnRowDoubleClicked,
		expandableRowExpanded = defaultProps.expandableRowExpanded,
		expandableInheritConditionalStyles = defaultProps.expandableInheritConditionalStyles,
		defaultSortFieldId = defaultProps.defaultSortFieldId,
		defaultSortAsc = defaultProps.defaultSortAsc,
		clearSelectedRows = defaultProps.clearSelectedRows,
		conditionalRowStyles = defaultProps.conditionalRowStyles,
		theme = defaultProps.theme,
		customStyles = defaultProps.customStyles,
		direction = defaultProps.direction,
		onColumnOrderChange = defaultProps.onColumnOrderChange,
		className,
		showActions,
		showSearch,
		searchComponentStyle,
		actionsIcon,
		showFilter,
		mainComtainerId = '',
	} = props;

	const {
		tableColumns,
		draggingColumnId,
		handleDragStart,
		handleDragEnter,
		handleDragOver,
		handleDragLeave,
		handleDragEnd,
		defaultSortDirection,
		defaultSortColumn,
	} = useColumns(columns, onColumnOrderChange, defaultSortFieldId, defaultSortAsc);

	const [
		{
			rowsPerPage,
			currentPage,
			selectedRows,
			allSelected,
			selectedCount,
			selectedColumn,
			sortDirection,
			toggleOnSelectedRowsChange,
		},
		dispatch,
	] = React.useReducer<React.Reducer<TableState<T>, Action<T>>>(tableReducer, {
		allSelected: false,
		selectedCount: 0,
		selectedRows: [],
		selectedColumn: defaultSortColumn,
		toggleOnSelectedRowsChange: false,
		sortDirection: defaultSortDirection,
		currentPage: paginationDefaultPage,
		rowsPerPage: paginationPerPage,
		selectedRowsFlag: false,
		contextMessage: defaultProps.contextMessage,
	});

	const [filterText, setFilterText] = React.useState('');
	const [filters, setFilters] = React.useState<Filter[]>([]);
	const { persistSelectedOnSort = false, persistSelectedOnPageChange = false } = paginationServerOptions;
	const mergeSelections = !!(paginationServer && (persistSelectedOnPageChange || persistSelectedOnSort));
	const enabledPagination = pagination && !progressPending && data.length > 0;
	const Pagination = paginationComponent || NativePagination;

	const currentTheme = React.useMemo(() => createStyles(customStyles, theme), [customStyles, theme]);
	const wrapperProps = React.useMemo(() => ({ ...(direction !== 'auto' && { dir: direction }) }), [direction]);

	const sortedData = React.useMemo(() => {
		// server-side sorting bypasses internal sorting
		if (sortServer) {
			return data;
		}

		if (selectedColumn?.sortFunction && typeof selectedColumn.sortFunction === 'function') {
			const sortFn = selectedColumn.sortFunction;
			const customSortFunction = sortDirection === SortOrder.ASC ? sortFn : (a: T, b: T) => sortFn(a, b) * -1;

			return [...data].sort(customSortFunction);
		}

		return sort(data, selectedColumn?.selector, sortDirection, sortFunction);
	}, [sortServer, selectedColumn, sortDirection, data, sortFunction]);

	const tableRows = React.useMemo(() => {
		let filterd = null
		if (filterText && filterText != '') {
			filterd = sortedData.filter(
				item =>
					JSON.stringify(item)
						.toLowerCase()
						.indexOf(filterText.toLowerCase()) !== -1
			);
		}


		if (pagination && !paginationServer) {
			// when using client-side pagination we can just slice the rows set
			const lastIndex = currentPage * rowsPerPage;
			const firstIndex = lastIndex - rowsPerPage;

			let tableData = filterd != null && filterd.length > 0 ? filterd : sortedData;


			if (filters && filters.length > 0) {

				let filteredData = tableData.filter((item: any) => {
					return filters.every(filter => {
						const columnValue = item[filter.columnName];
						const filterValues = filter.filterText;
						if (filterValues === undefined || filterValues.length === 0) {
							return true; // Ignore the filter if filterText is empty
						}
						return filterValues.includes(columnValue);
					});
				})

				return filteredData.length > 0 ? filteredData.slice(firstIndex, lastIndex) : [];
			} else {
				return tableData.slice(firstIndex, lastIndex);
			}

		}

		if (filterd != null && filterd.length > 0) {
			return filterd;
		} else {
			return sortedData;

		}

	}, [currentPage, pagination, paginationServer, rowsPerPage, sortedData, filterText, filters]);

	const handleSort = React.useCallback((action: SortAction<T>) => {
		dispatch(action);
	}, []);

	const handleSelectAllRows = React.useCallback((action: AllRowsAction<T>) => {
		dispatch(action);
	}, []);

	const handleSelectedRow = React.useCallback((action: SingleRowAction<T>) => {
		dispatch(action);
	}, []);

	const handleRowClicked = React.useCallback(
		(row: T, e: React.MouseEvent<Element, MouseEvent>) => onRowClicked(row, e),
		[onRowClicked],
	);

	const handleRowDoubleClicked = React.useCallback(
		(row: T, e: React.MouseEvent<Element, MouseEvent>) => onRowDoubleClicked(row, e),
		[onRowDoubleClicked],
	);

	const handleRowMouseEnter = React.useCallback(
		(row: T, e: React.MouseEvent<Element, MouseEvent>) => onRowMouseEnter(row, e),
		[onRowMouseEnter],
	);

	const handleRowMouseLeave = React.useCallback(
		(row: T, e: React.MouseEvent<Element, MouseEvent>) => onRowMouseLeave(row, e),
		[onRowMouseLeave],
	);

	const handleChangePage = React.useCallback(
		(page: number) =>
			dispatch({
				type: 'CHANGE_PAGE',
				page,
				paginationServer,
				visibleOnly: selectableRowsVisibleOnly,
				persistSelectedOnPageChange,
			}),
		[paginationServer, persistSelectedOnPageChange, selectableRowsVisibleOnly],
	);

	const handleChangeRowsPerPage = React.useCallback(
		(newRowsPerPage: number) => {
			const rowCount = paginationTotalRows || tableRows.length;
			const updatedPage = getNumberOfPages(rowCount, newRowsPerPage);
			const recalculatedPage = recalculatePage(currentPage, updatedPage);

			// update the currentPage for client-side pagination
			// server - side should be handled by onChangeRowsPerPage
			if (!paginationServer) {
				handleChangePage(recalculatedPage);
			}

			dispatch({ type: 'CHANGE_ROWS_PER_PAGE', page: recalculatedPage, rowsPerPage: newRowsPerPage });
		},
		[currentPage, handleChangePage, paginationServer, paginationTotalRows, tableRows.length],
	);

	const showTableHead = () => {
		if (noTableHead) {
			return false;
		}

		if (persistTableHead) {
			return true;
		}

		return sortedData.length > 0 && !progressPending;
	};

	const showHeader = () => {
		if (noHeader) {
			return false;
		}

		if (title) {
			return true;
		}

		if (actions) {
			return true;
		}

		return false;
	};

	// recalculate the pagination and currentPage if the rows length changes
	if (pagination && !paginationServer && sortedData.length > 0 && tableRows.length === 0) {
		const updatedPage = getNumberOfPages(sortedData.length, rowsPerPage);
		const recalculatedPage = recalculatePage(currentPage, updatedPage);

		handleChangePage(recalculatedPage);
	}

	useDidUpdateEffect(() => {
		onSelectedRowsChange({ allSelected, selectedCount, selectedRows: selectedRows.slice(0) });
		// onSelectedRowsChange trigger is controlled by toggleOnSelectedRowsChange state
	}, [toggleOnSelectedRowsChange]);

	useDidUpdateEffect(() => {
		onSort(selectedColumn, sortDirection, sortedData.slice(0));
		// do not update on sortedData
	}, [selectedColumn, sortDirection]);

	useDidUpdateEffect(() => {
		onChangePage(currentPage, paginationTotalRows || sortedData.length);
	}, [currentPage]);

	useDidUpdateEffect(() => {
		onChangeRowsPerPage(rowsPerPage, currentPage);
	}, [rowsPerPage]);

	useDidUpdateEffect(() => {
		handleChangePage(paginationDefaultPage);
	}, [paginationDefaultPage, paginationResetDefaultPage]);

	useDidUpdateEffect(() => {
		if (pagination && paginationServer && paginationTotalRows > 0) {
			const updatedPage = getNumberOfPages(paginationTotalRows, rowsPerPage);
			const recalculatedPage = recalculatePage(currentPage, updatedPage);

			if (currentPage !== recalculatedPage) {
				handleChangePage(recalculatedPage);
			}
		}
	}, [paginationTotalRows]);

	React.useEffect(() => {
		dispatch({ type: 'CLEAR_SELECTED_ROWS', selectedRowsFlag: clearSelectedRows });
	}, [selectableRowsSingle, clearSelectedRows]);

	React.useEffect(() => {
		if (!selectableRowSelected) {
			return;
		}

		const preSelectedRows = sortedData.filter(row => selectableRowSelected(row));
		// if selectableRowsSingle mode then return the first match
		const selected = selectableRowsSingle ? preSelectedRows.slice(0, 1) : preSelectedRows;

		dispatch({
			type: 'SELECT_MULTIPLE_ROWS',
			keyField,
			selectedRows: selected,
			totalRows: sortedData.length,
			mergeSelections,
		});

		// We only want to update the selectedRowState if data changes
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data, selectableRowSelected]);

	const visibleRows = selectableRowsVisibleOnly ? tableRows : sortedData;
	const showSelectAll = persistSelectedOnPageChange || selectableRowsSingle || selectableRowsNoSelectAll;











	type Filter = {
		columnName: string;
		filterText: any[];
	};



	const [customTableColumns, setCustomTableColumns] = React.useState(tableColumns);
	const [showActionsColumn, setShowActionsColumn] = React.useState(showActions);
	const [showActionMenu, setShowActionMenu] = React.useState(false);
	const [position, setPosition] = React.useState({ x: 0, y: 0 });
	const [showFilterMenu, setShowFilterMenu] = React.useState(false);
	const [filterListData, setFilterListData] = React.useState([])
	const [selectedFilterColumn, setSelectedFilterColumn] = React.useState('');
	const [selectedFilterList, setSelectedFilterList] = React.useState([]);




	const handleShowActions = (event: any) => {
		const x = event.clientX;
		const y = event.clientY;
		setPosition({ x, y });
		setShowActionMenu(true);
	};



	React.useEffect(() => {
		if (showActionsColumn) {
			const columns = [
				...tableColumns,
				{
					name: 'Actions',
					cell: (row: any) => <button style={{ background: 'transparent', border: 'none' }} onClick={(e) => handleShowActions(e)}>{actionsIcon ? actionsIcon : <IoEllipsisHorizontalSharp />}</button>,
					with: '10px',
					wrap: false,
					identifier: 'actions'

				}
			];
			setCustomTableColumns(columns);

			setShowActionsColumn(false);
		}

	}, []);


	React.useEffect(() => {
		const scrollableElement = mainComtainerId == '' ? document : document.getElementById(mainComtainerId);

		const handleScroll = () => {
			hideMenus()
		};

		if (scrollableElement) {
			scrollableElement.addEventListener('scroll', handleScroll);
		}
		// Clean up the event listener when the component unmounts
		return () => {
			if (scrollableElement) {
				scrollableElement.removeEventListener('scroll', handleScroll);
			}
		};
	}, []);

	const hideMenus = () => {
		setShowActionMenu(false);
		setShowFilterMenu(false);

	}

	const handleClickOutside = (event: any) => {
		let targetElement = event.target; // clicked element

		do {

			if (targetElement.id && (targetElement.id.includes('actionsBox') || targetElement.id.includes('filterBox'))) {
				// This is a click inside. Do nothing, just return.
				return;
			}
			targetElement = targetElement.parentNode;
		} while (targetElement);

		hideMenus()


	};

	React.useEffect(() => {
		// Attach the listeners to the document
		document.addEventListener("mousedown", handleClickOutside);
		document.addEventListener("touchstart", handleClickOutside);
		return () => {
			// Cleanup the event listeners on component unmount
			document.removeEventListener("mousedown", handleClickOutside);
			document.removeEventListener("touchstart", handleClickOutside);
		};
	}, []);

	function extractField(array: any, fieldName: string) {

		const uniqueValues = new Set();
		array.forEach((item: { [x: string]: any }) => {
			uniqueValues.add(item[fieldName]);
		});
		return Array.from(uniqueValues);
	}
	const getSelectedFilter = (columnName: string) => {
		const filter = filters.find((filter) => filter.columnName === columnName);
		if (filter) {
			return filter.filterText;
		}
		return [];
	};

	const handleFilterClick = (event: any, identifier: string) => {
		const x = event.clientX;
		const y = event.clientY;
		setPosition({ x, y });
		setShowFilterMenu(true);
		const fieldValues: unknown[] = extractField(data, identifier);
		setFilterListData(fieldValues as never[]);
		setSelectedFilterColumn(identifier);
		setSelectedFilterList(getSelectedFilter(identifier) as never[]);
	};



	const handleFilteredData = (selectedFilters: any[]) => {
		console.log('selectedFilters', selectedFilters);

		// Create a new object with the selected column and filter
		const newFilter = {
			columnName: selectedFilterColumn,
			filterText: selectedFilters,
		};

		// Check if a filter for the selected column already exists
		const existingFilterIndex = filters.findIndex(
			(filter) => filter.columnName === selectedFilterColumn
		);

		if (existingFilterIndex !== -1) {
			if (selectedFilters.length === 0) {
				// If filterText is empty, remove the corresponding item from the filters array
				setFilters((prevFilterArray) => {
					const newFilterArray = [...prevFilterArray];
					newFilterArray.splice(existingFilterIndex, 1);
					return newFilterArray;
				});
			} else {
				// If it exists and filterText is not empty, update the filter text
				setFilters((prevFilterArray) => {
					const newFilterArray = [...prevFilterArray];
					newFilterArray[existingFilterIndex] = newFilter;
					return newFilterArray;
				});
			}
		} else {
			if (selectedFilters.length > 0) {
				// If it doesn't exist and filterText is not empty, add the new filter to the array
				setFilters((prevFilterArray) => [...prevFilterArray, newFilter]);
			}
		}

		console.log('filters', filters);

	};




	const handleClearFilter = (columnName: string) => {
		setFilters(prevFilters => prevFilters.filter(filter => filter.columnName !== columnName));
	};


	return (
		<ThemeProvider theme={currentTheme}>
			{showHeader() && (
				<Header
					title={title}
					actions={actions}
					showMenu={!noContextMenu}
					selectedCount={selectedCount}
					direction={direction}
					contextActions={contextActions}
					contextComponent={contextComponent}
					contextMessage={contextMessage}
				/>
			)}

			{subHeader && (
				<Subheader align={subHeaderAlign} wrapContent={subHeaderWrap}>
					{subHeaderComponent}
				</Subheader>
			)}

			<ResponsiveWrapper
				$responsive={responsive}
				$fixedHeader={fixedHeader}
				$fixedHeaderScrollHeight={fixedHeaderScrollHeight}
				className={className}
				{...wrapperProps}
			>
				<Wrapper>
					{progressPending && !persistTableHead && <ProgressWrapper>{progressComponent}</ProgressWrapper>}
					{showSearch && <SearchComponent
						onFilter={e => setFilterText(e.target.value)}
						filterText={filterText}
						wrapperStyle={searchComponentStyle}
					/>}
					{<div style={{ display: "flex", flexDirection: 'row', gap: '10px' }}>
						{
							filters && filters.map((filter, index) => {
								return (
									filter.filterText.length > 0 && (
										<div key={index} style={{marginTop:"5px",  border: '2px solid #DB4A11', padding: '10px', borderRadius: '10px', display: "flex", flexDirection: "row" }}>
											<p style={{ fontWeight: "bold", color: "#DB4A11" }}>
												{filter.columnName + ': ' + filter.filterText.map(text => text.substring(0, 10) + '..').join(', ')}
											</p>
											<button style={{ backgroundColor: "transparent", border: "none", fontSize: '19px' ,color: "#DB4A11" }} onClick={() => handleClearFilter(filter.columnName)} ><IoCloseSharp /></button>
										</div>
									)
								)
							})
						}
					</div>}
					<Table disabled={disabled} className="rdt_Table" role="table">
						{showTableHead() && (
							<Head className="rdt_TableHead" role="rowgroup" $fixedHeader={fixedHeader}>
								<HeadRow className="rdt_TableHeadRow" role="row" $dense={dense}>
									{selectableRows &&
										(showSelectAll ? (
											<CellBase style={{ flex: '0 0 48px' }} />
										) : (
											<ColumnCheckbox
												allSelected={allSelected}
												selectedRows={selectedRows}
												selectableRowsComponent={selectableRowsComponent}
												selectableRowsComponentProps={selectableRowsComponentProps}
												selectableRowDisabled={selectableRowDisabled}
												rowData={visibleRows}
												keyField={keyField}
												mergeSelections={mergeSelections}
												onSelectAllRows={handleSelectAllRows}
											/>
										))}
									{expandableRows && !expandableRowsHideExpander && <ColumnExpander />}
									{customTableColumns.map(column => (
										<Column
											key={column.id}
											column={column}
											selectedColumn={selectedColumn}
											disabled={progressPending || sortedData.length === 0}
											pagination={pagination}
											paginationServer={paginationServer}
											persistSelectedOnSort={persistSelectedOnSort}
											selectableRowsVisibleOnly={selectableRowsVisibleOnly}
											sortDirection={sortDirection}
											sortIcon={sortIcon}
											sortServer={sortServer}
											onSort={handleSort}
											onDragStart={handleDragStart}
											onDragOver={handleDragOver}
											onDragEnd={handleDragEnd}
											onDragEnter={handleDragEnter}
											onDragLeave={handleDragLeave}
											draggingColumnId={draggingColumnId}
											showFilter={showFilter ?? true}
											showFilterList={handleFilterClick}
										/>
									))}
								</HeadRow>
							</Head>
						)}

						{!sortedData.length && !progressPending && <NoData>{noDataComponent}</NoData>}

						{progressPending && persistTableHead && <ProgressWrapper>{progressComponent}</ProgressWrapper>}

						{!progressPending && sortedData.length > 0 && (
							<Body className="rdt_TableBody" role="rowgroup">
								{tableRows.map((row, i) => {
									const key = prop(row as TableRow, keyField) as string | number;
									const id = isEmpty(key) ? i : key;
									const selected = isRowSelected(row, selectedRows, keyField);
									const expanderExpander = !!(expandableRows && expandableRowExpanded && expandableRowExpanded(row));
									const expanderDisabled = !!(expandableRows && expandableRowDisabled && expandableRowDisabled(row));

									return (
										<Row
											id={id}
											key={id}
											keyField={keyField}
											data-row-id={id}
											columns={customTableColumns}
											row={row}
											rowCount={sortedData.length}
											rowIndex={i}
											selectableRows={selectableRows}
											expandableRows={expandableRows}
											expandableIcon={expandableIcon}
											highlightOnHover={highlightOnHover}
											pointerOnHover={pointerOnHover}
											dense={dense}
											expandOnRowClicked={expandOnRowClicked}
											expandOnRowDoubleClicked={expandOnRowDoubleClicked}
											expandableRowsComponent={expandableRowsComponent}
											expandableRowsComponentProps={expandableRowsComponentProps}
											expandableRowsHideExpander={expandableRowsHideExpander}
											defaultExpanderDisabled={expanderDisabled}
											defaultExpanded={expanderExpander}
											expandableInheritConditionalStyles={expandableInheritConditionalStyles}
											conditionalRowStyles={conditionalRowStyles}
											selected={selected}
											selectableRowsHighlight={selectableRowsHighlight}
											selectableRowsComponent={selectableRowsComponent}
											selectableRowsComponentProps={selectableRowsComponentProps}
											selectableRowDisabled={selectableRowDisabled}
											selectableRowsSingle={selectableRowsSingle}
											striped={striped}
											onRowExpandToggled={onRowExpandToggled}
											onRowClicked={handleRowClicked}
											onRowDoubleClicked={handleRowDoubleClicked}
											onRowMouseEnter={handleRowMouseEnter}
											onRowMouseLeave={handleRowMouseLeave}
											onSelectedRow={handleSelectedRow}
											draggingColumnId={draggingColumnId}
											onDragStart={handleDragStart}
											onDragOver={handleDragOver}
											onDragEnd={handleDragEnd}
											onDragEnter={handleDragEnter}
											onDragLeave={handleDragLeave}
										/>
									);
								})}
							</Body>
						)}
					</Table>
				</Wrapper>
			</ResponsiveWrapper>

			{enabledPagination && (
				<div>
					<Pagination
						onChangePage={handleChangePage}
						onChangeRowsPerPage={handleChangeRowsPerPage}
						rowCount={paginationTotalRows || sortedData.length}
						currentPage={currentPage}
						rowsPerPage={rowsPerPage}
						direction={direction}
						paginationRowsPerPageOptions={paginationRowsPerPageOptions}
						paginationIconLastPage={paginationIconLastPage}
						paginationIconFirstPage={paginationIconFirstPage}
						paginationIconNext={paginationIconNext}
						paginationIconPrevious={paginationIconPrevious}
						paginationComponentOptions={paginationComponentOptions}
					/>
				</div>
			)}


			{
				showActionMenu && (
					<ActionsMenu position={position} theme={currentTheme} />
				)
			}
			{
				showFilterMenu && (
					<ColumnFilterList position={position} theme={currentTheme} listData={filterListData} handleFilteredData={handleFilteredData} selectedFilterList={selectedFilterList} />
				)
			}
		</ThemeProvider>
	);
}

export default React.memo(DataTable) as typeof DataTable;
