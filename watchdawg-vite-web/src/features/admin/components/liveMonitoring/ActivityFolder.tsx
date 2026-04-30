/** @format */

import { useState } from "react";
import FolderContent from "./FolderContent";
import FolderHeader from "./FolderHeader";

export default function ActivityFolder({ name, users }: any) {
  const [open, setOpen] = useState(true);

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">

      <FolderHeader
        name={name}
        count={users.length}
        onClick={() => setOpen(!open)}
      />

      {open && <FolderContent users={users} />}
    </div>
  );
}
