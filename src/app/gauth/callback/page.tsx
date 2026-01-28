import { redirect } from "next/navigation";
import AuthCallbackClient from "./_components/AuthCallbackClient";

type Props = {
  searchParams: Promise<{ token?: string }>;
};

export default async function AuthCallbackPage({ searchParams }: Props) {
  const params = await searchParams;
  const token = params.token;

  if (!token) {
    redirect("/auth/login");
  }

  // Pass token to client component - it will fetch the profile client-side
  return <AuthCallbackClient accessToken={token} />;
}
