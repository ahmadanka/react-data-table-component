import React from 'react';
import doc from './basic.mdx';
import data from '../../constants/sampleMovieData';
import DataTable from '../../../src/index';
import { IoChevronUpOutline, IoEllipsisHorizontalSharp } from 'react-icons/io5';

const columns = [
	{
		name: 'Title',
		selector: row => row.title,
		sortable: true,
		identifier: 'title'
	},
	{
		name: 'Director',
		selector: row => row.director,
		sortable: true,
		identifier: 'director'
	},
	{
		name: 'year',
		selector: row => row.year,
		sortable: true,
		identifier: 'year'
	},
];

export const Basic = () => {
	return <DataTable title="Movie List" columns={columns} data={data} pagination searchComponentStyle={{
		border: '1px solid #E2E8F0', width: '300px',
		borderRadius: '8px'
	}}
		actionsIcon={<span style={{ color:'orange'}}><IoEllipsisHorizontalSharp /></span>}
		showActions={true} showSearch={true} sortIcon={<IoChevronUpOutline />} />;
};

export default {
	title: 'Sorting/Basic',
	component: Basic,
	parameters: {
		docs: {
			page: doc,
		},
	},
};
