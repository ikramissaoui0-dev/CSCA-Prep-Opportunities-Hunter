export function WelcomeHeader({ fullName }: { fullName: string | null }) {
  const firstName = fullName?.trim().split(" ")[0];

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">{firstName ? `Welcome back, ${firstName}` : "Welcome back"}</h1>
      <p className="text-muted-foreground">Here&apos;s how your CSCA prep is going.</p>
    </div>
  );
}
