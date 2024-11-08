"use client";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import PswdCodeFormEdit from "../post/PswdCodeFormEdit";

export default function PswCodeEdit() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const emailParam = searchParams.get("email");
    setEmail(emailParam);
  }, [searchParams]);

  if (email === null) {
    return <div>Cargando...</div>; // Puedes mostrar un mensaje de carga mientras obtienes el parámetro
  }

  return (
    <main className="flex h-screen w-full flex-col bg-slate-50 overflow-hidden">
      <section className="imagen relative flex h-[92%] w-full items-center justify-center mt-16">
        <PswdCodeFormEdit email={email || ""} />
      </section>
    </main>
  );
}
