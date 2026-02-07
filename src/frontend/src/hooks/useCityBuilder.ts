import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import { StructureType } from '../backend';

export function useCityBuilder() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  const saveCityMutation = useMutation({
    mutationFn: async ({ layout, cost }: { layout: (StructureType | null)[][]; cost: number }) => {
      if (!actor || !identity || identity.getPrincipal().isAnonymous()) {
        throw new Error('Not authenticated');
      }
      // This is a simplified implementation - in a real app, you'd need backend support for city layout
      await actor.createOrUpdatePlayerData(null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playerProfile'] });
    },
  });

  return {
    saveCity: (layout: (StructureType | null)[][], cost: number) =>
      saveCityMutation.mutateAsync({ layout, cost }),
    loadCity: async () => {
      if (!actor || !identity || identity.getPrincipal().isAnonymous()) return null;
      try {
        const profile = await actor.getPlayerData(identity.getPrincipal());
        return profile.cityLayout || null;
      } catch {
        return null;
      }
    },
  };
}
