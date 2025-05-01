import React from 'react';
import { useNavigate } from 'react-router-dom';

function Train() {
  const navigate = useNavigate();

  return (
    <div>
      <button onClick={() => navigate(-1)} style={{ marginBottom: '20px' }}>
        ← Назад
      </button>
      <h2>Режим тренировки</h2>
    </div>
  );
}

export default Train;
