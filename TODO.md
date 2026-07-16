# TODO - Admin flow fix (backend repo)

## Step 1: Gather evidence
- [x] Read backend auth middleware (protect/admin).
- [x] Read backend routes for users/products/orders.
- [ ] Confirm exact endpoints used by frontend after admin login.

## Step 2: Produce admin navigation contract
- [ ] Determine frontend route path sequence (dashboard -> user list -> order list -> products add -> back to dashboard).
- [ ] Verify frontend uses backend endpoints correctly with cookie credentials.

## Step 3: Implement fix
- [ ] Update frontend routing/guard + redirect logic (React).
- [ ] Ensure cookie auth works on deployed Vercel domain.

## Step 4: Validate
- [ ] Test admin login → verify dashboard renders.
- [ ] Verify user list, order list, products add pages load in sequence.
- [ ] Verify Vercel link unchanged.

