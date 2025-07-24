import { ProviderProfile } from '@/components/providers/ProviderProfile';

interface ProviderPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProviderPage({ params }: ProviderPageProps) {
  const { id } = await params;
  
  return <ProviderProfile providerId={id} />;
}

export async function generateMetadata({ params }: ProviderPageProps) {
  const { id } = await params;
  
  // In a real app, you would fetch the provider data here to generate proper metadata
  return {
    title: 'Provider Profile - Timeio',
    description: 'View detailed information about this service provider including services, reviews, and availability.',
  };
} 