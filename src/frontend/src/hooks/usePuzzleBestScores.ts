import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import { GameMode } from '../backend';

export function usePuzzleBestScores() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  const saveBestScoreMutation = useMutation({
    mutationFn: async ({ mode, score }: { mode: GameMode; score: number }) => {
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
    saveBestScore: (mode: GameMode, score: number) =>
      saveBestScoreMutation.mutateAsync({ mode, score }),
    isSaving: saveBestScoreMutation.isPending,
  };
}
