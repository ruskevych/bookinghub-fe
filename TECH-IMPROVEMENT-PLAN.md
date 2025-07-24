# ✅ Tech Improvement & Refactor Plan (Prioritized)

---

## 🔥 HIGH PRIORITY

### 🧱 Architecture

* [x] **Refactor Monolithic Page Components (Booking/Admin)**  
  _Both BookingPage and AdminDashboard are already split into presentational components and logic hooks._

  * **What:** Break large pages like `BookingPage` and `AdminDashboard` into smaller presentational components and logic hooks.
  * **Why:** Improves maintainability, testing, and reusability. Avoids unreadable JSX blocks.
  * **How:** Use custom hooks (`useBookingData`, `useAdminStats`) and atomic components (`BookingTable`, `UserList`, `ServiceEditor`).

* [x] **Extract API and Data Logic from UI**  
  _All API/data logic is already extracted to hooks (e.g., useAdminDashboard, useBooking, useBookingConfirmation)._

  * **What:** Move all REST/GraphQL fetches and mutations to `useXYZ.ts` hooks.
  * **Why:** Separation of concerns, cleaner components, easier testing.
  * **How:** For example, replace `fetch('/api/bookings')` in components with `useBookings()` that internally uses `useQuery`.

---

### 💾 State Management

* [ ] **Adopt TanStack Query for Server State**

  * **What:** Use [TanStack Query](https://tanstack.com/query/latest) (`@tanstack/react-query`) to manage all server-side state (bookings, services, users, businesses).
  * **Why:** Enables caching, retry logic, background updates, and removes the need for manual loading/error handling.
  * **How:** Refactor existing REST/GraphQL data logic into query/mutation hooks with cache keys.

* [ ] **Introduce Zustand for Client/UI State**

  * **What:** Use [Zustand](https://zustand-demo.pmnd.rs/) for global UI/session state (e.g., active business ID, selected tab, open modals).
  * **Why:** Eliminates prop drilling and reduces re-renders compared to Context API.
  * **How:** Define `useAppStore` with slices like `auth`, `ui`, and `bookingFlow`.

---

### 🔌 GraphQL Integration

* [ ] **Setup urql Client with JWT Auth Middleware**

  * **What:** Create `lib/graphql-client.ts` that initializes urql with fetchExchange, cacheExchange, and authExchange for token injection.
  * **Why:** Establishes a secure and reusable GraphQL connection.
  * **How:** Use `makeOperation` to attach `Authorization: Bearer <token>` to headers from Zustand/session.

* [ ] **Generate TypeScript Types from GraphQL Schema**

  * **What:** Use [GraphQL Code Generator](https://www.graphql-code-generator.com/) with plugins for urql + TypeScript types.
  * **Why:** Prevents type mismatches and runtime errors.
  * **How:** Configure `codegen.yml` with fragment and query paths.

---

### ⚡ Performance

* [ ] **Implement Pagination in /services and /bookings APIs**

  * **What:** Ensure both frontend and backend support page/limit query params.
  * **Why:** Avoids large JSON payloads and improves perceived speed.
  * **How:** On the frontend, use infinite queries or paginated components.

---

## 🟡 MEDIUM PRIORITY

### 🧱 Architecture

* [ ] **Standardize Folder Structure and Naming**

  * **What:** Define and enforce a structure like:

    ```
    /components
    /hooks
    /stores
    /graphql
    /pages
    /types
    ```
  * **Why:** Helps new devs navigate and keeps things modular.

---

### 💾 State Management

* [ ] **Normalize and Memoize User Session State**

  * **What:** Centralize user data (id, role, language) in Zustand or a lightweight context.
  * **Why:** Avoid duplicate fetches and re-renders across pages/components.

---

### 🔧 Refactoring

* [ ] **Split Dashboards into Reusable Widgets**

  * **What:** Convert `AdminDashboard` and `BusinessDashboard` into a layout that composes widgets like `StatsCard`, `RecentBookings`, `TopServices`.
  * **Why:** Makes them testable, pluggable, and easier to change per role.

* [ ] **Remove Magic Numbers and Hardcoded Strings**

  * **What:** Replace literals like `3000`, `booking.status === 'Confirmed'` with constants and enums.
  * **Why:** Improves clarity and enables easier localization/configuration.

* [ ] **Centralize Error Handling and Notifications**

  * **What:** Create `useErrorHandler()` and `useNotify()` hooks for consistent error display and toast logic.
  * **Why:** Reduces copy/paste and ensures a unified user experience.

---

### 🔌 GraphQL Integration

* [ ] **Colocate GraphQL Queries/Fragments**

  * **What:** Store queries next to the components that use them OR in `/graphql/` with clear naming.
  * **Why:** Improves modularity, prevents unused fragments.

* [ ] **Migrate Key REST Calls to GraphQL**

  * **What:** Convert high-traffic endpoints (e.g., `/api/bookings`, `/api/services`) to GraphQL.
  * **Why:** Leverages type-safe querying and reduces overfetching.

---

### ⚡ Performance

* [ ] **Debounce Search in Booking & Service Lists**

  * **What:** Wrap search input with `useDebounce()` and delay querying by 300ms.
  * **Why:** Prevents dozens of API calls per user input.

* [ ] **Memoize Large Lists and Expensive Computation**

  * **What:** Use `React.memo`, `useMemo`, or `useCallback` in lists, date transforms, calendar rendering.
  * **Why:** Improves rendering speed, especially in dashboards.

---

## 🟢 LOW PRIORITY

### 🧹 Cleanup

* [ ] **Delete Legacy Code and Deprecated Modules**

  * Files: `useLegacyFetch.ts`, `OldBookingModal.tsx`, outdated toast/alert components.
  * Why: Reduces confusion, bundle size, and build time.

* [ ] **Audit and Remove Unused Dependencies**

  * **What:** Run `depcheck` or manual review of `package.json`.
  * **Why:** Cleans up vulnerabilities and unused packages.

---

## 🚀 Optional (Future Work)

* [ ] **Add Error Boundaries Per Route Group**

  * `/_app.tsx` should wrap admin, booking, and public areas in distinct boundaries.

* [ ] **Add Language Detection Middleware**

---

## 💡 Additional Improvements

* [ ] _(Add your own suggestions here)_ 