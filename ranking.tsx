
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";

export default function RankingPage() {
  const [scores, setScores] = useState([]);
  const [filter, setFilter] = useState("");
  const router = useRouter();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("highScoresAll")) || [];
    setScores(saved.sort((a, b) => b.score - a.score));
  }, []);

  const filtered = scores.filter((s) =>
    s.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">🏆 Ranking graczy</h1>
      <input
        type="text"
        placeholder="Filtruj po imieniu..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="mb-4 w-full p-2 border rounded text-center"
      />
      <ul className="space-y-2">
        {filtered.length > 0 ? (
          filtered.map((entry, index) => (
            <li
              key={index}
              className="p-3 rounded border flex justify-between items-center shadow-sm"
            >
              <span className="text-2xl mr-2">{entry.avatar}</span>
              <span className="font-semibold flex-1">
                {entry.name} – {entry.score} pkt
              </span>
              <span className="text-sm text-gray-500">{entry.date}</span>
            </li>
          ))
        ) : (
          <li className="text-center text-gray-500">Brak wyników.</li>
        )}
      </ul>
      <Button onClick={() => router.push("/")} className="mt-6 w-full">
        ⬅️ Powrót do gry
      </Button>
    </div>
  );
}
