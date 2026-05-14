import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import SpeakingClient from './SpeakingClient';

export default async function SpeakingPage() {
  const queryClient = new QueryClient();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

  try {
    await queryClient.prefetchQuery({
      queryKey: ['speaking-sets'],
      queryFn: async () => {
        const res = await fetch(`${API_URL}/content/speaking-sets`, {
          next: { revalidate: 3600 },
        });
        if (!res.ok) return [];
        const json = await res.json();
        return json.data ?? json;
      },
    });
  } catch {}

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SpeakingClient />
    </HydrationBoundary>
  );
}
