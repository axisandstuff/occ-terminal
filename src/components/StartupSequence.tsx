
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
  "   ______  _______  _______",
  "  (  ___ \\(  ____ \\(  ___  )",
  "  | (   ) ) (    \\/| (   ) |",
  "  | (__/ /| (__    | |   | |",
  "  |  __ ( |  __)   | |   | |",
  "  | (  \\ \\| (      | |   | |",
  "  | )___) ) (____/\\| (___) |",
  "  |/ \\___/(_______/(_______)",
  "",
  "[System OK] Boot sequence complete.",
  "",
];

const LINE_DELAY = 70; // ms per line

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
    <div className="mx-0 sm:mx-[-1rem] xs:mx-[-0.5rem]">
      {lines.map((l, i) => (
        <div key={i} className="whitespace-pre-wrap sm:whitespace-pre-line break-words">
          {l}
        </div>
      ))}
    </div>
  );
};

export default StartupSequence;
