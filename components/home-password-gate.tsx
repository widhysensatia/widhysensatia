"use client";

import { FormEvent, useEffect, useState } from "react";
import { KnowledgeHub } from "@/components/knowledge-hub";
import type { KnowledgeDocument } from "@/lib/documents";

const HOME_PASSWORD = "Sensatia";
const STORAGE_KEY = "sensatia-knowledge-home-unlocked";

type Props = {
  documents: KnowledgeDocument[];
};

export function HomePasswordGate({ documents }: Props) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isReady, setIsReady] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    setIsUnlocked(window.localStorage.getItem(STORAGE_KEY) === "true");
    setIsReady(true);
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password === HOME_PASSWORD) {
      window.localStorage.setItem(STORAGE_KEY, "true");
      setIsUnlocked(true);
      setError("");
      return;
    }

    setError("Password belum sesuai. Coba cek huruf besar/kecilnya ya.");
  };

  if (!isReady) {
    return <div className="home-lock-shell" aria-hidden="true" />;
  }

  if (isUnlocked) {
    return <KnowledgeHub documents={documents} />;
  }

  return (
    <main className="home-lock-shell">
      <section className="home-lock-panel" aria-labelledby="home-lock-title">
        <div className="home-lock-brand">
          <img src="/sensatia-mark.svg" alt="" />
          <span>Sensatia Knowledge Library</span>
        </div>
        <p className="eyebrow">Internal workspace</p>
        <h1 id="home-lock-title">Masukkan password untuk membuka directory.</h1>
        <p>
          Halaman ini berisi catatan kerja internal, blueprint, meeting notes, dan panduan operasional Sensatia.
        </p>
        <form className="home-lock-form" onSubmit={handleSubmit}>
          <label htmlFor="home-password">Password</label>
          <div>
            <input
              id="home-password"
              type="password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setError("");
              }}
              autoComplete="current-password"
              autoFocus
            />
            <button type="submit">Buka</button>
          </div>
          {error && <span role="alert">{error}</span>}
        </form>
      </section>
    </main>
  );
}
