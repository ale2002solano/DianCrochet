"use client";
import ResetPswdForm from "../components/posts/ResetPwdForm";
import LoginBG from "../components/backgrounds/LoginBackGround";

import Footer from "components/Footer";
import Navbar from "components/navbar";

export default function ResetPsw() {
  return (
    <main className="flex h-screen w-full flex-col bg-slate-50 overflow-hidden">
      
      <section className="imagen relative flex h-[92%] w-full items-center justify-center mt-16">
        <ResetPswdForm />
        <LoginBG />
      </section>
      <Footer/>
    </main>
  );
}
