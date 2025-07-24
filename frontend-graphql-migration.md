# Frontend GraphQL Migration Checklist

This document tracks the migration from mocked data to a GraphQL API using custom React hooks. Each task should be checked off as completed, with subtasks for clarity. Hooks should be placed in the `hooks/` directory, and all usages of mocked data should be replaced with the new hooks.

---

## Phase 1: Core Operations
- [x] **Implement `useAuth()` hook for login/signup/logout**
  - [x] Create `useAuth()` in `hooks/`
  - [x] Integrate login, signup, logout with GraphQL
  - [x] Replace all mock auth logic with hook
- [x] **Replace mock data with `useBookings()` for user bookings**
  - [x] Create `useBookings()` in `hooks/`
  - [x] Replace all mock booking data usage
- [x] **Implement `useCreateBooking()` mutation**
  - [x] Create `useCreateBooking()` in `hooks/`
  - [x] Replace mock booking creation logic
- [x] **Implement `useUpdateBooking()` mutation**
  - [x] Create `useUpdateBooking()` in `hooks/`
  - [x] Replace mock booking update logic
- [x] **Replace mock service list with `useServices()` query**
  - [x] Create `useServices()` in `hooks/`
  - [x] Replace all mock service data usage
- [x] **Implement `useCreateService()` mutation**
  - [x] Create `useCreateService()` in `hooks/`
  - [x] Replace mock service creation logic
- [x] **Refactor components to use new hooks**
  - [x] Update all relevant components to use the above hooks
  - [x] Remove all mock data imports

## Phase 2: Advanced Features
- [ ] **Implement `useProviderSearch()` query (search/filter by category, location)**
  - [ ] Create `useProviderSearch()` in `hooks/`
  - [ ] Integrate search/filter UI
- [ ] **Add `useNotifications()` query + display UI**
  - [ ] Create `useNotifications()` in `hooks/`
  - [ ] Display notifications in UI
- [ ] **Stub `usePayments()` for future Stripe/PayPal integration**
  - [ ] Create `usePayments()` in `hooks/` (stub)
  - [ ] Integrate placeholder UI
- [ ] **Display business stats via `useAnalytics()` query**
  - [ ] Create `useAnalytics()` in `hooks/`
  - [ ] Show stats in dashboard

## Phase 3: Admin Panel
- [ ] **Use `useAdminDashboardData()` query**
  - [ ] Create `useAdminDashboardData()` in `hooks/`
  - [ ] Integrate with admin dashboard UI
- [ ] **Show system logs with `useSystemMonitoring()` (mocked for now)**
  - [ ] Create `useSystemMonitoring()` in `hooks/` (mocked)
  - [ ] Display logs in admin panel
- [ ] **Implement `useReports()` query with filters**
  - [ ] Create `useReports()` in `hooks/`
  - [ ] Add filter UI
- [ ] **Add bulk booking update via `useBulkBookingUpdate()` mutation**
  - [ ] Create `useBulkBookingUpdate()` in `hooks/`
  - [ ] Integrate with admin UI

---

## 🔒 Security & Access (Client-Side Handling)
- [ ] Guard routes by roles (admin, provider, business, user)
- [ ] Use access tokens from `useAuth()` in all GraphQL requests

## 📊 Performance Tips
- [ ] Use graphql-codegen to generate types and hooks
- [ ] Add loading/suspense states to all hooks
- [ ] Debounce inputs for search queries
- [ ] Paginate results for large lists (bookings, users, services)

---

**Instructions:**
- For each task, create a dedicated `useXYZ()` hook in the `hooks/` directory.
- Replace all usages of mocked data with that hook.
- Commit changes with a structured message.
- Mark task as complete in this file (`- [x]`).
- Once Phase 1 is done, proceed to Phase 2 automatically.
- Use Apollo Client or URQL for GraphQL.
- Keep hook logic clean and reusable.
- Validate input where needed.
- Include error and loading handling inside hooks or consuming components.
- Stick to clean architecture and reusable patterns. 