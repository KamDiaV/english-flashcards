import React from 'react'
import { useTestGameLogic } from '../../../hooks/words/game/useTestGameLogic'
import { TestGameUI } from './TestGameUI'

export default function TestGame({ words }) {
  const logic = useTestGameLogic(words)

  return <TestGameUI {...logic} wordsLength={words.length} />
}
