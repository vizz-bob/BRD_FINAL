# Mobile Responsiveness QA Checklist

Use this checklist to verify the app on different screen sizes (mobile / tablet / desktop).

## Pages to verify
- [ ] `/` redirects to `/crm` and shows dashboard
- [ ] `/crm` (Dashboard)
- [ ] `/crm/leads` (Leads list)
- [ ] `/crm/lead/:id` (Lead details)
- [ ] `/crm/tasks` (Tasks)
- [ ] `/crm/campaigns`
- [ ] Auth pages: `/login`, `/signup`

## Cross-page checks
- [ ] Sidebar collapses into a mobile header with a menu button
- [ ] Menu opens/closes and overlay blocks background clicks
- [ ] Active nav item is highlighted on small screens
- [ ] Content paddings look consistent on small screens (use `px-4` / `p-4`)
- [ ] Grids collapse to a single column on very small widths
- [ ] Buttons and inputs are full-width or easily tappable on mobile
- [ ] Modals (if any) are full-width on small screens and centered on larger screens
- [ ] No horizontal scroll appears at typical mobile widths
- [ ] Legacy URLs like `/crm/leads/:id` redirect to `/crm/lead/:id`

## Notes
- Use browser devtools responsive toolbar to check breakpoints (375x667, 412x915, 768x1024).
- If any page has layout regressions, capture a screenshot and note the component/file.
