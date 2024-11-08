"use client";
import Navbar from "components/navbar";
import ResetPswFormEdit from "../post/ResetPwdFormEdit";

export default function ResetPswEdit() {
  return (
    <main className="flex h-screen w-full flex-col bg-slate-50 overflow-hidden">
      <Navbar/>
      <section className="imagen relative flex h-[92%] w-full items-center justify-center mt-16">
        <ResetPswFormEdit/>
      </section>
    </main>
  );
}
