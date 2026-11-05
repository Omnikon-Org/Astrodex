begin;
select plan(3);

-- Test 1: Authenticated users can select from users table
select lives_ok(
    $$select * from auth.users$$,
    'Authenticated users can read auth.users table'
);

-- Test 2: Anonymous users cannot insert into protected tables
select throws_ok(
    $$insert into public.asteroids (id, name) values (999, 'Test')$$,
    '42501', -- Insufficient privilege
    'new row violates row-level security policy',
    'Anonymous users cannot insert into public.asteroids'
);

-- Test 3: Users can only update their own claims
set local role authenticated;
set local request.jwt.claim.sub = '12345-user-id';

select throws_ok(
    $$update public.claims set status = 'approved' where user_id != '12345-user-id'$$,
    '42501',
    'new row violates row-level security policy',
    'Users cannot update other users claims'
);

select * from finish();
rollback;
