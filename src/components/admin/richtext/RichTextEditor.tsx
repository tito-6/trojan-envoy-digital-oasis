
import React, { useState } from 'react';
import { EditorState, ContentState, convertToRaw, convertFromRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import './rich-text-editor.css';

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

  // Custom link modal with improved styling
  const customLinkModal = (config: any) => {
    return (
      <Dialog>
        <DialogContent className="rdw-link-modal bg-background p-4 rounded-md">
          {config.children}
        </DialogContent>
      </Dialog>
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
            options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'link', 'emoji', 'history'],
            inline: {
              options: ['bold', 'italic', 'underline', 'strikethrough', 'monospace'],
              className: 'inline-toolbar-item',
            },
            blockType: {
              options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'Blockquote'],
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
              options: ['Arial', 'Georgia', 'Impact', 'Tahoma', 'Times New Roman', 'Verdana'],
              className: 'font-family-toolbar-item',
              dropdownClassName: 'font-family-dropdown',
              component: customDropdownRenderer,
            },
            textAlign: {
              options: ['left', 'center', 'right', 'justify'],
              className: 'text-align-toolbar-item',
            },
            colorPicker: {
              colors: ['rgb(97,189,109)', 'rgb(26,188,156)', 'rgb(84,172,210)', 'rgb(44,130,201)', 
                      'rgb(147,101,184)', 'rgb(71,85,119)', 'rgb(204,204,204)', 'rgb(65,168,95)', 
                      'rgb(0,168,133)', 'rgb(61,142,185)', 'rgb(41,105,176)', 'rgb(85,57,130)', 
                      'rgb(40,50,78)', 'rgb(0,0,0)', 'rgb(247,218,100)', 'rgb(251,160,38)', 
                      'rgb(235,107,86)', 'rgb(226,80,65)', 'rgb(163,143,132)', 'rgb(239,239,239)', 
                      'rgb(255,255,255)', 'rgb(250,197,28)', 'rgb(243,121,52)', 'rgb(209,72,65)', 
                      'rgb(184,49,47)', 'rgb(124,112,107)', 'rgb(209,213,216)'],
              className: 'color-picker-toolbar-item',
              popupClassName: 'color-picker-popup',
              component: customColorPicker,
            },
            emoji: {
              className: 'emoji-toolbar-item',
              popupClassName: 'emoji-popup',
              component: customEmojiPicker,
            },
            link: {
              className: 'link-toolbar-item',
              popupClassName: 'link-popup',
              component: customLinkModal,
              defaultTargetOption: '_blank',
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
