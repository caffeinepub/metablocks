import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface ModeTileProps {
  title: string;
  icon: string;
  description: string;
  bestScore?: number;
  onClick: () => void;
}

export default function ModeTile({ title, icon, description, bestScore, onClick }: ModeTileProps) {
  return (
    <Card className="group overflow-hidden transition-all hover:scale-105 hover:shadow-xl">
      <CardContent className="p-0">
        <Button
          variant="ghost"
          className="h-full w-full flex-col gap-4 p-6 text-left"
          onClick={onClick}
        >
          <div className="flex w-full items-center justify-between">
            <img src={icon} alt={title} className="h-16 w-16 rounded-lg object-cover" />
            {bestScore !== undefined && bestScore > 0 && (
              <div className="rounded-full bg-accent px-3 py-1 text-xs font-bold">
                Best: {bestScore}
              </div>
            )}
          </div>
          <div className="w-full space-y-1">
            <h3 className="text-lg font-bold">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </Button>
      </CardContent>
    </Card>
  );
}
