import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import LeaderboardClient from './LeaderboardClient';

export default async function LeaderboardPage() {
  const queryClient = new QueryClient();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

  try {
    await Promise.all([
      queryClient.prefetchQuery({
        queryKey: ['leaderboard', 'weekly'],
        queryFn: async () => {
          const res = await fetch(`${API_URL}/leaderboard/weekly`, {
            next: { revalidate: 300 },
          });
          if (!res.ok) return [];
          const json = await res.json();
          return json.data ?? [];
        },
      }),
      queryClient.prefetchQuery({
        queryKey: ['leaderboard', 'all-time'],
        queryFn: async () => {
          const res = await fetch(`${API_URL}/leaderboard/all-time`, {
            next: { revalidate: 300 },
          });
          if (!res.ok) return [];
          const json = await res.json();
          return json.data ?? [];
        },
      }),
    ]);
  } catch {}

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <LeaderboardClient />
    </HydrationBoundary>
  );
}
