import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/auth/session";
import { getBillingOverview } from "@/server/queries/billing";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ManageBillingButton } from "./billing-actions";

export const metadata: Metadata = { title: "Billing — CSCA Prep" };

const PLAN_LABEL: Record<string, string> = { free: "Free", premium: "Premium", premium_plus: "Premium+" };

function formatUsd(cents: number): string {
  return `$${(cents / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default async function BillingPage() {
  const user = await requireUser();
  const billing = await getBillingOverview(user.id, user.role);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Billing</h1>
        <p className="text-muted-foreground">Your plan, usage, and payment history.</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div>
            <CardDescription>Current plan</CardDescription>
            <CardTitle className="text-2xl">{PLAN_LABEL[billing.planTier]}</CardTitle>
          </div>
          {billing.subscription && <ManageBillingButton />}
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          {billing.planTier === "free" && (
            <p>
              Your free account includes one practice series per subject and the daily challenge. Past exam papers and
              full practice access require Premium.
            </p>
          )}
          {billing.subscription && (
            <p>
              Status: {billing.subscription.status}
              {billing.subscription.cancelAtPeriodEnd
                ? ` — cancels on ${billing.subscription.currentPeriodEnd.toLocaleDateString()}`
                : ` — renews on ${billing.subscription.currentPeriodEnd.toLocaleDateString()}`}
            </p>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Free</CardTitle>
            <CardDescription>Get started</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              <li>One practice series per subject</li>
              <li>Daily challenge</li>
              <li>Basic results after each exam</li>
            </ul>
            {billing.planTier === "free" && <Badge variant="secondary">Current plan</Badge>}
          </CardContent>
        </Card>

        <Card className={billing.planTier === "premium" ? "border-primary" : undefined}>
          <CardHeader>
            <CardTitle className="text-base">Premium</CardTitle>
            <CardDescription>For serious prep</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              <li>Every practice series, unlimited</li>
              <li>Past exam papers</li>
              <li>Detailed explanations & recommendations</li>
              <li>Advanced statistics & progress tracking</li>
            </ul>
            {billing.planTier === "premium" ? (
              <Badge variant="secondary">Current plan</Badge>
            ) : billing.planTier === "premium_plus" ? (
              <Badge variant="secondary">Included in your plan</Badge>
            ) : (
              <Button className="w-full" variant="outline" nativeButton={false} render={<Link href="/contact">Contact us to upgrade</Link>} />
            )}
          </CardContent>
        </Card>

        <Card className={billing.planTier === "premium_plus" ? "border-primary" : undefined}>
          <CardHeader>
            <CardTitle className="text-base">Premium+</CardTitle>
            <CardDescription>Everything, plus courses</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              <li>Everything in Premium</li>
              <li>Full course library access</li>
            </ul>
            {billing.planTier === "premium_plus" ? (
              <Badge variant="secondary">Current plan</Badge>
            ) : (
              <Button className="w-full" variant="outline" nativeButton={false} render={<Link href="/contact">Contact us to upgrade</Link>} />
            )}
          </CardContent>
        </Card>
      </div>
      <p className="text-sm text-muted-foreground">
        Paid access is granted by our team, not by checkout on this site — reach out and we'll set you up.
      </p>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Payment history</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {billing.payments.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground">No payments yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs text-muted-foreground">
                    <th className="p-3 font-medium">Date</th>
                    <th className="p-3 font-medium">Description</th>
                    <th className="p-3 font-medium">Amount</th>
                    <th className="p-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {billing.payments.map((p) => (
                    <tr key={p.id} className="border-b last:border-0">
                      <td className="p-3 text-muted-foreground">{p.createdAt.toLocaleDateString()}</td>
                      <td className="p-3">{p.description ?? "—"}</td>
                      <td className="p-3 tabular-nums">{formatUsd(p.amountCents)}</td>
                      <td className="p-3">
                        <Badge variant={p.status === "succeeded" ? "default" : "secondary"}>{p.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
