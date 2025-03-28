import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/router';

const MAX_TIME = 30;
const AVATARS = ['🧒', '👧', '🤖', '🐱', '🦊'];

export default function MultiplicationChallenge() {
  const [score, setScore] = useState(0);
  const [question, setQuestion] = useState(generateQuestion());
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [timeLeft, setTimeLeft] = useState(MAX_TIME);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [highScores, setHighScores] = useState([]);
  const [playerName, setPlayerName] = useState('');
  const [avatar, setAvatar] = useState(AVATARS[0]);
  const timerRef = useRef(null);
  const audioCorrectRef = useRef(null);
  const audioEndRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const savedScores = JSON.parse(localStorage.getItem('highScores')) || [];
    setHighScores(savedScores);
  }, []);

  function generateQuestion() {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    return { a, b, correct: a * b };
  }

  function handleAnswer() {
    if (parseInt(userAnswer) === question.correct) {
      setScore(score + 1);
      setFeedback('Brawo!');
      if (audioCorrectRef.current) audioCorrectRef.current.play();
    } else {
      setFeedback('To nie to!');
    }
    setUserAnswer('');
    setQuestion(generateQuestion());
  }

  function startGame() {
    if (!playerName.trim()) {
      alert("Wpisz swoje imię!");
      return;
    }
    setScore(0);
    setGameOver(false);
    setFeedback('');
    setUserAnswer('');
    setQuestion(generateQuestion());
    setTimeLeft(MAX_TIME);
    setGameStarted(true);
  }

  useEffect(() => {
    if (gameStarted && !gameOver) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setGameOver(true);
            setGameStarted(false);
            if (audioEndRef.current) audioEndRef.current.play();
            saveHighScore();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [gameStarted]);

  function saveHighScore() {
    const newScore = {
      name: playerName,
      avatar,
      score,
      date: new Date().toLocaleString(),
    };
    const updatedScores = [newScore, ...highScores].sort((a, b) => b.score - a.score).slice(0, 5);
    setHighScores(updatedScores);
    localStorage.setItem('highScores', JSON.stringify(updatedScores));

    const allScores = JSON.parse(localStorage.getItem('highScoresAll')) || [];
    const updatedAll = [newScore, ...allScores];
    localStorage.setItem('highScoresAll', JSON.stringify(updatedAll));
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      handleAnswer();
    }
  }

  return (
    <div className="p-4 max-w-xl mx-auto text-center">
      <audio ref={audioCorrectRef} src="/correct.mp3" preload="auto" />
      <audio ref={audioEndRef} src="/end.mp3" preload="auto" />
      <h1 className="text-3xl font-bold mb-4">🎮 Gra: Tabliczka mnożenia</h1>
      {/* (reszta kodu JSX...) */}
    </div>
  );
}
