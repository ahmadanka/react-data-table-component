import * as React from 'react';
import styled, { css } from 'styled-components';
import { CellExtended, CellProps } from './Cell';
import NativeSortIcon from '../icons/NativeSortIcon';
import { equalizeId } from './util';
import { TableColumn, SortAction, SortOrder } from './types';
import { IoFilter } from 'react-icons/io5';

interface ColumnStyleProps extends CellProps {
	$isDragging?: boolean;
	onDragStart: (e: React.DragEvent<HTMLDivElement>) => void;
	onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
	onDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
	onDragEnter: (e: React.DragEvent<HTMLDivElement>) => void;
	onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
}

const ColumnStyled = styled(CellExtended) <ColumnStyleProps>`
	${({ button }) => button && 'text-align: center'};
	${({ theme, $isDragging }) => $isDragging && theme.headCells.draggingStyle};
`;

interface ColumnSortableProps {
	disabled: boolean;
	$sortActive: boolean;
}

const sortableCSS = css<ColumnSortableProps>`

	span.__rdt_custom_sort_icon__ {
		i,
		svg {
			transform: 'translate3d(0, 0, 0)';
			${({ $sortActive }) => ($sortActive ? 'opacity: 1' : 'opacity: 0')};
			color: inherit;
			font-size: 18px;
			height: 18px;
			width: 18px;
			backface-visibility: hidden;
			transform-style: preserve-3d;
			transition-duration: 95ms;
			transition-property: transform;
		}

		&.asc i,
		&.asc svg {
			transform: rotate(180deg);
		}
	}

	${({ $sortActive }) =>
		!$sortActive &&
		css`
			&:hover,
			&:focus {
				opacity: 0.7;

				span,
				span.__rdt_custom_sort_icon__ * {
					opacity: 0.7;
				}
			}
		`};
`;

const ColumnSortable = styled.div<ColumnSortableProps>`
	display: inline-flex;
	align-items: center;
	justify-content: inherit;
	height: 100%;
	width: 100%;
	outline: none;
	user-select: none;
	overflow: hidden;
	${({ disabled }) => !disabled && sortableCSS};
`;

const ColumnText = styled.div`
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
`;
const IconBtn = styled.button`
background-color: transparent;
 border: none;
  cursor: pointer;
	margin-left: 5px;
	margin-right: 5px;
`;

type TableColProps<T> = {
	column: TableColumn<T>;
	disabled: boolean;
	draggingColumnId?: string | number;
	sortIcon?: React.ReactNode;
	pagination: boolean;
	paginationServer: boolean;
	persistSelectedOnSort: boolean;
	selectedColumn: TableColumn<T>;
	sortDirection: SortOrder;
	sortServer: boolean;
	selectableRowsVisibleOnly: boolean;
	onSort: (action: SortAction<T>) => void;
	onDragStart: (e: React.DragEvent<HTMLDivElement>) => void;
	onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
	onDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
	onDragEnter: (e: React.DragEvent<HTMLDivElement>) => void;
	onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
	showFilter: boolean;
	showFilterList: (event: any, selector: string) => void;
};

