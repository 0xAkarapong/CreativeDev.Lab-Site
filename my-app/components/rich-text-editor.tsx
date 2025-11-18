"use client";

import { useCallback, useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const toolbarActions = [
  { label: "Bold", command: "bold" },
  { label: "Italic", command: "italic" },
  { label: "Underline", command: "underline" },
  { label: "Link", command: "createLink" },
  { label: "Ordered list", command: "insertOrderedList" },
  { label: "Bullet list", command: "insertUnorderedList" },
];

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handleCommand = useCallback((command: string) => {
    editorRef.current?.focus();
    if (command === "createLink") {
      const url = prompt("Enter URL");
      if (url) {
        document.execCommand(command, false, url);
      }
      return;
    }
    document.execCommand(command);
  }, []);

  const handleInput = () => {
    onChange(editorRef.current?.innerHTML ?? "");
  };

  return (
    <div className="border rounded-2xl">
      <div className="flex flex-wrap gap-2 border-b p-2">
        {toolbarActions.map((action) => (
          <Button
            key={action.label}
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleCommand(action.command)}
          >
            {action.label}
          </Button>
        ))}
      </div>
      <div
        ref={editorRef}
        className="rich-text-input min-h-[280px] p-4 text-sm"
        contentEditable
        onInput={handleInput}
        data-placeholder="Write your article content..."
      />
    </div>
  );
}
