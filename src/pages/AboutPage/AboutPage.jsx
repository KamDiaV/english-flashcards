import React from 'react';
import styles from './AboutPage.module.scss';

const features = [
  {
    icon: '📥',
    title: 'Собирайте свой словарь',
    description: 'Добавляйте новые слова, редактируйте переводы и удаляйте ненужные.',
  },
  {
    icon: '🃏',
    title: 'Flip Card',
    description: 'Учите слова с «перевёртышами», запоминая перевод кликом по карточке.',
  },
  {
    icon: '✍️',
    title: 'Тестовый режим',
    description: 'Проверяйте себя с вариантами ответов и сразу видьте результат.',
  },
  {
    icon: '📈',
    title: 'Персональный трекер',
    description:
      'Локально сохраняйте статистику — сколько раз вы уже повторили слово и насколько хорошо его знаете.',
  },
  {
    icon: '⚙️',
    title: 'Гибкая настройка',
    description: 'Выбирайте направление (англ→рус или рус→англ)',
  }
];

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Добро пожаловать в Vocardo!</h1>
      <p className={styles.text}>
        Vocardo — ваш персональный помощник в изучении английских слов. Повышайте
        словарный запас в удобном формате и отслеживайте прогресс на каждом шаге.
      </p>

      <div className={styles.cards}>
        {features.map(({ icon, title, description }) => (
          <div key={title} className={styles.card}>
            <div className={styles.icon}>{icon}</div>
            <h3 className={styles.cardTitle}>{title}</h3>
            <p className={styles.cardDescription}>{description}</p>
          </div>
        ))}
      </div>

      <p className={styles.text}>
        Готовы начать? Добавляйте слова и приступайте к изучению прямо сейчас!
      </p>
    </div>
  );
}
