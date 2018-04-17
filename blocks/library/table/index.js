/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import './editor.scss';
import './style.scss';
import TableBlock from './table-block';
import BlockControls from '../../block-controls';
import BlockAlignmentToolbar from '../../block-alignment-toolbar';
import { getPhrasingContentSchema } from '../../api';

const tableContentSchema = {
	tr: {
		children: {
			th: {
				children: getPhrasingContentSchema(),
			},
			td: {
				children: getPhrasingContentSchema(),
			},
		},
	},
};

const tableSchema = {
	table: {
		children: {
			thead: {
				children: tableContentSchema,
			},
			tfoot: {
				children: tableContentSchema,
			},
			tbody: {
				children: tableContentSchema,
			},
		},
	},
};

export const name = 'core/table';

export const settings = {
	title: __( 'Table' ),
	description: __( 'Tables. Best used for tabular data.' ),
	icon: 'editor-table',
	category: 'formatting',

	attributes: {
		content: {
			type: 'array',
			source: 'children',
			selector: 'table',
			default: [
				<tbody key="1">
					<tr><td><br /></td><td><br /></td></tr>
					<tr><td><br /></td><td><br /></td></tr>
				</tbody>,
			],
		},
		align: {
			type: 'string',
		},
	},

	transforms: {
		from: [
			{
				type: 'raw',
				selector: 'table',
				schema: tableSchema,
			},
		],
	},

	getEditWrapperProps( attributes ) {
		const { align } = attributes;
		if ( 'left' === align || 'right' === align || 'wide' === align || 'full' === align ) {
			return { 'data-align': align };
		}
	},

	edit( { attributes, setAttributes, isSelected, className } ) {
		const { content } = attributes;
		const updateAlignment = ( nextAlign ) => setAttributes( { align: nextAlign } );
		return [
			isSelected && (
				<BlockControls key="toolbar">
					<BlockAlignmentToolbar
						value={ attributes.align }
						onChange={ updateAlignment }
					/>
				</BlockControls>
			),
			<TableBlock
				key="editor"
				onChange={ ( nextContent ) => {
					setAttributes( { content: nextContent } );
				} }
				content={ content }
				className={ className }
				isSelected={ isSelected }
			/>,
		];
	},

	save( { attributes } ) {
		const { content, align } = attributes;
		return (
			<table className={ align ? `align${ align }` : null }>
				{ content }
			</table>
		);
	},
};
