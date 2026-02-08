import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft, RotateCcw, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { usePuzzleBestScores } from '../../hooks/usePuzzleBestScores';
import { GameMode } from '../../backend';
import RequireSignInDialog from '../../components/RequireSignInDialog';

const WORDS = [
  'PUZZLE', 'CHALLENGE', 'BRAIN', 'LOGIC', 'MYSTERY', 'RIDDLE', 'SOLUTION', 'PATTERN',
  'SEQUENCE', 'CIPHER', 'ENIGMA', 'PROBLEM', 'QUESTION', 'ANSWER', 'THINKING'
];

export default function WordScramblePage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { saveBestScore, isSaving } = usePuzzleBestScores();
  const [currentWord, setCurrentWord] = useState('');
  const [scrambledWord, setScrambledWord] = useState('');
  const [guess, setGuess] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [message, setMessage] = useState('');
  const [showSignInDialog, setShowSignInDialog] = useState(false);

  const isSignedIn = identity && !identity.getPrincipal().isAnonymous();

  const scrambleWord = (word: string): string => {
    const arr = word.split('');
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.join('');
  };

  const initializeGame = () => {
    const word = WORDS[Math.floor(Math.random() * WORDS.length)];
    setCurrentWord(word);
    setScrambledWord(scrambleWord(word));
    setGuess('');
    setAttempts(0);
    setIsPlaying(true);
    setIsComplete(false);
    setMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPlaying || isComplete) return;

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (guess.toUpperCase() === currentWord) {
      setIsComplete(true);
      setIsPlaying(false);
      setMessage('Correct!');
      await handleCompletion(newAttempts);
    } else if (newAttempts >= 3) {
      setIsComplete(true);
      setIsPlaying(false);
      setMessage(`Out of attempts! The word was: ${currentWord}`);
      await handleCompletion(newAttempts);
    } else {
      setMessage(`Wrong! ${3 - newAttempts} attempts remaining.`);
      setGuess('');
    }
  };

  const handleCompletion = async (finalAttempts: number) => {
    const score = finalAttempts === 1 ? 1000 : finalAttempts === 2 ? 500 : 100;
    if (isSignedIn) {
      try {
        await saveBestScore(GameMode.farming, score);
      } catch (error) {
        console.error('Failed to save score:', error);
      }
    } else {
      setShowSignInDialog(true);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate({ to: '/' })}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to PS PUZZLE Hub
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Word Scramble</span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={initializeGame} disabled={isSaving}>
                {isPlaying ? <RotateCcw className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                {isPlaying ? 'New Word' : 'Start'}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isPlaying && !isComplete ? (
            <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed">
              <div className="text-center">
                <p className="mb-4 text-muted-foreground">Click Start to begin the game</p>
                <Button onClick={initializeGame}>
                  <Play className="mr-2 h-4 w-4" />
                  Start Game
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                <div className="text-center">
                  <p className="mb-2 text-sm text-muted-foreground">Unscramble this word:</p>
                  <p className="text-4xl font-bold tracking-widest">{scrambledWord}</p>
                </div>

                <div className="text-center text-sm">
                  <span className="font-semibold">Attempts:</span> {attempts} / 3
                </div>

                {message && (
                  <div className={`rounded-lg p-3 text-center ${
                    message.includes('Correct') ? 'bg-chart-4/10 text-chart-4' : 'bg-destructive/10 text-destructive'
                  }`}>
                    {message}
                  </div>
                )}

                {isPlaying && (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                      type="text"
                      value={guess}
                      onChange={(e) => setGuess(e.target.value)}
                      placeholder="Enter your guess..."
                      className="text-center text-lg"
                      autoFocus
                    />
                    <Button type="submit" className="w-full" disabled={!guess.trim()}>
                      Submit Guess
                    </Button>
                  </form>
                )}

                {isComplete && (
                  <div className="space-y-4">
                    <div className="rounded-lg bg-accent/50 p-4 text-center">
                      <p className="text-lg font-bold">
                        Score: {attempts === 1 ? 1000 : attempts === 2 ? 500 : 100}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {isSignedIn ? 'Score saved!' : 'Sign in to save your score'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <RequireSignInDialog open={showSignInDialog} onOpenChange={setShowSignInDialog} />
    </div>
  );
}
