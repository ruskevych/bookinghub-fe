import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          <div className="bg-background relative z-10 flex min-h-svh flex-col">
            <main className="flex flex-1 flex-col">{children}</main>
          </div>
        </QueryClientProvider>
      </body>
    </html>
  );
}
