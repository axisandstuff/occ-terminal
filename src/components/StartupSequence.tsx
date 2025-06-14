import React, { useEffect, useState } from "react";

const SEQUENCE = [
  "PhoenixBIOS 4.0 Release 6.0     Copyright 1985-1998 Phoenix Technologies Ltd.",
  "All Rights Reserved",
  "",
  "CPU: Intel® Pentium™ III 667 MHz",
  "RAM: 256MB OK",
  "Detecting IDE Drives ...",
  "  Primary Master: FUJITSU MHD2021AT 20GB",
  "  Primary Slave : None",
  "  Secondary Master: LITEON CD-ROM LTN301",
  "  Secondary Slave: None",
  "Keyboard.............Connected",
  "Mouse................Connected",
  "Initializing Display Adapter...OK",
  "Verifying DMI Pool Data ............ Success",
  "",
  "Starting Open Computing Club (OCC) Bootloader...",
  "",
  " ██████╗  ██████╗ ██████╗",
  "██╔═══██╗██╔════╝██╔════╝",
  "██║   ██║██║     ██║     ",
  "██║   ██║██║     ██║     ",
  "╚██████╔╝╚██████╗╚██████╗",
  " ╚═════╝  ╚═════╝ ╚═════╝",
  "",
  "[System OK] Boot sequence complete.",
  "",
];

const LINE_DELAY = 70; // ms per line

const ASCII_INDEX_START = SEQUENCE.findIndex(l => l.startsWith("██") || l.startsWith(" █"));
const ASCII_INDEX_END = SEQUENCE.findIndex(l => l.startsWith("[System OK]"));

interface Props {
  onComplete: () => void;
}

const StartupSequence: React.FC<Props> = ({ onComplete }) => {
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    let idx = 0;
    let timeout: number;
    function showNext() {
      setLines(seq => [...seq, SEQUENCE[idx]]);
      idx++;
      if (idx < SEQUENCE.length) {
        timeout = window.setTimeout(showNext, LINE_DELAY);
      } else {
        setTimeout(onComplete, 500);
      }
    }
    showNext();
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      className="font-mono font-jetbrains text-base sm:text-sm"
    >
      {lines.map((l, i) => {
        const isAscii =
          i >= ASCII_INDEX_START && i < ASCII_INDEX_END && l.trim().length > 0;
        if (isAscii) {
          // ASCII line: never wrap, allow horizontal scroll if needed
          return (
            <div
              key={i}
              className="overflow-x-auto whitespace-pre font-mono font-jetbrains text-base sm:text-sm"
              style={{
                color: "#BCE5F3",
                fontWeight: 400,
              }}
            >
              {l}
            </div>
          );
        }
        // Normal: wrap to viewport
        return (
          <div
            key={i}
            className="whitespace-pre-wrap break-words font-mono font-jetbrains text-base sm:text-sm"
            style={{
              color: "#BCE5F3",
              fontWeight: 400,
            }}
          >
            {l}
          </div>
        );
      })}
    </div>
  );
};

export default StartupSequence;