function TableCol<T>({
	column,
	disabled,
	draggingColumnId,
	selectedColumn = {
		identifier: ''
	},
	sortDirection,
	sortIcon,
	sortServer,
	pagination,
	paginationServer,
	persistSelectedOnSort,
	selectableRowsVisibleOnly,
	onSort,
	onDragStart,
	onDragOver,
	onDragEnd,
	onDragEnter,
	onDragLeave,
	showFilter,
	showFilterList
}: TableColProps<T>): JSX.Element | null {
	React.useEffect(() => {
		if (typeof column.selector === 'string') {
			console.error(
				`Warning: ${column.selector} is a string based column selector which has been deprecated as of v7 and will be removed in v8. Instead, use a selector function e.g. row => row[field]...`,
			);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const [showTooltip, setShowTooltip] = React.useState(false);
	const columnRef = React.useRef<HTMLDivElement | null>(null);
	React.useEffect(() => {
		if (columnRef.current) {
			setShowTooltip(columnRef.current.scrollWidth > columnRef.current.clientWidth);
		}
	}, [showTooltip]);

	if (column.omit) {
		return null;
	}

	const handleSortChange = () => {
		if (!column.sortable && !column.selector) {
			return;
		}

		let direction = sortDirection;

		if (equalizeId(selectedColumn.id, column.id)) {
			direction = sortDirection === SortOrder.DESC ? SortOrder.ASC : SortOrder.DESC;
		}

		onSort({
			type: 'SORT_CHANGE',
			sortDirection: direction,
			selectedColumn: column,
			clearSelectedOnSort:
				(pagination && paginationServer && !persistSelectedOnSort) || sortServer || selectableRowsVisibleOnly,
		});
	};

	const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
		if (event.key === 'Enter') {
			handleSortChange();
		}
	};

	const renderNativeSortIcon = (sortActive: boolean, onClick: any) => (
		<IconBtn onClick={onClick}>
			<NativeSortIcon sortActive={sortActive} sortDirection={sortDirection} />
		</IconBtn>
	);

	const renderCustomSortIcon = (onClick: any) => (
		<IconBtn onClick={onClick}>
			<span className={[sortDirection, '__rdt_custom_sort_icon__'].join(' ')}>{sortIcon}</span>
		</IconBtn>
	);

	const sortActive = !!(column.sortable && equalizeId(selectedColumn.id, column.id));
	const disableSort = !column.sortable || disabled;
	const nativeSortIconLeft = column.sortable && !sortIcon && !column.right;
	const nativeSortIconRight = column.sortable && !sortIcon && column.right;
	const customSortIconLeft = column.sortable && sortIcon && !column.right;
	const customSortIconRight = column.sortable && sortIcon && column.right;

	return (
		<ColumnStyled
			data-column-id={column.id}
			className="rdt_TableCol"
			$headCell
			allowOverflow={column.allowOverflow}
			button={column.button}
			compact={column.compact}
			grow={column.grow}
			hide={column.hide}
			maxWidth={column.maxWidth}
			minWidth={column.minWidth}
			right={column.right}
			center={column.center}
			width={column.width}
			draggable={column.reorder}
			$isDragging={equalizeId(column.id, draggingColumnId)}
			onDragStart={onDragStart}
			onDragOver={onDragOver}
			onDragEnd={onDragEnd}
			onDragEnter={onDragEnter}
			onDragLeave={onDragLeave}
		>
			{column.name && (
				<ColumnSortable
					data-column-id={column.id}
					data-sort-id={column.id}
					role="columnheader"
					tabIndex={0}
					className="rdt_TableCol_Sortable"

					onKeyPress={!disableSort ? handleKeyPress : undefined}
					$sortActive={!disableSort && sortActive}
					disabled={disableSort}
				>
					<div style={{ display: 'flex', justifyContent: "space-between", width: "100%" }}>


						{!disableSort && customSortIconRight && renderCustomSortIcon(!disableSort ? handleSortChange : null)}
						{!disableSort && nativeSortIconRight && renderNativeSortIcon(sortActive, !disableSort ? handleSortChange : null)}

						<div style={{ display: 'flex', justifyContent: "space-between" }}>

							{typeof column.name === 'string' ? (
								<ColumnText title={showTooltip ? column.name : undefined} ref={columnRef} data-column-id={column.id}>
									{column.name}
								</ColumnText>
							) : (
								column.name
							)}
							{
								(showFilter && column.identifier && column.identifier!='actions') && <IconBtn onClick={(e) => { showFilterList(e, column.identifier) }} ><IoFilter /></IconBtn>
							}
						</div>


						{!disableSort && customSortIconLeft && renderCustomSortIcon(!disableSort ? handleSortChange : null)}
						{!disableSort && nativeSortIconLeft && renderNativeSortIcon(sortActive, !disableSort ? handleSortChange : null)}
					</div>

				</ColumnSortable>
			)}
		</ColumnStyled>
	);
}

export default React.memo(TableCol) as typeof TableCol;
