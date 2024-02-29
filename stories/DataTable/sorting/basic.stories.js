import React from 'react';
import doc from './basic.mdx';
import data from '../../constants/sampleMovieData';
import DataTable, {createTheme} from '../../../src/index';
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
	createTheme('solarized', {
		text: {
				primary: '#fff',
				secondary: '#fff',
		},
		background: {
				default: '#1A202C',
		},
		context: {
				background: '#cb4b16',
				text: '#FFFFFF',
		},
		divider: {
				default: '#fff',
		},
		action: {
				button: 'rgba(0,0,0,.54)',
				hover: 'rgba(0,0,0,.08)',
				disabled: 'rgba(0,0,0,.12)',
		},
}, 'dark');


	return <DataTable title="Movie List"   columns={columns} data={data} pagination searchComponentStyle={{
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
