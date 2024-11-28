"use client";
import React, { useEffect, useState } from "react";
import PswdCodeFormEdit from "../post/PswdCodeFormEdit";

export default function PswCodeEdit() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    // Usamos window.location para obtener los parámetros de búsqueda
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get("email");
    setEmail(emailParam);
  }, []);

  if (email === null) {
    return <div>Cargando...</div>;
  }

  return (
    <main className="flex h-screen w-full flex-col bg-slate-50 overflow-hidden">
      <section className="imagen relative flex h-[92%] w-full items-center justify-center mt-16">
        <PswdCodeFormEdit email={email || ""} />
      </section>
    </main>
  );
}
