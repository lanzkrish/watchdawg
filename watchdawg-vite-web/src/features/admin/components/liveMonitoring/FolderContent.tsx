/** @format */

import EmployeeLiveCard from "./EmployeeLiveCard";

export default function FolderContent({ users }: any) {
  return (
    <div className="border-t border-white/10 divide-y divide-white/5">
      {users.map((u: any) => (
        <EmployeeLiveCard key={u.userId} user={u} />
      ))}
    </div>
  );
}
