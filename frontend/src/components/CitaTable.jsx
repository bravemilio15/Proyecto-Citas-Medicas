import React from 'react';
import Button from './ui/Button.jsx';
import './CitaTable.css';

const CitaTable = ({ citas, onCancelar, onVerDetalles }) => (
  <table className="cita-table">
    <thead>
      <tr>
        <th>Fecha</th>
        <th>Hora</th>
        <th>Doctor</th>
        <th>Estado</th>
        <th>Notas</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      {citas.map(cita => (
        <tr key={cita.id}>
          <td>{cita.fecha}</td>
          <td>{cita.hora}</td>
          <td>{cita.doctorNombre || cita.doctorId}</td>
          <td>{cita.estado}</td>
          <td className="cita-notes-cell">
            {(cita.notas || cita.motivo) ? (
              <span title={cita.notas || cita.motivo}>
                {(cita.notas || cita.motivo).length > 50 
                  ? `${(cita.notas || cita.motivo).substring(0, 50)}...` 
                  : (cita.notas || cita.motivo)
                }
              </span>
            ) : (
              <span className="no-notes">Sin notas</span>
            )}
          </td>
          <td>
            {onCancelar && cita.estado === 'pendiente' && (
              <Button onClick={() => onCancelar(cita.id)} className="cita-btn-cancelar">Cancelar</Button>
            )}
            {onVerDetalles && (
              <Button onClick={() => onVerDetalles(cita.id)} className="cita-btn-detalles">Ver detalles</Button>
            )}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default CitaTable;
