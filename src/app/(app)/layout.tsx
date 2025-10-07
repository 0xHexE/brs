import { AppSidebar } from '@/components/app-sidebar';
import { ChatSidebar } from '@/components/chat-sidebar';
import { DynamicBreadcrumb } from '@/components/breadcrumb';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { RedirectToSignIn, SignedIn } from '@daveyplate/better-auth-ui';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <RedirectToSignIn />
      <SignedIn>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <div className="flex h-screen overflow-hidden">
              <div className="flex flex-col flex-1 min-w-0">
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                  <div className="flex items-center gap-2 px-4 flex-1">
                    <SidebarTrigger className="-ml-1" />
                    <Separator
                      orientation="vertical"
                      className="mr-2 data-[orientation=vertical]:h-4"
                    />
                    <DynamicBreadcrumb />
                  </div>
                </header>
                <div className="flex-1 min-h-0 overflow-auto">{children}</div>
              </div>
              <ChatSidebar />
            </div>
          </SidebarInset>
        </SidebarProvider>
      </SignedIn>
    </>
  );
}
