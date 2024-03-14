"use client"
import { useState } from "react";
export default function ({ copyText }: { copyText: string }) {
    const [isCopied, setIsCopied] = useState(false);
    const copy = () => {
      navigator.clipboard.writeText(copyText);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 1000);
    }
    
    return (
        <button onClick={copy} className="w-full place-content-center border-2 px-4 py-4 rounded-lg bg-black/10 hover:bg-black/20 pl-1 gap-1 hover:scale-[1.02] transition-all col-span-2 flex place-items-center ">
        {!isCopied ?
          <svg className="size-9" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
	<g fill="none" stroke="currentColor">
		<rect width="9" height="13" x="6.5" y="6.5" rx="1.5" />
		<path d="M8.5 6A1.5 1.5 0 0 1 10 4.5h6A1.5 1.5 0 0 1 17.5 6v10a1.5 1.5 0 0 1-1.5 1.5" />
	</g>
</svg>      :
<svg className="size-9" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24">
	<path fill="currentColor" d="m10 15.586l-3.293-3.293l-1.414 1.414L10 18.414l9.707-9.707l-1.414-1.414z" />
</svg>        }
{!isCopied ?
 copyText
 : "Copied!"}
      </button>

    );
  }
  