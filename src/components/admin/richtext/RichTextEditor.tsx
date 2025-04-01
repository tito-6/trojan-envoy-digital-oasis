
import React, { useState, useEffect } from 'react';
import { EditorState, ContentState, convertToRaw, convertFromRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

interface RichTextEditorProps {
  label?: string;
  value: string | { blocks: any[]; entityMap: Record<string, any> } | undefined;
  onChange: (value: { blocks: any[]; entityMap: Record<string, any> }) => void;
  placeholder?: string;
  height?: string;
  className?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  label,
  value,
  onChange,
  placeholder = 'Enter text here...',
  height = '200px',
  className = '',
}) => {
  const [editorState, setEditorState] = useState(() => {
    if (!value) {
      return EditorState.createEmpty();
    }

    try {
      // Handle both string and object formats
      const contentState = typeof value === 'string'
        ? ContentState.createFromText(value)
        : convertFromRaw(value as any);
      
      return EditorState.createWithContent(contentState);
    } catch (error) {
      console.error('Error parsing rich text content:', error);
      return EditorState.createEmpty();
    }
  });

  const handleEditorChange = (state: EditorState) => {
    setEditorState(state);
    const rawContent = convertToRaw(state.getCurrentContent());
    onChange(rawContent);
  };

  return (
    <div className={`w-full ${className}`}>
      {label && <Label className="mb-2 block">{label}</Label>}
      <Card className="p-0 overflow-hidden border rounded-md">
        <Editor
          editorState={editorState}
          onEditorStateChange={handleEditorChange}
          wrapperClassName="w-full"
          editorClassName={`px-3 py-2 min-h-[${height}]`}
          toolbarClassName="border-0 border-b !bg-muted/30"
          placeholder={placeholder}
          toolbar={{
            options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'link', 'emoji', 'history'],
            inline: {
              options: ['bold', 'italic', 'underline', 'strikethrough', 'monospace'],
            },
            blockType: {
              options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'Blockquote'],
            },
            fontSize: {
              options: [8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48, 60, 72, 96],
            },
            fontFamily: {
              options: ['Arial', 'Georgia', 'Impact', 'Tahoma', 'Times New Roman', 'Verdana'],
            },
            textAlign: {
              options: ['left', 'center', 'right', 'justify'],
            },
            colorPicker: {
              colors: ['rgb(97,189,109)', 'rgb(26,188,156)', 'rgb(84,172,210)', 'rgb(44,130,201)', 
                      'rgb(147,101,184)', 'rgb(71,85,119)', 'rgb(204,204,204)', 'rgb(65,168,95)', 
                      'rgb(0,168,133)', 'rgb(61,142,185)', 'rgb(41,105,176)', 'rgb(85,57,130)', 
                      'rgb(40,50,78)', 'rgb(0,0,0)', 'rgb(247,218,100)', 'rgb(251,160,38)', 
                      'rgb(235,107,86)', 'rgb(226,80,65)', 'rgb(163,143,132)', 'rgb(239,239,239)', 
                      'rgb(255,255,255)', 'rgb(250,197,28)', 'rgb(243,121,52)', 'rgb(209,72,65)', 
                      'rgb(184,49,47)', 'rgb(124,112,107)', 'rgb(209,213,216)'],
            },
          }}
        />
      </Card>
    </div>
  );
};

export default RichTextEditor;
