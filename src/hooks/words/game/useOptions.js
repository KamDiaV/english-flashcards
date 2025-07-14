import { useMemo } from 'react';
import shuffle from '../../../utils/shuffle';

export function useOptions(allWords, words, safeIndex, direction) {
  return useMemo(() => {
    if (!Array.isArray(words) || !words.length ||
        safeIndex < 0 || safeIndex >= words.length) {
      return { options: [], correctAnswer: null };
    }

    const word = words[safeIndex];
    if (!word) return { options: [], correctAnswer: null };

    const correctVal   = direction === 'en-ru' ? word.russian : word.english;
    const correctLower = correctVal.toLowerCase?.() ?? '';

    const poolRaw = (Array.isArray(allWords) ? allWords : [])
      .filter(w => w.id !== word.id)
      .map(w => (direction === 'en-ru' ? w.russian : w.english))
      .filter(t => !!t && t.toLowerCase() !== correctLower);

    const pool = shuffle([...new Set(poolRaw)]);  

    const distractors = pool.slice(0, 3);

    let options = [correctVal, ...distractors];

    while (options.length < 4) {
      const filler = options[Math.floor(Math.random() * options.length)];
      options.push(filler);
    }

    if (options.length > 4) {
      options = shuffle(options).slice(0, 4);
    } else {
      options = shuffle(options);  
    }

    return {
      options,
      correctAnswer: correctLower,
    };
  }, [allWords, words, safeIndex, direction]);
}
