"use client";
import { useSearchParams } from "next/navigation";
import React,{ Suspense } from "react";
import PswdCodeForm from "../components/posts/PswdCodeForm";
import LoginBG from "../components/backgrounds/LoginBackGround";
import Header from "components/Header";
function EmailParamsComponent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  return <PswdCodeForm email={email || ""} />;
}
export default function PswCode() {
  return (
    <main className="flex h-screen w-full flex-col bg-slate-50 overflow-hidden">
      <Header />
      <section className="imagen relative flex h-[92%] w-full items-center justify-center">
        <Suspense fallback={<div>Cargando...</div>}>
          <EmailParamsComponent />
        </Suspense>
        <LoginBG />
      </section>
    </main>
  );
}