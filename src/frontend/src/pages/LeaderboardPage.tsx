import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Trophy, Medal, Award } from 'lucide-react';

type GameModeKey = 'endlessRun' | 'cityBuilder' | 'farming' | 'indoor' | 'car' | 'battle';

export default function LeaderboardPage() {
  const [selectedMode, setSelectedMode] = useState<GameModeKey>('endlessRun');

  const modes = [
    { key: 'endlessRun' as GameModeKey, label: 'Endless Run' },
    { key: 'cityBuilder' as GameModeKey, label: 'City Builder' },
    { key: 'farming' as GameModeKey, label: 'Farming' },
    { key: 'indoor' as GameModeKey, label: 'Indoor' },
    { key: 'car' as GameModeKey, label: 'Car Racing' },
    { key: 'battle' as GameModeKey, label: 'Battle' },
  ];

  // Placeholder data - in a real implementation, this would come from useLeaderboard hook
  const mockLeaderboard = Array.from({ length: 10 }, (_, i) => ({
    rank: i + 1,
    player: `Player ${i + 1}`,
    score: Math.floor(Math.random() * 10000),
  }));

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-chart-4" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-muted-foreground" />;
    if (rank === 3) return <Award className="h-5 w-5 text-chart-1" />;
    return <span className="text-muted-foreground">#{rank}</span>;
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="text-center">
        <h1 className="mb-2 text-4xl font-black">LEADERBOARD</h1>
        <p className="text-muted-foreground">Compete with players across all game modes</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Players</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedMode} onValueChange={(v) => setSelectedMode(v as GameModeKey)}>
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
              {modes.map((mode) => (
                <TabsTrigger key={mode.key} value={mode.key} className="text-xs">
                  {mode.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {modes.map((mode) => (
              <TabsContent key={mode.key} value={mode.key} className="mt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-20">Rank</TableHead>
                      <TableHead>Player</TableHead>
                      <TableHead className="text-right">Score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockLeaderboard.map((entry) => (
                      <TableRow key={entry.rank}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">{getRankIcon(entry.rank)}</div>
                        </TableCell>
                        <TableCell>{entry.player}</TableCell>
                        <TableCell className="text-right font-bold">{entry.score}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
