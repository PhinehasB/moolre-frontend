import { redirect } from "next/navigation";

type LoginPageProps = {
  searchParams: Promise<{ verified?: string }>;
};

/** Backend email-verification redirects to APP_LOGIN_URL (/login by default). */
export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { verified } = await searchParams;
  const query = verified ? `?verified=${encodeURIComponent(verified)}` : "";
  redirect(`/signin${query}`);
}
