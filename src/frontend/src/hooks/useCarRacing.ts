import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import { GameMode } from '../backend';

export function useCarRacing() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  const bestTimeQuery = useQuery({
    queryKey: ['carBestTime', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity || identity.getPrincipal().isAnonymous()) return null;
      try {
        const profile = await actor.getPlayerData(identity.getPrincipal());
        return profile.bestTime ? Number(profile.bestTime) : null;
      } catch {
        return null;
      }
    },
    enabled: !!actor && !!identity && !identity.getPrincipal().isAnonymous(),
  });

  const saveTimeMutation = useMutation({
    mutationFn: async (time: number) => {
      if (!actor || !identity || identity.getPrincipal().isAnonymous()) {
        throw new Error('Not authenticated');
      }
      await actor.startGame(GameMode.car);
      await actor.updateGame(BigInt(time));
      await actor.endGame();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playerProfile'] });
      queryClient.invalidateQueries({ queryKey: ['carBestTime'] });
    },
  });

  return {
    saveBestTime: (time: number) => saveTimeMutation.mutateAsync(time),
    bestTime: bestTimeQuery.data,
  };
}
