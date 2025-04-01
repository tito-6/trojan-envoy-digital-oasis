
import React, { useState, useEffect } from 'react';
import { EditorState, ContentState, convertToRaw, convertFromRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import './rich-text-editor.css';

// Import the polyfill at the component level to ensure it's loaded
import '@/lib/polyfills';

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

  // Ensure we initialize polyfills for draft-js
  useEffect(() => {
    // This ensures any needed polyfills are active when the editor mounts
    if (typeof window !== 'undefined') {
      console.log('Rich text editor mounted with polyfills');
    }
  }, []);

  const handleEditorChange = (state: EditorState) => {
    setEditorState(state);
    const rawContent = convertToRaw(state.getCurrentContent());
    onChange(rawContent);
  };

  // Custom dropdown renderer to make dropdowns scrollable
  const customDropdownRenderer = (config: any) => {
    return (
      <ScrollArea className="dropdown-wrapper max-h-60">
        <div className="rdw-dropdown-optionwrapper">
          {config.children}
        </div>
      </ScrollArea>
    );
  };

  // Custom emoji picker with scrolling
  const customEmojiPicker = (config: any) => {
    return (
      <ScrollArea className="emoji-wrapper max-h-60">
        <div className="rdw-emoji-modal">
          {config.children}
        </div>
      </ScrollArea>
    );
  };

  // Custom color picker with scrolling
  const customColorPicker = (config: any) => {
    return (
      <ScrollArea className="color-picker-wrapper max-h-60">
        <div className="rdw-colorpicker-modal">
          {config.children}
        </div>
      </ScrollArea>
    );
  };

  return (
    <div className={`w-full ${className}`}>
      {label && <Label className="mb-2 block">{label}</Label>}
      <Card className="p-0 overflow-hidden border rounded-md rich-text-editor-card">
        <Editor
          editorState={editorState}
          onEditorStateChange={handleEditorChange}
          wrapperClassName="w-full editor-wrapper"
          editorClassName={`px-3 py-2 editor-content overflow-auto`}
          toolbarClassName="border-0 border-b !bg-muted/30 editor-toolbar sticky top-0 z-10"
          placeholder={placeholder}
          toolbar={{
            options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'link', 'emoji', 'image', 'history'],
            inline: {
              options: ['bold', 'italic', 'underline', 'strikethrough', 'monospace', 'superscript', 'subscript'],
              className: 'inline-toolbar-item',
              inDropdown: false,
            },
            blockType: {
              options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'Blockquote', 'Code'],
              className: 'block-type-toolbar-item',
              dropdownClassName: 'block-type-dropdown',
              component: customDropdownRenderer,
            },
            fontSize: {
              options: [8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48, 60, 72, 96],
              className: 'font-size-toolbar-item',
              dropdownClassName: 'font-size-dropdown',
              component: customDropdownRenderer,
            },
            fontFamily: {
              options: ['Arial', 'Georgia', 'Impact', 'Tahoma', 'Times New Roman', 'Verdana', 'Courier New', 'Lucida Console'],
              className: 'font-family-toolbar-item',
              dropdownClassName: 'font-family-dropdown',
              component: customDropdownRenderer,
            },
            list: {
              options: ['unordered', 'ordered', 'indent', 'outdent'],
              className: 'list-toolbar-item',
            },
            textAlign: {
              options: ['left', 'center', 'right', 'justify'],
              className: 'text-align-toolbar-item',
            },
            colorPicker: {
              colors: [
                // Brand colors
                '#9b87f5', '#7E69AB', '#6E59A5', '#1A1F2C', '#D6BCFA',
                // Soft colors
                '#F2FCE2', '#FEF7CD', '#FEC6A1', '#E5DEFF', '#FFDEE2', '#FDE1D3', '#D3E4FD', '#F1F0FB',
                // Vivid colors
                '#8B5CF6', '#D946EF', '#F97316', '#0EA5E9', '#DC2626', '#16A34A', '#EAB308',
                // Neutral colors
                '#FFFFFF', '#F3F4F6', '#9CA3AF', '#4B5563', '#1F2937', '#111827', '#000000',
                // Additional colors
                '#059669', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#6366F1', '#EF4444'
              ],
              className: 'color-picker-toolbar-item',
              popupClassName: 'color-picker-popup',
              component: customColorPicker,
            },
            link: {
              options: ['link', 'unlink'],
              className: 'link-toolbar-item',
              popupClassName: 'link-popup',
              defaultTargetOption: '_blank',
              showOpenOptionOnHover: true,
            },
            emoji: {
              className: 'emoji-toolbar-item',
              popupClassName: 'emoji-popup',
              component: customEmojiPicker,
            },
            image: {
              className: 'image-toolbar-item',
              popupClassName: 'image-popup',
              urlEnabled: true,
              uploadEnabled: false,
              alignmentEnabled: true,
              defaultSize: {
                height: 'auto',
                width: 'auto',
              },
            },
          }}
          toolbarCustomButtons={[]}
          editorStyle={{
            minHeight: height,
            maxHeight: '500px',
            overflowY: 'auto',
            padding: '10px',
          }}
        />
      </Card>
    </div>
  );
};

export default RichTextEditor;
