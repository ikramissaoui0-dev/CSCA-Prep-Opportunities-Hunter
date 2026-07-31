import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const ROLE_LABEL: Record<string, string> = {
  student: "Student",
  admin: "Admin",
  content_manager: "Content Manager",
};

function initials(name: string | null) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  return (parts[0]?.[0] ?? "") + (parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "");
}

export function ProfileCard({
  fullName,
  avatarUrl,
  email,
  role,
}: {
  fullName: string | null;
  avatarUrl: string | null;
  email: string | undefined;
  role: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4">
        <Avatar className="size-12">
          {avatarUrl && <AvatarImage src={avatarUrl} alt={fullName ?? "Profile picture"} />}
          <AvatarFallback>{initials(fullName).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1 space-y-1">
          <p className="truncate font-medium">{fullName ?? "Add your name"}</p>
          <p className="truncate text-sm text-muted-foreground">{email}</p>
        </div>
        <Badge variant="secondary">{ROLE_LABEL[role] ?? role}</Badge>
      </CardContent>
    </Card>
  );
}
