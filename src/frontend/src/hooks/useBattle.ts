import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import { GameMode } from '../backend';

export function useBattle() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  const statsQuery = useQuery({
    queryKey: ['battleStats', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity || identity.getPrincipal().isAnonymous()) return null;
      try {
        const profile = await actor.getPlayerData(identity.getPrincipal());
        return profile.battleStats || null;
      } catch {
        return null;
      }
    },
    enabled: !!actor && !!identity && !identity.getPrincipal().isAnonymous(),
  });

  const saveWinMutation = useMutation({
    mutationFn: async () => {
      if (!actor || !identity || identity.getPrincipal().isAnonymous()) {
        throw new Error('Not authenticated');
      }
      await actor.startGame(GameMode.battle);
      await actor.updateGame(BigInt(50));
      await actor.endGame();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playerProfile'] });
      queryClient.invalidateQueries({ queryKey: ['battleStats'] });
    },
  });

  return {
    saveWin: () => saveWinMutation.mutateAsync(),
    stats: statsQuery.data,
  };
}
