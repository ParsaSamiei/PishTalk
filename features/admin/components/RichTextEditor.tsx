"use client";

import * as React from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import LinkExtension from "@tiptap/extension-link";
import ImageExtension from "@tiptap/extension-image";
import DOMPurify from "isomorphic-dompurify";
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
  Code2,
} from "lucide-react";

import { cn } from "@/lib/utils";

interface ToolbarButtonProps {
  readonly onClick: () => void;
  readonly active?: boolean;
  readonly disabled?: boolean;
  readonly label: string;
  readonly children: React.ReactNode;
}

function ToolbarButton({
  onClick,
  active,
  disabled,
  label,
  children,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-pressed={active}
      className={cn(
        "flex size-9 items-center justify-center rounded-[var(--radius-button)] text-text-secondary transition-colors hover:bg-surface-secondary hover:text-text-primary",
        active && "bg-accent/15 text-accent-hover",
        disabled && "pointer-events-none opacity-40",
      )}
    >
      {children}
    </button>
  );
}

interface ToolbarProps {
  readonly editor: Editor;
  readonly isSourceMode: boolean;
  readonly onToggleSourceMode: () => void;
}

function Toolbar({ editor, isSourceMode, onToggleSourceMode }: ToolbarProps) {
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
        disabled={isSourceMode}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="size-4" aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton
        label="مورب"
        active={editor.isActive("italic")}
        disabled={isSourceMode}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="size-4" aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton
        label="تیتر بزرگ"
        active={editor.isActive("heading", { level: 2 })}
        disabled={isSourceMode}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 className="size-4" aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton
        label="تیتر کوچک"
        active={editor.isActive("heading", { level: 3 })}
        disabled={isSourceMode}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <Heading3 className="size-4" aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton
        label="لیست نقطه‌ای"
        active={editor.isActive("bulletList")}
        disabled={isSourceMode}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="size-4" aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton
        label="لیست شماره‌دار"
        active={editor.isActive("orderedList")}
        disabled={isSourceMode}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="size-4" aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton
        label="نقل قول"
        active={editor.isActive("blockquote")}
        disabled={isSourceMode}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote className="size-4" aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton
        label="افزودن لینک"
        active={editor.isActive("link")}
        disabled={isSourceMode}
        onClick={handleAddLink}
      >
        <Link2 className="size-4" aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton
        label="افزودن تصویر"
        disabled={isSourceMode}
        onClick={handleAddImage}
      >
        <ImageIcon className="size-4" aria-hidden="true" />
      </ToolbarButton>
      <div className="mx-1 h-6 w-px bg-border" />
      <ToolbarButton
        label="بازگردانی"
        disabled={isSourceMode}
        onClick={() => editor.chain().focus().undo().run()}
      >
        <Undo className="size-4" aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton
        label="انجام مجدد"
        disabled={isSourceMode}
        onClick={() => editor.chain().focus().redo().run()}
      >
        <Redo className="size-4" aria-hidden="true" />
      </ToolbarButton>
      <div className="mx-1 h-6 w-px bg-border" />
      <ToolbarButton
        label={isSourceMode ? "بازگشت به ویرایشگر" : "ویرایش کد HTML"}
        active={isSourceMode}
        onClick={onToggleSourceMode}
      >
        <Code2 className="size-4" aria-hidden="true" />
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
 * WYSIWYG blog content editor (docs/07_ADMIN_PANEL.md: "Rich Text Editor"),
 * with an optional raw-HTML source view for admins who need markup the
 * toolbar doesn't expose (e.g. an embed).
 *
 * The single source of truth for what's actually allowed to reach the
 * database is still `DOMPurify.sanitize(values.content)` in blogActions.ts
 * — that runs regardless of which UI produced the value. The sanitize
 * call here is defense-in-depth so a stray <script>/event-handler pasted
 * into the source view can't do anything in the admin's own browser when
 * it's fed back into the live editor.
 */
function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const [isSourceMode, setIsSourceMode] = React.useState(false);
  const [htmlDraft, setHtmlDraft] = React.useState(value);

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

  function handleToggleSourceMode() {
    if (!editor) return;

    if (isSourceMode) {
      // Leaving source mode: push the edited HTML back into the live
      // editor, sanitizing first so nothing unsafe ever renders in the
      // admin's own browser.
      const clean = DOMPurify.sanitize(htmlDraft);
      editor.commands.setContent(clean);
      onChange(clean);
      setIsSourceMode(false);
    } else {
      // Entering source mode: seed the textarea with the editor's
      // current HTML.
      setHtmlDraft(editor.getHTML());
      setIsSourceMode(true);
    }
  }

  function handleDraftChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    const html = event.target.value;
    setHtmlDraft(html);
    // Keep the form field in sync as the admin types. Final sanitization
    // still happens server-side on save either way.
    onChange(html);
  }

  return (
    <div className="overflow-hidden rounded-[var(--radius-input)] border border-border bg-surface">
      <Toolbar
        editor={editor}
        isSourceMode={isSourceMode}
        onToggleSourceMode={handleToggleSourceMode}
      />
      {isSourceMode ? (
        <textarea
          value={htmlDraft}
          onChange={handleDraftChange}
          dir="ltr"
          spellCheck={false}
          className="min-h-64 w-full resize-y bg-surface px-4 py-3 font-mono text-sm text-text-primary focus:outline-none"
          aria-label="کد HTML"
        />
      ) : (
        <EditorContent editor={editor} dir="rtl" />
      )}
    </div>
  );
}

export { RichTextEditor };
