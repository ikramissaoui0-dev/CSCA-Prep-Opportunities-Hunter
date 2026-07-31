-- Phase 2 — notifications schema. Rows are created by application logic
-- (achievement earned, exam result ready, subscription renewed, AI
-- recommendation ready, ...) via the service-role client; a user may only
-- read their own and mark them read.

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  channel text not null,
  type text not null,
  title text not null,
  body text,
  -- Structured data for deep-linking, e.g. { "session_id": "..." }.
  payload jsonb not null default '{}',
  is_read boolean not null default false,
  sent_at timestamptz,
  read_at timestamptz,
  created_at timestamptz not null default now(),
  constraint notifications_channel_allowed check (channel in ('email', 'in_app')),
  constraint notifications_type_known check (
    type in (
      'achievement_earned', 'exam_result_ready', 'subscription_renewed', 'subscription_past_due',
      'ai_recommendation_ready', 'daily_challenge_available'
    )
  )
);

create index idx_notifications_user_created on public.notifications (user_id, created_at desc);
create index idx_notifications_unread on public.notifications (user_id) where is_read = false;

alter table public.notifications enable row level security;

create policy "notifications_owner_read" on public.notifications
  for select to authenticated
  using (user_id = (select auth.uid()));

create policy "notifications_owner_update" on public.notifications
  for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

revoke update on public.notifications from authenticated;
grant update (is_read, read_at) on public.notifications to authenticated;
