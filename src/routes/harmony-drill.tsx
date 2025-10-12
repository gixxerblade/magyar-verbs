import {createFileRoute} from '@tanstack/react-router';
import {customVerbsQueryOptions} from '../hooks/useCustomVerbs';
import {HarmonyDrillPage} from '../pages/harmony-drill';

export const Route = createFileRoute('/harmony-drill')({
  loader: ({context: {queryClient}}) => queryClient.ensureQueryData(customVerbsQueryOptions),
  component: HarmonyDrillPage,
});
