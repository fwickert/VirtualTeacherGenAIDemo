import React from 'react';
import { marked } from 'marked';

interface MarkdownRendererProps {
    markdown: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ markdown }) => {
    const getMarkdownText = () => {
        if (markdown === "" || markdown === undefined) {
            return { __html: markdown };            
        }
        const rawMarkup = marked(markdown);
        return { __html: rawMarkup };
        
        
    };

    return <span dangerouslySetInnerHTML={getMarkdownText()} />;
};

export default MarkdownRenderer;
