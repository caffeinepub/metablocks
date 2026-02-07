import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Play, RotateCcw } from 'lucide-react';
import { useGameProgress } from '../../../hooks/useGameProgress';
import { toast } from 'sonner';
import { GameMode } from '../../../backend';

interface ReactionGameProps {
  onBack: () => void;
}

type GameState = 'idle' | 'waiting' | 'ready' | 'clicked' | 'gameOver';

export default function ReactionGame({ onBack }: ReactionGameProps) {
  const [gameState, setGameState] = useState<GameState>('idle');
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const { saveProgress } = useGameProgress();

  const maxRounds = 5;

  useEffect(() => {
    if (gameState === 'waiting') {
      const delay = Math.random() * 3000 + 1000;
      const timer = setTimeout(() => {
        setGameState('ready');
        setStartTime(Date.now());
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [gameState]);

  const startGame = () => {
    setGameState('waiting');
    setScore(0);
    setRound(1);
  };

  const handleClick = () => {
    if (gameState === 'ready') {
      const reactionTime = Date.now() - startTime;
      const points = Math.max(0, 1000 - reactionTime);
      setScore((s) => s + points);

      if (round >= maxRounds) {
        finishGame(score + points);
      } else {
        setRound((r) => r + 1);
        setGameState('waiting');
      }
    } else if (gameState === 'waiting') {
      toast.error('Too early!');
      finishGame(score);
    }
  };

  const finishGame = async (finalScore: number) => {
    setGameState('gameOver');
    const coins = Math.floor(finalScore / 100);
    try {
      await saveProgress(GameMode.indoor, finalScore, coins);
      toast.success(`Game Over! Score: ${finalScore}, Coins: ${coins}`);
    } catch (error) {
      toast.error('Failed to save score');
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Indoor
        </Button>
        <h2 className="text-2xl font-black">REACTION GAME</h2>
        <div className="w-24" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Score: {score}</span>
            <span className="text-sm text-muted-foreground">
              Round {round}/{maxRounds}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            onClick={handleClick}
            className={`flex h-64 cursor-pointer items-center justify-center rounded-lg border-2 transition-all ${
              gameState === 'ready'
                ? 'border-chart-3 bg-chart-3 text-4xl font-black'
                : gameState === 'waiting'
                  ? 'border-muted bg-muted/20 text-muted-foreground'
                  : 'border-border bg-muted/10'
            }`}
          >
            {gameState === 'idle' && 'Click Start to Begin'}
            {gameState === 'waiting' && 'Wait for it...'}
            {gameState === 'ready' && 'CLICK NOW!'}
            {gameState === 'gameOver' && `Final Score: ${score}`}
          </div>

          <div className="mt-6 flex justify-center gap-4">
            {gameState === 'idle' && (
              <Button onClick={startGame} size="lg" className="gap-2">
                <Play className="h-5 w-5" />
                Start Game
              </Button>
            )}
            {gameState === 'gameOver' && (
              <>
                <Button onClick={startGame} variant="outline" size="lg" className="gap-2">
                  <RotateCcw className="h-5 w-5" />
                  Play Again
                </Button>
                <Button onClick={onBack} size="lg">
                  Back to Indoor
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
