import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import { GameMode } from '../backend';

export function useGameProgress() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  const saveProgressMutation = useMutation({
    mutationFn: async ({ mode, score, coins }: { mode: GameMode; score: number; coins: number }) => {
      if (!actor || !identity || identity.getPrincipal().isAnonymous()) {
        throw new Error('Not authenticated');
      }
      await actor.startGame(mode);
      await actor.updateGame(BigInt(score));
      await actor.endGame();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playerProfile'] });
    },
  });

  return {
    saveProgress: (mode: GameMode, score: number, coins: number) =>
      saveProgressMutation.mutateAsync({ mode, score, coins }),
  };
}
