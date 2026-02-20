declare module '@auth/create/react' {
  import { ComponentType, ReactNode } from 'react';
  
  interface Session {
    user?: {
      id?: string;
      name?: string;
      email?: string;
      image?: string;
    };
    expires?: string;
  }

  interface SessionContextValue {
    data: Session | null;
    status: 'loading' | 'authenticated' | 'unauthenticated';
    update: (data?: any) => Promise<Session | null>;
  }

  export const useSession: () => SessionContextValue;
  export const SessionProvider: ComponentType<{ children: ReactNode; session?: Session | null }>;
}
