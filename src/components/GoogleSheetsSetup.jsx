import React, { useState } from 'react';
import apiService from '../lib/api';

function GoogleSheetsSetup() {
  const [sheetId, setSheetId] = useState('');
  const [message, setMessage] = useState('');

  const handleAuth = async () => {
    try {
      await apiService.authenticateSheets();
      setMessage('Redirigiendo para autenticar...');
    } catch (err) {
      setMessage('Error autenticando');
    }
  };

  const handleSetSheet = async () => {
    try {
      await apiService.setSpreadsheetConfig(sheetId);
      setMessage('Hoja configurada correctamente');
    } catch (err) {
      setMessage('Error al enviar hoja');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Configuración de Google Sheets</h2>
      <button onClick={handleAuth}>🔐 Autenticar</button>
      <br /><br />
      <input
        value={sheetId}
        onChange={(e) => setSheetId(e.target.value)}
        placeholder="ID de Google Sheet"
      />
      <button onClick={handleSetSheet}>📄 Enviar ID</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default GoogleSheetsSetup;
