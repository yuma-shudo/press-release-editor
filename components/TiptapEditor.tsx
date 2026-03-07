'use client';

import { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

export default function TiptapEditor({ onChange, content }: { onChange?: (content: string) => void, content?: string }) {
  const [, forceUpdate] = useState(0);

  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>ここに本文を書いてください</p>',
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      forceUpdate(n => n + 1);
      onChange?.(editor.getHTML());
    },
    onSelectionUpdate: () => forceUpdate(n => n + 1),
    onTransaction: () => forceUpdate(n => n + 1),
  });

  useEffect(() => {
    if (editor && content && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) return null;

  return (
    <div style={{ border: '1px solid #ccc', borderRadius: '8px', overflow: 'hidden' }}>
      <div style={{ borderBottom: '1px solid #ccc', padding: '8px', display: 'flex', gap: '8px' }}>
        {[
          { label: '太字', action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive('bold') },
          { label: '斜体', action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive('italic') },
          { label: '見出し1', action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), active: editor.isActive('heading', { level: 1 }) },
          { label: '見出し2', action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive('heading', { level: 2 }) },
          { label: 'リスト', action: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive('bulletList') },
        ].map(({ label, action, active }) => (
          <button
            key={label}
            onClick={action}
            style={{
              padding: '4px 12px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              cursor: 'pointer',
              backgroundColor: active ? '#3b82f6' : '#ffffff',
              color: active ? '#ffffff' : '#000000',
              fontWeight: active ? 'bold' : 'normal',
            }}
          >
            {label}
          </button>
        ))}
      </div>
      <div style={{ padding: '16px' }}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}