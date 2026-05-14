import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import ReadingClient from './ReadingClient';

export default async function ReadingPage() {
  const queryClient = new QueryClient();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

  try {
    await queryClient.prefetchQuery({
      queryKey: ['reading-stories'],
      queryFn: async () => {
        const res = await fetch(`${API_URL}/content/stories`, {
          next: { revalidate: 3600 },
        });
        if (!res.ok) throw new Error(`fetch failed: ${res.status}`);
        const json = await res.json();
        return json.data ?? json;
      },
    });
  } catch {}

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ReadingClient />
    </HydrationBoundary>
  );
}
