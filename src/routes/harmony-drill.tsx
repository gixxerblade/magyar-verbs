import { createFileRoute } from '@tanstack/react-router'
import { HarmonyDrillPage } from '../pages/harmony-drill'

export const Route = createFileRoute('/harmony-drill')({
  component: HarmonyDrillPage,
})
