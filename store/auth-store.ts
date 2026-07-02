import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AuthUserResponse, CompanyResponse } from "@/lib/auth-types";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthUserResponse | null;
  company: CompanyResponse | null;
  isAuthenticated: boolean;
}

interface AuthActions {
  setTokens: (params: {
    accessToken: string;
    refreshToken: string;
    user: AuthUserResponse;
    company: CompanyResponse;
  }) => void;
  setUser: (user: AuthUserResponse, company: CompanyResponse) => void;
  clearAuth: () => void;
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  user: null,
  company: null,
  isAuthenticated: false,
};

/** Sync a lightweight cookie so Next.js middleware can detect auth state. */
function syncAuthCookie(authenticated: boolean) {
  if (typeof document === "undefined") return;
  if (authenticated) {
    // httpOnly=false so middleware can read it (not security-sensitive; just a flag)
    document.cookie = `klare-auth-token=1; path=/; SameSite=Lax; max-age=${60 * 60 * 24 * 30}`;
  } else {
    document.cookie = "klare-auth-token=; path=/; max-age=0";
  }
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      ...initialState,

      setTokens: ({ accessToken, refreshToken, user, company }) => {
        syncAuthCookie(true);
        set({ accessToken, refreshToken, user, company, isAuthenticated: true });
      },

      setUser: (user, company) => set({ user, company }),

      clearAuth: () => {
        syncAuthCookie(false);
        set(initialState);
      },
    }),
    {
      name: "klare-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        company: state.company,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        // Re-sync the cookie after hydration from localStorage
        if (state?.isAuthenticated) {
          syncAuthCookie(true);
        }
      },
    }
  )
);
