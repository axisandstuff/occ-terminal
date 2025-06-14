
import React, { useEffect, useState } from "react";

// Simulate a vintage boot sequence: motherboard, RAM, CPU detection, disks, BIOS dates...
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

const LINE_DELAY = 70; // ms per line for fast, smooth boot-up

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
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      {lines.map((l, i) => (
        <div key={i} className="whitespace-pre">{l}</div>
      ))}
    </div>
  );
};

export default StartupSequence;
