import React from 'react';
// Aquí puedes importar Chart.js o ApexCharts según prefieras

const EstadisticasPanel = ({ stats }) => (
  <div className="estadisticas-panel">
    <h3>Estadísticas</h3>
    <div className="estadisticas-cards">
      <div className="estadistica-card">Total: {stats.total}</div>
      <div className="estadistica-card">Pendientes: {stats.pendientes}</div>
      <div className="estadistica-card">Completadas: {stats.completadas}</div>
      <div className="estadistica-card">Canceladas: {stats.canceladas}</div>
    </div>
    {/* Aquí puedes agregar tus gráficas */}
  </div>
);

export default EstadisticasPanel;
