-- Enable RLS
alter table "public"."claims" enable row level security;

-- Create policies for claims table
create policy "Anyone can read claims"
on "public"."claims"
as permissive
for select
to public
using (true);

create policy "Users can insert their own claims"
on "public"."claims"
as permissive
for insert
to authenticated
with check (
  (auth.uid() = user_id)
);

create policy "Users can update their own claims"
on "public"."claims"
as permissive
for update
to authenticated
using (
  (auth.uid() = user_id)
)
with check (
  (auth.uid() = user_id)
);

create policy "Users can delete their own claims"
on "public"."claims"
as permissive
for delete
to authenticated
using (
  (auth.uid() = user_id)
);

-- Handle error cases in RLS by ensuring types are matched and auth.uid() is not null
-- if necessary, we can wrap conditions in coalesce or handle exceptions.
