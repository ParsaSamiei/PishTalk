"use client";

import * as React from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import LinkExtension from "@tiptap/extension-link";
import ImageExtension from "@tiptap/extension-image";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Link2,
  Image as ImageIcon,
  Undo,
  Redo,
  Heading2,
  Heading3,
} from "lucide-react";

import { cn } from "@/lib/utils";

interface ToolbarButtonProps {
  readonly onClick: () => void;
  readonly active?: boolean;
  readonly label: string;
  readonly children: React.ReactNode;
}

function ToolbarButton({ onClick, active, label, children }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={cn(
        "flex size-9 items-center justify-center rounded-[var(--radius-button)] text-text-secondary transition-colors hover:bg-surface-secondary hover:text-text-primary",
        active && "bg-accent/15 text-accent-hover"
      )}
    >
      {children}
    </button>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  function handleAddLink() {
    const url = window.prompt("آدرس لینک را وارد کنید:");
    if (!url) return;
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  function handleAddImage() {
    const url = window.prompt("آدرس تصویر را وارد کنید:");
    if (!url) return;
    editor.chain().focus().setImage({ src: url }).run();
  }

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-border p-2">
      <ToolbarButton
        label="ضخیم"
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="size-4" aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton
        label="مورب"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="size-4" aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton
        label="تیتر بزرگ"
        active={editor.isActive("heading", { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 className="size-4" aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton
        label="تیتر کوچک"
        active={editor.isActive("heading", { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <Heading3 className="size-4" aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton
        label="لیست نقطه‌ای"
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="size-4" aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton
        label="لیست شماره‌دار"
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="size-4" aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton
        label="نقل قول"
        active={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote className="size-4" aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton label="افزودن لینک" active={editor.isActive("link")} onClick={handleAddLink}>
        <Link2 className="size-4" aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton label="افزودن تصویر" onClick={handleAddImage}>
        <ImageIcon className="size-4" aria-hidden="true" />
      </ToolbarButton>
      <div className="mx-1 h-6 w-px bg-border" />
      <ToolbarButton
        label="بازگردانی"
        onClick={() => editor.chain().focus().undo().run()}
      >
        <Undo className="size-4" aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton label="انجام مجدد" onClick={() => editor.chain().focus().redo().run()}>
        <Redo className="size-4" aria-hidden="true" />
      </ToolbarButton>
    </div>
  );
}

interface RichTextEditorProps {
  readonly value: string;
  readonly onChange: (html: string) => void;
  readonly placeholder?: string;
}

/**
 * WYSIWYG blog content editor (docs/07_ADMIN_PANEL.md: "Rich Text Editor").
 * Outputs sanitized-on-save HTML — see sanitizeHtml() used in blogActions.ts.
 */
function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      LinkExtension.configure({ openOnClick: false, autolink: true }),
      ImageExtension,
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          "prose prose-slate max-w-none min-h-64 px-4 py-3 focus:outline-none prose-headings:text-text-primary prose-p:text-text-secondary prose-a:text-accent-hover",
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.getHTML());
    },
  });

  if (!editor) {
    return (
      <div className="min-h-64 animate-pulse rounded-[var(--radius-input)] border border-border bg-surface-secondary" />
    );
  }

  return (
    <div className="overflow-hidden rounded-[var(--radius-input)] border border-border bg-surface">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} dir="rtl" />
    </div>
  );
}

export { RichTextEditor };
