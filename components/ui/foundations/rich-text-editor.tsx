"use client";

import React from "react";
import { EditorValue } from "react-rte";
import RTE from "react-rte";

// Define props
export interface RichTextEditorProps {
  value: EditorValue;
  onChange: (value: EditorValue) => void;
  placeholder?: string;
}

// No need to forward ref here
const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder,
}) => {
  return (
    <RTE
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
};

export default RichTextEditor;