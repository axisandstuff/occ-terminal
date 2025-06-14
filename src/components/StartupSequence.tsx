
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
    <div className="mx-0 sm:mx-[-1rem] xs:mx-[-0.5rem] font-mono font-jetbrains text-base sm:text-sm">
      {lines.map((l, i) => {
        const isAscii =
          i >= ASCII_INDEX_START && i < ASCII_INDEX_END && l.trim().length > 0;
        // Mark bootloader and ascii as monospace-heavy with weight,
        // all others just monospace and appropriate color.
        const isBootloaderSection =
          i >= SEQUENCE.findIndex(x => x.includes("Bootloader")) &&
          i <= ASCII_INDEX_END;
        return (
          <div
            key={i}
            className={
              `whitespace-pre` +
              (isAscii
                ? " font-jetbrains leading-none text-green-400"
                : isBootloaderSection
                  ? " font-jetbrains text-green-300"
                  : " text-green-200"
              )
            }
            style={isAscii || isBootloaderSection
              ? { fontWeight: 700 }
              : { fontWeight: 400 }
            }
          >
            {l}
          </div>
        );
      })}
    </div>
  );
};

export default StartupSequence;
