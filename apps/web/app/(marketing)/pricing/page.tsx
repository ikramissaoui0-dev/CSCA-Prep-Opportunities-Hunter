import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Pricing — CSCA Prep",
  description: "Simple, transparent pricing for CSCA Prep — start free, contact us to unlock unlimited mock exams, detailed explanations, and full course access.",
  alternates: { canonical: "/pricing" },
};

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-10 px-6 py-16">
      <div className="text-center">
        <h1 className="text-3xl font-semibold tracking-tight">Simple, transparent pricing</h1>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Start for free — no credit card required. When you&apos;re ready for full access, our team sets it up for you
          directly.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Free</CardTitle>
            <CardDescription>Get started</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-3xl font-semibold">$0</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>One practice series per subject</li>
              <li>Daily challenge</li>
              <li>Basic results after each exam</li>
            </ul>
            <Button className="w-full" variant="outline" nativeButton={false} render={<Link href="/register">Start free</Link>} />
          </CardContent>
        </Card>

        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="text-lg">Premium</CardTitle>
            <CardDescription>For serious prep</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-3xl font-semibold">Contact us</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Every practice series, unlimited</li>
              <li>Past exam papers</li>
              <li>Detailed explanations &amp; recommendations</li>
              <li>Advanced statistics &amp; progress tracking</li>
            </ul>
            <Button className="w-full" nativeButton={false} render={<Link href="/contact">Contact us</Link>} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Premium+</CardTitle>
            <CardDescription>Everything, plus courses</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-3xl font-semibold">Contact us</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Everything in Premium</li>
              <li>Full course library access</li>
            </ul>
            <Button className="w-full" variant="outline" nativeButton={false} render={<Link href="/contact">Contact us</Link>} />
          </CardContent>
        </Card>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Paid access is granted directly by our team — register for free, then contact us to activate Premium or
        Premium+.
      </p>
    </div>
  );
}
