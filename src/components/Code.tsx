import React from 'react';
import { useClipboard } from 'src/hooks/useClipboard';

interface Props {
  code: string;
}

export default function Code({ code }: Props) {
  const { copy } = useClipboard();
  const formattedCode = addReadabilitySpaces(code);

  function addReadabilitySpaces(value: string) {
    return value.replace(/(.{3})/g, '$1 ').trim();
  }


  function handleCopy() {
    copy(code);
  }

  return (
    <div onClick={handleCopy}>
      {formattedCode}
    </div>
  );
}