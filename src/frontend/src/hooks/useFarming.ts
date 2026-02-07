import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import { CropType } from '../backend';

interface PlotState {
  crop: CropType | null;
  plantedAt: number | null;
}

export function useFarming() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  const saveFarmMutation = useMutation({
    mutationFn: async (plots: PlotState[][]) => {
      if (!actor || !identity || identity.getPrincipal().isAnonymous()) {
        throw new Error('Not authenticated');
      }
      await actor.createOrUpdatePlayerData(null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playerProfile'] });
    },
  });

  const harvestMutation = useMutation({
    mutationFn: async ({ plots, reward }: { plots: PlotState[][]; reward: number }) => {
      if (!actor || !identity || identity.getPrincipal().isAnonymous()) {
        throw new Error('Not authenticated');
      }
      await actor.createOrUpdatePlayerData(null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playerProfile'] });
    },
  });

  return {
    saveFarm: (plots: PlotState[][]) => saveFarmMutation.mutateAsync(plots),
    harvestCrop: (plots: PlotState[][], reward: number) => harvestMutation.mutateAsync({ plots, reward }),
    loadFarm: async () => {
      if (!actor || !identity || identity.getPrincipal().isAnonymous()) return null;
      try {
        const profile = await actor.getPlayerData(identity.getPrincipal());
        return profile.farmPlots || null;
      } catch {
        return null;
      }
    },
  };
}
