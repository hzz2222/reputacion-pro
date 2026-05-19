import { Suspense } from 'react';
import { SurveyClient } from './SurveyClient';

export default async function SurveyPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ r?: string }>;
}) {
  const { token } = await params;
  const { r } = await searchParams;
  const initialResponse = r === 'positive' || r === 'negative' ? r : undefined;

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
      </div>
    }>
      <SurveyClient token={token} initialResponse={initialResponse} />
    </Suspense>
  );
}
