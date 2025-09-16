import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("Completing sign in...");

  useEffect(() => {
    const run = async () => {
      if (!supabase) {
        setMessage("Auth not configured. Please set Supabase environment variables.");
        return;
      }
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        setMessage("Sign in failed. " + error.message);
        return;
      }
      if (data.session) {
        setMessage("Signed in. Redirecting...");
        setTimeout(() => navigate("/"), 600);
      } else {
        setMessage("No active session. Try again.");
      }
    };
    run();
  }, [navigate]);

  return (
    <div className="mx-auto max-w-md text-center">
      <div className="rounded-2xl border p-8">
        <h1 className="text-xl font-semibold">MITR</h1>
        <p className="mt-2 text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}
