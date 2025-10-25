import React from "react";
import { FcGoogle } from "react-icons/fc";
import styles from "../styles/login.module.css";
import { supabase } from "@/shared/lib/supabaseClient";

const LoginGoogle = () => {
  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: process.env.NEXT_PUBLIC_REDIRECT_URL,
      },
    })
  }
  return (
    <div
      onClick={handleLogin}
      className={`select-none flex flex-row items-center gap-2 border w-fit py-2 px-3 hover:bg-primary-hover transition duration-200 cursor-pointer ${styles.shineButton}`}
    >
      <FcGoogle size={22} />
      <div>
        <p>Continue with Google</p>
      </div>
    </div>
  );
};

export default LoginGoogle;
