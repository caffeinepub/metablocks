import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft, RotateCcw, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { usePuzzleBestScores } from '../../hooks/usePuzzleBestScores';
import { GameMode } from '../../backend';
import RequireSignInDialog from '../../components/RequireSignInDialog';

interface MemoryCard {
  id: number;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export default function MemoryMatchPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { saveBestScore, isSaving } = usePuzzleBestScores();
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showSignInDialog, setShowSignInDialog] = useState(false);

  const isSignedIn = identity && !identity.getPrincipal().isAnonymous();

  const symbols = ['🎮', '🎯', '🎲', '🎪', '🎨', '🎭', '🎸', '🎺'];

  const initializeGame = () => {
    const shuffled = [...symbols, ...symbols]
      .sort(() => Math.random() - 0.5)
      .map((value, index) => ({
        id: index,
        value,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(shuffled);
    setFlippedCards([]);
    setMoves(0);
    setIsPlaying(true);
    setIsComplete(false);
  };

  const handleCardClick = (id: number) => {
    if (!isPlaying || isComplete) return;
    if (flippedCards.length === 2) return;
    if (flippedCards.includes(id)) return;
    if (cards[id].isMatched) return;

    const newFlipped = [...flippedCards, id];
    setFlippedCards(newFlipped);

    const newCards = cards.map((card) =>
      card.id === id ? { ...card, isFlipped: true } : card
    );
    setCards(newCards);

    if (newFlipped.length === 2) {
      setMoves(moves + 1);
      const [first, second] = newFlipped;
      if (cards[first].value === cards[second].value) {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((card) =>
              card.id === first || card.id === second ? { ...card, isMatched: true } : card
            )
          );
          setFlippedCards([]);
          checkCompletion(newCards);
        }, 500);
      } else {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((card) =>
              card.id === first || card.id === second ? { ...card, isFlipped: false } : card
            )
          );
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const checkCompletion = (currentCards: MemoryCard[]) => {
    const allMatched = currentCards.every((card) => card.isMatched || card.id === flippedCards[0] || card.id === flippedCards[1]);
    if (allMatched) {
      setTimeout(() => {
        setIsComplete(true);
        setIsPlaying(false);
        handleCompletion();
      }, 600);
    }
  };

  const handleCompletion = async () => {
    const score = Math.max(2000 - moves * 20, 200);
    if (isSignedIn) {
      try {
        await saveBestScore(GameMode.cityBuilder, score);
      } catch (error) {
        console.error('Failed to save score:', error);
      }
    } else {
      setShowSignInDialog(true);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate({ to: '/' })}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to PS PUZZLE Hub
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Memory Match</span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={initializeGame} disabled={isSaving}>
                {isPlaying ? <RotateCcw className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                {isPlaying ? 'Reset' : 'Start'}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-between text-sm">
            <div>
              <span className="font-semibold">Moves:</span> {moves}
            </div>
            {isComplete && (
              <div className="font-bold text-chart-4">
                Score: {Math.max(2000 - moves * 20, 200)}
              </div>
            )}
          </div>

          {cards.length === 0 ? (
            <div className="flex h-96 items-center justify-center rounded-lg border-2 border-dashed">
              <div className="text-center">
                <p className="mb-4 text-muted-foreground">Click Start to begin the game</p>
                <Button onClick={initializeGame}>
                  <Play className="mr-2 h-4 w-4" />
                  Start Game
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-3">
              {cards.map((card) => (
                <button
                  key={card.id}
                  onClick={() => handleCardClick(card.id)}
                  disabled={!isPlaying || card.isMatched || card.isFlipped}
                  className={`aspect-square rounded-lg text-4xl font-bold transition-all ${
                    card.isFlipped || card.isMatched
                      ? 'bg-accent'
                      : 'bg-muted hover:scale-105 hover:bg-muted/80 active:scale-95'
                  }`}
                >
                  {card.isFlipped || card.isMatched ? card.value : '?'}
                </button>
              ))}
            </div>
          )}

          {isComplete && (
            <div className="rounded-lg bg-chart-4/10 p-4 text-center">
              <p className="text-lg font-bold text-chart-4">All Pairs Matched!</p>
              <p className="text-sm text-muted-foreground">
                {isSignedIn ? 'Score saved!' : 'Sign in to save your score'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <RequireSignInDialog open={showSignInDialog} onOpenChange={setShowSignInDialog} />
    </div>
  );
}
