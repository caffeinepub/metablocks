import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Wheat, Carrot, Apple } from 'lucide-react';
import { useFarming } from '../../hooks/useFarming';
import { toast } from 'sonner';
import { CropType } from '../../backend';

const GRID_SIZE = 4;

const crops = [
  { type: CropType.wheat, name: 'Wheat', growTime: 10000, reward: 20, icon: Wheat, color: 'bg-chart-4' },
  { type: CropType.carrot, name: 'Carrot', growTime: 15000, reward: 35, icon: Carrot, color: 'bg-chart-1' },
  { type: CropType.tomato, name: 'Tomato', growTime: 20000, reward: 50, icon: Apple, color: 'bg-destructive' },
];

interface PlotState {
  crop: CropType | null;
  plantedAt: number | null;
}

export default function FarmingPage() {
  const navigate = useNavigate();
  const { saveFarm, loadFarm, harvestCrop } = useFarming();
  const [selectedCrop, setSelectedCrop] = useState<CropType | null>(null);
  const [plots, setPlots] = useState<PlotState[][]>(
    Array(GRID_SIZE).fill(null).map(() =>
      Array(GRID_SIZE).fill(null).map(() => ({ crop: null, plantedAt: null }))
    )
  );
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const loadSavedFarm = async () => {
      const savedFarm = await loadFarm();
      if (savedFarm && savedFarm.length === GRID_SIZE) {
        // Convert backend format to PlotState format
        const convertedPlots: PlotState[][] = savedFarm.map(row =>
          row.map(cell => ({
            crop: cell,
            plantedAt: cell ? Date.now() - 5000 : null // Approximate planted time
          }))
        );
        setPlots(convertedPlots);
      }
    };
    loadSavedFarm();
  }, []);

  const isReady = (plot: PlotState) => {
    if (!plot.crop || !plot.plantedAt) return false;
    const cropInfo = crops.find((c) => c.type === plot.crop);
    if (!cropInfo) return false;
    return currentTime - plot.plantedAt >= cropInfo.growTime;
  };

  const getGrowthProgress = (plot: PlotState) => {
    if (!plot.crop || !plot.plantedAt) return 0;
    const cropInfo = crops.find((c) => c.type === plot.crop);
    if (!cropInfo) return 0;
    const elapsed = currentTime - plot.plantedAt;
    return Math.min(100, (elapsed / cropInfo.growTime) * 100);
  };

  const handlePlotClick = async (row: number, col: number) => {
    const plot = plots[row][col];

    if (plot.crop && isReady(plot)) {
      const cropInfo = crops.find((c) => c.type === plot.crop);
      if (!cropInfo) return;

      const newPlots = plots.map((r, i) =>
        i === row ? r.map((p, j) => (j === col ? { crop: null, plantedAt: null } : p)) : r
      );
      setPlots(newPlots);

      try {
        await harvestCrop(newPlots, cropInfo.reward);
        toast.success(`Harvested ${cropInfo.name}! +${cropInfo.reward} coins`);
      } catch (error) {
        toast.error('Failed to harvest');
        setPlots(plots);
      }
      return;
    }

    if (plot.crop) {
      toast.info('Crop is still growing...');
      return;
    }

    if (!selectedCrop) {
      toast.info('Select a crop first');
      return;
    }

    const newPlots = plots.map((r, i) =>
      i === row ? r.map((p, j) => (j === col ? { crop: selectedCrop, plantedAt: Date.now() } : p)) : r
    );
    setPlots(newPlots);

    try {
      await saveFarm(newPlots);
      toast.success('Crop planted!');
    } catch (error) {
      toast.error('Failed to plant');
      setPlots(plots);
    }
  };

  const getCropInfo = (type: CropType | null) => {
    if (!type) return null;
    return crops.find((c) => c.type === type);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate({ to: '/' })} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Hub
        </Button>
        <h1 className="text-3xl font-black">FARMING</h1>
        <div className="w-24" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Your Farm</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-3">
              {plots.map((row, i) =>
                row.map((plot, j) => {
                  const cropInfo = getCropInfo(plot.crop);
                  const Icon = cropInfo?.icon;
                  const ready = isReady(plot);
                  const progress = getGrowthProgress(plot);
                  return (
                    <button
                      key={`${i}-${j}`}
                      onClick={() => handlePlotClick(i, j)}
                      className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all hover:scale-105 ${
                        plot.crop
                          ? ready
                            ? `${cropInfo?.color} border-border animate-pulse`
                            : 'border-border bg-muted'
                          : 'border-dashed border-muted-foreground/30 bg-muted/20 hover:bg-muted/40'
                      }`}
                    >
                      {Icon && <Icon className="mx-auto mt-2 h-10 w-10" />}
                      {plot.crop && !ready && (
                        <div className="absolute bottom-0 left-0 h-1 bg-chart-3" style={{ width: `${progress}%` }} />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Crops</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {crops.map((crop) => {
              const Icon = crop.icon;
              return (
                <Button
                  key={crop.type}
                  variant={selectedCrop === crop.type ? 'default' : 'outline'}
                  className="w-full justify-start gap-3"
                  onClick={() => setSelectedCrop(crop.type)}
                >
                  <Icon className="h-5 w-5" />
                  <div className="flex-1 text-left">
                    <div className="font-bold">{crop.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {crop.growTime / 1000}s • {crop.reward} coins
                    </div>
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
