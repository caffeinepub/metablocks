import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';

export function usePlayerProfile() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery({
    queryKey: ['playerProfile', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity || identity.getPrincipal().isAnonymous()) {
        return null;
      }
      try {
        const profile = await actor.getPlayerData(identity.getPrincipal());
        return profile;
      } catch (error) {
        console.error('Failed to fetch player profile:', error);
        return null;
      }
    },
    enabled: !!actor && !isFetching && !!identity && !identity.getPrincipal().isAnonymous(),
    staleTime: 5000,
  });
}
