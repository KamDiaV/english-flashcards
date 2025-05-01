import React from 'react';
import { useNavigate } from 'react-router-dom';

function AddWord() {
  const navigate = useNavigate();

  return (
    <div>
      <button onClick={() => navigate(-1)} style={{ marginBottom: '20px' }}>
        ← Назад
      </button>
      <h2>Добавление нового слова</h2>
    </div>
  );
}

export default AddWord;
