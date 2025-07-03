import React from 'react';
import Button from './ui/Button.jsx';
import './CitaCard.css';

const CitaCard = ({ cita, onCancelar, onVerDetalles }) => (
  <div className="cita-card">
    <div>
      <strong>Fecha:</strong> {cita.fecha} <strong>Hora:</strong> {cita.hora}
    </div>
    <div>
      <strong>Doctor:</strong> {cita.doctorNombre || cita.doctorId}
    </div>
    <div>
      <strong>Estado:</strong> {cita.estado}
    </div>
    {(cita.notas || cita.motivo) && (
      <div className="cita-notes">
        <strong>Notas:</strong> {cita.notas || cita.motivo}
      </div>
    )}
    <div className="cita-card-actions">
      {onCancelar && cita.estado === 'pendiente' && (
        <Button onClick={() => onCancelar(cita.id)} className="cita-btn-cancelar">Cancelar</Button>
      )}
      {onVerDetalles && (
        <Button onClick={() => onVerDetalles(cita.id)} className="cita-btn-detalles">Ver detalles</Button>
      )}
    </div>
  </div>
);

export default CitaCard;
