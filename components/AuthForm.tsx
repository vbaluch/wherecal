import { useState, MouseEvent } from "react";
import { supabase } from "../utils/supabaseClient";

import Button from "./Button";
import SignInWithSlackButton from "./SignInWithSlackButton";

export default function AuthForm() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleLogin = async (email: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signIn({ email });
      if (error) throw error;
      alert("Check your email for the login link!");
    } catch (error) {
      alert(JSON.stringify(error));
    } finally {
      setLoading(false);
    }
  };

  async function signInWithSlack() {
    // FIXME add error handling
    await supabase.auth.signIn({
      provider: "slack",
    });
  }

  return (
    <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="mt-8 text-center text-4xl font-bold text-white">
            WhereCal
          </h1>
          <h2 className="mt-6 text-center text-xl font-bold text-white">
            Sign in via email magic link or Slack below
          </h2>
        </div>
        <form className="mt-8 space-y-6" action="#" method="POST">
          <input type="hidden" name="remember" value="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                value={email}
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                className="appearance-none bg-gray-800 relative block w-full px-3 py-2 border border-gray-800 placeholder-gray-500 text-white rounded-md focus:outline-none sm:text-sm"
                placeholder="Email address"
              />
            </div>
          </div>
          <div className="flex flex-row justify-center">
            <Button
              onClick={(event: MouseEvent<HTMLButtonElement>) => {
                event.preventDefault();
                email && handleLogin(email);
              }}
              disabled={loading || !email}
            >
              {loading ? "Loading" : "Send magic link"}
            </Button>
          </div>
        </form>
        <div className="flex flex-row justify-center">
          <SignInWithSlackButton onClick={() => signInWithSlack()} />
        </div>
      </div>
    </div>
  );
}
