import { createFileRoute } from '@tanstack/react-router'
import { VerbLab } from '../pages/verb-lab'

export const Route = createFileRoute('/verb-lab')({
  component: VerbLab,
})
