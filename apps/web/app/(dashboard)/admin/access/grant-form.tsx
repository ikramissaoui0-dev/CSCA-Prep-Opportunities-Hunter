"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { grantAccess, updateAccessGrant } from "./actions";
import type { GrantedTierInput, ExpirationOptionInput } from "@/lib/validation/access-grants";
import type { AccessGrantRow } from "@/server/queries/admin-access-grants";

const EXPIRATION_LABEL: Record<ExpirationOptionInput, string> = {
  "7d": "7 days",
  "30d": "30 days",
  "3m": "3 months",
  "6m": "6 months",
  "12m": "12 months",
  permanent: "Permanent",
  custom: "Custom date",
};

export function GrantAccessForm({
  trigger,
  existingGrant,
}: {
  trigger: React.ReactElement;
  /** Present when editing an already-granted student's row — email is
   * fixed and the underlying action updates by id instead of upserting
   * by email. */
  existingGrant?: AccessGrantRow;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [email, setEmail] = useState(existingGrant?.email ?? "");
  const [grantedTier, setGrantedTier] = useState<GrantedTierInput>(existingGrant?.grantedTier ?? "premium_plus");
  const [expirationOption, setExpirationOption] = useState<ExpirationOptionInput>("12m");
  const [customExpiresAt, setCustomExpiresAt] = useState("");
  const [adminNote, setAdminNote] = useState(existingGrant?.adminNote ?? "");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = existingGrant
        ? await updateAccessGrant({
            grantId: existingGrant.id,
            grantedTier,
            expirationOption,
            customExpiresAt: expirationOption === "custom" ? new Date(customExpiresAt).toISOString() : undefined,
            adminNote,
          })
        : await grantAccess({
            email,
            grantedTier,
            expirationOption,
            customExpiresAt: expirationOption === "custom" ? new Date(customExpiresAt).toISOString() : undefined,
            adminNote,
          });

      if (!result.success) {
        setError(result.message);
        return;
      }
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>{existingGrant ? "Edit free access" : "Grant free access"}</DialogTitle>
            <DialogDescription>
              {existingGrant
                ? "Change this student's plan, expiration, or note."
                : "Gives this email the same permissions as a paying subscriber — no charge, no Stripe subscription created."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-1.5">
            <Label htmlFor="email">Student email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={!!existingGrant}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="grantedTier">Access level</Label>
            <select
              id="grantedTier"
              value={grantedTier}
              onChange={(e) => setGrantedTier(e.target.value as GrantedTierInput)}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="premium">Premium</option>
              <option value="premium_plus">Premium+</option>
            </select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="expirationOption">Duration</Label>
              <select
                id="expirationOption"
                value={expirationOption}
                onChange={(e) => setExpirationOption(e.target.value as ExpirationOptionInput)}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                {(Object.keys(EXPIRATION_LABEL) as ExpirationOptionInput[]).map((opt) => (
                  <option key={opt} value={opt}>
                    {EXPIRATION_LABEL[opt]}
                  </option>
                ))}
              </select>
            </div>
            {expirationOption === "custom" && (
              <div className="space-y-1.5">
                <Label htmlFor="customExpiresAt">Expiration date</Label>
                <Input
                  id="customExpiresAt"
                  type="date"
                  value={customExpiresAt}
                  onChange={(e) => setCustomExpiresAt(e.target.value)}
                  required
                />
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="adminNote">Internal note (students never see this)</Label>
            <textarea
              id="adminNote"
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              rows={2}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>

          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving…" : existingGrant ? "Save changes" : "Grant access"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
