import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Home, ShoppingBag, Trees } from 'lucide-react';
import { usePlayerProfile } from '../../hooks/usePlayerProfile';
import { useCityBuilder } from '../../hooks/useCityBuilder';
import { toast } from 'sonner';
import { StructureType } from '../../backend';

const GRID_SIZE = 5;

const structures = [
  { type: 'house' as StructureType, name: 'House', cost: 50, icon: Home, color: 'bg-chart-1' },
  { type: 'shop' as StructureType, name: 'Shop', cost: 100, icon: ShoppingBag, color: 'bg-chart-2' },
  { type: 'park' as StructureType, name: 'Park', cost: 75, icon: Trees, color: 'bg-chart-3' },
];

export default function CityBuilderPage() {
  const navigate = useNavigate();
  const { data: profile } = usePlayerProfile();
  const { saveCity, loadCity } = useCityBuilder();
  const [selectedStructure, setSelectedStructure] = useState<StructureType | null>(null);
  const [grid, setGrid] = useState<(StructureType | null)[][]>(
    Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null))
  );

  useEffect(() => {
    const loadSavedCity = async () => {
      const savedCity = await loadCity();
      if (savedCity && savedCity.length === GRID_SIZE) {
        setGrid(savedCity);
      }
    };
    loadSavedCity();
  }, []);

  const handleCellClick = async (row: number, col: number) => {
    if (!selectedStructure) {
      toast.info('Select a structure first');
      return;
    }

    if (grid[row][col]) {
      toast.info('Cell already occupied');
      return;
    }

    const structure = structures.find((s) => s.type === selectedStructure);
    if (!structure) return;

    const coins = Number(profile?.totalCoins || 0);
    if (coins < structure.cost) {
      toast.error('Not enough coins!');
      return;
    }

    const newGrid = grid.map((r, i) =>
      i === row ? r.map((c, j) => (j === col ? selectedStructure : c)) : r
    );
    setGrid(newGrid);

    try {
      await saveCity(newGrid, structure.cost);
      toast.success(`${structure.name} built!`);
    } catch (error) {
      toast.error('Failed to save city');
      setGrid(grid);
    }
  };

  const getStructureInfo = (type: StructureType | null) => {
    if (!type) return null;
    return structures.find((s) => s.type === type);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate({ to: '/' })} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Hub
        </Button>
        <h1 className="text-3xl font-black">CITY BUILDER</h1>
        <div className="w-24" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Your City</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-2">
              {grid.map((row, i) =>
                row.map((cell, j) => {
                  const structureInfo = getStructureInfo(cell);
                  const Icon = structureInfo?.icon;
                  return (
                    <button
                      key={`${i}-${j}`}
                      onClick={() => handleCellClick(i, j)}
                      className={`aspect-square rounded-lg border-2 transition-all hover:scale-105 ${
                        cell
                          ? `${structureInfo?.color} border-border`
                          : 'border-dashed border-muted-foreground/30 bg-muted/20 hover:bg-muted/40'
                      }`}
                    >
                      {Icon && <Icon className="mx-auto h-8 w-8" />}
                    </button>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Structures</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {structures.map((structure) => {
              const Icon = structure.icon;
              return (
                <Button
                  key={structure.type}
                  variant={selectedStructure === structure.type ? 'default' : 'outline'}
                  className="w-full justify-start gap-3"
                  onClick={() => setSelectedStructure(structure.type)}
                >
                  <Icon className="h-5 w-5" />
                  <div className="flex-1 text-left">
                    <div className="font-bold">{structure.name}</div>
                    <div className="text-xs text-muted-foreground">{structure.cost} coins</div>
                  </div>
                </Button>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
