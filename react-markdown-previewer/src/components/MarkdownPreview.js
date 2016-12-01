import React from 'react';
import Marked from 'marked';
import '../styles/MarkdownPreview.scss';

function MarkdownPreview(props) {
	return (
			<div 
				className='markdown-preview'
				dangerouslySetInnerHTML={{__html: Marked(props.markdown)}} />
	)
}

export default MarkdownPreview;