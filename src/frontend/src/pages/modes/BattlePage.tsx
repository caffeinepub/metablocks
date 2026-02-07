import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Sword, Shield, Zap, RotateCcw } from 'lucide-react';
import { useBattle } from '../../hooks/useBattle';
import { toast } from 'sonner';

type GameState = 'idle' | 'playerTurn' | 'enemyTurn' | 'won' | 'lost';

interface Fighter {
  name: string;
  hp: number;
  maxHp: number;
  attack: number;
}

export default function BattlePage() {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<GameState>('idle');
  const [player, setPlayer] = useState<Fighter>({ name: 'Player', hp: 100, maxHp: 100, attack: 20 });
  const [enemy, setEnemy] = useState<Fighter>({ name: 'CPU', hp: 80, maxHp: 80, attack: 15 });
  const { saveWin, stats } = useBattle();

  const startBattle = () => {
    setPlayer({ name: 'Player', hp: 100, maxHp: 100, attack: 20 });
    setEnemy({ name: 'CPU', hp: 80, maxHp: 80, attack: 15 });
    setGameState('playerTurn');
  };

  const performAction = (actionType: 'attack' | 'defend' | 'special') => {
    if (gameState !== 'playerTurn') return;

    let damage = 0;
    if (actionType === 'attack') {
      damage = player.attack + Math.floor(Math.random() * 10);
      toast.info(`You dealt ${damage} damage!`);
    } else if (actionType === 'defend') {
      damage = Math.floor(player.attack * 0.5);
      setPlayer((p) => ({ ...p, hp: Math.min(p.maxHp, p.hp + 10) }));
      toast.info(`You defended and dealt ${damage} damage!`);
    } else if (actionType === 'special') {
      damage = player.attack * 2;
      toast.info(`Special attack! ${damage} damage!`);
    }

    const newEnemyHp = Math.max(0, enemy.hp - damage);
    setEnemy((e) => ({ ...e, hp: newEnemyHp }));

    if (newEnemyHp <= 0) {
      handleWin();
      return;
    }

    setGameState('enemyTurn');
    setTimeout(enemyTurn, 1000);
  };

  const enemyTurn = () => {
    const damage = enemy.attack + Math.floor(Math.random() * 8);
    toast.error(`Enemy dealt ${damage} damage!`);
    const newPlayerHp = Math.max(0, player.hp - damage);
    setPlayer((p) => ({ ...p, hp: newPlayerHp }));

    if (newPlayerHp <= 0) {
      setGameState('lost');
    } else {
      setGameState('playerTurn');
    }
  };

  const handleWin = async () => {
    setGameState('won');
    try {
      await saveWin();
      toast.success('Victory! +50 coins');
    } catch (error) {
      toast.error('Failed to save win');
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate({ to: '/' })} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Hub
        </Button>
        <h1 className="text-3xl font-black">BATTLE ARENA</h1>
        <div className="w-24" />
      </div>

      {stats && (
        <Card>
          <CardContent className="flex items-center justify-around py-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{Number(stats.winsCount)}</div>
              <div className="text-sm text-muted-foreground">Wins</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{Number(stats.bestStreak)}</div>
              <div className="text-sm text-muted-foreground">Best Streak</div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{player.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span>HP</span>
                <span>
                  {player.hp}/{player.maxHp}
                </span>
              </div>
              <Progress value={(player.hp / player.maxHp) * 100} className="h-3" />
            </div>
            <div className="text-sm text-muted-foreground">Attack: {player.attack}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{enemy.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span>HP</span>
                <span>
                  {enemy.hp}/{enemy.maxHp}
                </span>
              </div>
              <Progress value={(enemy.hp / enemy.maxHp) * 100} className="h-3" />
            </div>
            <div className="text-sm text-muted-foreground">Attack: {enemy.attack}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {gameState === 'idle' && 'Ready to Battle?'}
            {gameState === 'playerTurn' && 'Your Turn'}
            {gameState === 'enemyTurn' && 'Enemy Turn...'}
            {gameState === 'won' && 'Victory!'}
            {gameState === 'lost' && 'Defeat...'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap justify-center gap-4">
            {gameState === 'idle' && (
              <Button onClick={startBattle} size="lg" className="gap-2">
                <Sword className="h-5 w-5" />
                Start Battle
              </Button>
            )}
            {gameState === 'playerTurn' && (
              <>
                <Button onClick={() => performAction('attack')} size="lg" className="gap-2">
                  <Sword className="h-5 w-5" />
                  Attack
                </Button>
                <Button onClick={() => performAction('defend')} variant="outline" size="lg" className="gap-2">
                  <Shield className="h-5 w-5" />
                  Defend
                </Button>
                <Button onClick={() => performAction('special')} variant="secondary" size="lg" className="gap-2">
                  <Zap className="h-5 w-5" />
                  Special
                </Button>
              </>
            )}
            {(gameState === 'won' || gameState === 'lost') && (
              <>
                <Button onClick={startBattle} variant="outline" size="lg" className="gap-2">
                  <RotateCcw className="h-5 w-5" />
                  Battle Again
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
