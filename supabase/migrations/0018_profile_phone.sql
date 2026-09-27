-- Phone number, required at registration (enforced app-side in
-- lib/validation/auth.ts's signUpSchema — this column stays nullable
-- so it never blocks profile rows created before this migration, or
-- ones created some other way, e.g. an OAuth sign-in that has no phone
-- to give).
alter table public.profiles
  add column phone text;

-- handle_new_user (0001, redefined in 0012) seeds full_name from
-- raw_user_meta_data the same way signUp() already passes it — phone
-- follows the identical path, one more field in the same trigger.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  matched_grant_id uuid;
  normalized_email text := lower(trim(new.email));
begin
  insert into public.profiles (id, full_name, phone)
  values (new.id, new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'phone');

  select id into matched_grant_id
  from public.student_access_grants
  where email = normalized_email
    and user_id is null
    and revoked_at is null
    and (expires_at is null or expires_at > now())
  limit 1;

  if matched_grant_id is not null then
    update public.student_access_grants
    set user_id = new.id, updated_at = now()
    where id = matched_grant_id;

    insert into public.audit_logs (actor_id, action, target_type, target_id, target_email, new_value)
    values (
      null,
      'access_auto_linked_at_registration',
      'student_access_grant',
      matched_grant_id,
      normalized_email,
      jsonb_build_object('user_id', new.id)
    );
  end if;

  return new;
end;
$$;
