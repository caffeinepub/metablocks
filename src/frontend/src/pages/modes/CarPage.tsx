import { useState, useEffect, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Play, RotateCcw } from 'lucide-react';
import { useCarRacing } from '../../hooks/useCarRacing';
import { toast } from 'sonner';

type GameState = 'idle' | 'racing' | 'finished';

export default function CarPage() {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<GameState>('idle');
  const [progress, setProgress] = useState(0);
  const [time, setTime] = useState(0);
  const [carPosition, setCarPosition] = useState(50);
  const startTimeRef = useRef(0);
  const gameLoopRef = useRef<number | undefined>(undefined);
  const { saveBestTime, bestTime } = useCarRacing();

  useEffect(() => {
    if (gameState === 'racing') {
      const loop = () => {
        const elapsed = Date.now() - startTimeRef.current;
        setTime(elapsed);
        setProgress((p) => Math.min(100, p + 0.5));
        if (progress >= 100) {
          finishRace(elapsed);
        } else {
          gameLoopRef.current = requestAnimationFrame(loop);
        }
      };
      gameLoopRef.current = requestAnimationFrame(loop);
    }
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [gameState, progress]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameState !== 'racing') return;
      if (e.key === 'ArrowLeft') {
        setCarPosition((p) => Math.max(20, p - 10));
      } else if (e.key === 'ArrowRight') {
        setCarPosition((p) => Math.min(80, p + 10));
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState]);

  const startRace = () => {
    setGameState('racing');
    setProgress(0);
    setTime(0);
    setCarPosition(50);
    startTimeRef.current = Date.now();
  };

  const finishRace = async (finalTime: number) => {
    setGameState('finished');
    try {
      await saveBestTime(finalTime);
      toast.success(`Race finished! Time: ${(finalTime / 1000).toFixed(2)}s`);
    } catch (error) {
      toast.error('Failed to save time');
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate({ to: '/' })} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Hub
        </Button>
        <h1 className="text-3xl font-black">CAR RACING</h1>
        <div className="w-24" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Time: {(time / 1000).toFixed(2)}s</span>
            {bestTime && <span className="text-sm text-muted-foreground">Best: {(bestTime / 1000).toFixed(2)}s</span>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative h-64 overflow-hidden rounded-lg border-2 border-border bg-gradient-to-b from-muted/20 to-muted/5">
            {/* Track lanes */}
            <div className="absolute inset-0 flex">
              <div className="flex-1 border-r border-dashed border-muted-foreground/30" />
              <div className="flex-1 border-r border-dashed border-muted-foreground/30" />
              <div className="flex-1" />
            </div>

            {/* Car */}
            <div
              className="absolute bottom-8 h-12 w-8 rounded bg-chart-1 transition-all duration-200"
              style={{ left: `${carPosition}%` }}
            />

            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 h-2 bg-chart-3" style={{ width: `${progress}%` }} />

            {gameState === 'racing' && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 text-sm text-muted-foreground">
                Use ← → to steer
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-center gap-4">
            {gameState === 'idle' && (
              <Button onClick={startRace} size="lg" className="gap-2">
                <Play className="h-5 w-5" />
                Start Race
              </Button>
            )}
            {gameState === 'finished' && (
              <>
                <Button onClick={startRace} variant="outline" size="lg" className="gap-2">
                  <RotateCcw className="h-5 w-5" />
                  Race Again
                </Button>
                <Button onClick={() => navigate({ to: '/' })} size="lg">
                  Back to Hub
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
