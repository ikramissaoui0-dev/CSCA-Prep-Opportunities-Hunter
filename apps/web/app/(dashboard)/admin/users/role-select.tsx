"use client";

import { useState, useTransition } from "react";
import { USER_ROLES, type UserRole } from "@csca/types";
import { updateUserRole } from "./actions";

const ROLE_LABEL: Record<UserRole, string> = {
  student: "Student",
  admin: "Admin",
  content_manager: "Content Manager",
};

export function RoleSelect({ userId, role, isSelf }: { userId: string; role: UserRole; isSelf: boolean }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleChange(next: UserRole) {
    if (next === role) return;
    setError(null);
    startTransition(async () => {
      const result = await updateUserRole({ userId, role: next });
      if (!result.success) setError(result.message);
    });
  }

  if (isSelf) {
    return <span className="text-sm text-muted-foreground">{ROLE_LABEL[role]} (you)</span>;
  }

  return (
    <div className="space-y-1">
      <select
        value={role}
        disabled={isPending}
        onChange={(e) => handleChange(e.target.value as UserRole)}
        className="h-8 rounded-md border border-input bg-background px-2 text-sm disabled:opacity-50"
      >
        {USER_ROLES.map((r) => (
          <option key={r} value={r}>
            {ROLE_LABEL[r]}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
