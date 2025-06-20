
import React, { useState, useRef, useEffect } from "react";
import StartupSequence from "./StartupSequence";

const OCC_ASCII = [
  " ██████╗  ██████╗ ██████╗",
  "██╔═══██╗██╔════╝██╔════╝",
  "██║   ██║██║     ██║     ",
  "██║   ██║██║     ██║     ",
  "╚██████╔╝╚██████╗╚██████╗",
  " ╚═════╝  ╚═════╝ ╚═════╝",
  "                         ",
];

const INIT_PROMPTS = [
  "Welcome to the Open Computing Club's terminal! Here you can find information about our club in a simple way.",
  'Do you have any new ideas that you\'d like to tell us? Type "ideas" and it will take you to a form!',
  "",
  'If you find that the terminal is too cluttered, please refresh the page by typing "clear".',
  "",
  'Type "help" for more commands.'
];

const COMMANDS: { [key: string]: string[] | ((args: string[]) => string[]) } = {
  about: [
    "Open Computing Club (OCC) at UTP is a student group dedicated to collaborative exploration of technology.",
    "We host workshops, events, and innovative Special Interest Groups (SIGs) for all levels.",
    "Type 'SIG' to learn more about our SIGs or 'help' for additional commands.",
  ],
  help: [
    "Available commands:",
    "- about: Learn about OCC and our purpose.",
    "- help: Show this help message.",
    "- SIG: Information about our Special Interest Groups.",
    '- ideas: Suggest new ideas (opens form).',
    '- clear: Refreshes and clears the terminal.',
  ],
  sig: [
    "Our SIGs (Special Interest Groups) include:",
    "Axis, a group that researches or does anything that interests them.",
    "and stay tuned for more SIGs coming soon!",
  ],
};

const TERMINAL_PREFIX = "occ@axis:~$";

function scrollToBottom(container: HTMLDivElement | null) {
  if (container) {
    container.scrollTop = container.scrollHeight;
  }
}

const Terminal: React.FC = () => {
  const [bootDone, setBootDone] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (bootDone) {
      setTimeout(() => {
        setHistory((h) => [
          ...h,
          ...OCC_ASCII,
          "",
          ...INIT_PROMPTS,
        ]);
      }, 300);
    }
  }, [bootDone]);

  useEffect(() => {
    scrollToBottom(containerRef.current);
  }, [history, bootDone]);

  // Focus input when clicking terminal
  useEffect(() => {
    const on = (e: MouseEvent) => {
      if (containerRef.current && e.target && (containerRef.current as any).contains(e.target)) {
        inputRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", on);
    return () => document.removeEventListener("mousedown", on);
  }, []);

  const handleCommand = (cmd: string) => {
    const lcmd = cmd.trim().toLowerCase();
    let output: string[] = [];
    if (lcmd === "") return;
    if (lcmd === "clear") {
      setTimeout(() => window.location.reload(), 100);
      return;
    }
    if (lcmd === "ideas") {
      window.open(
        "https://docs.google.com/forms/d/e/1FAIpQLScZK27Pl2Z0r-2MGL3kav-i_Yfy0viJMJWasWQDbsvLvmkpqg/viewform?usp=sharing&ouid=112079072938694704514",
        "_blank"
      );
      output = ["Opening ideas form in a new tab..."];
    }
    if (lcmd === "website") {
      window.open(
        "https://occ-official.vercel.app/",
        "_blank"
      );
      output = ["Opening website in a new tab..."];
    }
     else if (COMMANDS[lcmd]) {
      const result = COMMANDS[lcmd];
      output = typeof result === "function" ? result([]) : result;
    } else {
      output = [`Command not found: ${lcmd}. Type 'help' for a list of commands.`];
    }
    // Clear existing history, show just the prompt and output
    setHistory([`${TERMINAL_PREFIX} ${cmd}`, ...output, ""]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isProcessing) return;
    if (e.key === "Enter") {
      setIsProcessing(true);
      handleCommand(input);
      setInput("");
      setTimeout(() => setIsProcessing(false), 100);
    }
  };

  if (!bootDone) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-black select-none text-[16px] sm:text-[14px] xs:text-[13px] p-0 m-0">
        <div className="w-full max-w-4xl mx-auto rounded overflow-hidden shadow-lg bg-black p-0">
          <div className="font-mono text-green-400 text-base p-4 min-h-[70vh] sm:p-2 sm:text-[13px] xs:text-[12px]" style={{ wordBreak: 'break-word' }}>
            <StartupSequence onComplete={() => setBootDone(true)} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="h-screen w-full overflow-hidden bg-black font-mono touch-none"
      onClick={() => inputRef.current?.focus()}
      style={{ WebkitTapHighlightColor: "transparent", userSelect: "none" }}
    >
      <div
        ref={containerRef}
        className="h-full w-full px-2 py-4 sm:px-1 sm:py-2 overflow-y-auto font-mono font-jetbrains text-base sm:text-sm xs:text-xs selection:bg-green-800/50"
        style={{
          color: "#BCE5F3",
          fontFamily: "JetBrains Mono, Fira Mono, Menlo, monospace",
          textShadow: "0 0 4px #00FF41, 0 0 2px #33FF66",
          wordBreak: "break-word",
        }}
      >
        {history.map((line, idx) => {
          // OCC ASCII art should not wrap (overflow-x for monospace art lines), everything else wraps
          const isAscii = idx < OCC_ASCII.length && OCC_ASCII.some(asciiLine => asciiLine.trim() === line.trim());
          if (isAscii && line.trim().length > 0) {
            return (
              <div
                key={idx}
                className="overflow-x-auto whitespace-pre font-mono font-jetbrains text-base sm:text-sm"
                style={{
                  color: "#BCE5F3",
                  fontWeight: 400,
                }}
              >
                {line}
              </div>
            );
          }
          return (
            <div
              key={idx}
              className="whitespace-pre-wrap break-words font-mono font-jetbrains text-base sm:text-sm"
              style={{
                color: "#BCE5F3",
                fontWeight: 400,
              }}
            >
              {line}
            </div>
          );
        })}
        <div className="flex items-center w-full py-1 gap-1 sm:gap-0">
          <span className="min-w-fit font-mono font-jetbrains text-base sm:text-sm" style={{ color: "#BCE5F3" }}>{TERMINAL_PREFIX}&nbsp;</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            className="bg-transparent border-none outline-none flex-1 font-mono font-jetbrains text-base sm:text-sm caret-[#BCE5F3] py-2 px-2 sm:py-3 sm:px-2 rounded focus:ring-2"
            spellCheck={false}
            style={{
              width: '100%',
              minHeight: 40,
              maxHeight: 52,
              color: "#BCE5F3",
              textShadow: "0 0 2px #00FF41, 0 0 4px #33FF66",
              WebkitTapHighlightColor: "transparent",
              fontWeight: 400,
            }}
            inputMode="text"
          />
          <span className="ml-1 animate-pulse select-none sm:ml-0 font-mono font-jetbrains text-base sm:text-sm" style={{ color: "#BCE5F3" }}>█</span>
        </div>
      </div>
    </div>
  );
};

export default Terminal;

