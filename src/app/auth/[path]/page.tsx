import { AuthView } from '@daveyplate/better-auth-ui';
import { authViewPaths } from '@daveyplate/better-auth-ui/server';

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.values(authViewPaths).map((path) => ({ path }));
}

export default async function AuthPage({
  params,
}: {
  params: Promise<{ path: string }>;
}) {
  const { path } = await params;

  return (
    <main className="flex grow items-center justify-center h-screen bg-gray-50">
      <div className="max-w-5xl border-1 bg-white p-8 rounded-lg shadow-lg mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex  items-center justify-between gap-12">
          <div className="w-1/2">
            <div className="">
              <AuthView
                classNames={{
                  content: 'border-none',
                  base: 'border-none',
                }}
                path={path}
                localization={{
                  EMAIL_PLACEHOLDER: 'Enter your email',
                }}
              />
            </div>
          </div>
          <div className="w-1/2">
            <img
              src="/logo.png"
              alt="Logo"
              className="w-full h-auto max-w-md mx-auto"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
