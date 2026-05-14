import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import LessonsClient from './LessonsClient';

export default async function LessonsPage() {
  const queryClient = new QueryClient();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

  try {
    await queryClient.prefetchQuery({
      queryKey: ['courses'],
      queryFn: async () => {
        const res = await fetch(`${API_URL}/lessons/courses`, {
          next: { revalidate: 3600 },
        });
        if (!res.ok) return [];
        const json = await res.json();
        return json.data ?? [];
      },
    });
  } catch {}

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <LessonsClient />
    </HydrationBoundary>
  );
}
