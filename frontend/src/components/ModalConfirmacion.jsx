import React from 'react';
import './ModalConfirmacion.css';

const ModalConfirmacion = ({ open, mensaje, onConfirmar, onCancelar }) => {
  if (!open) return null;
  return (
    <div className="modal-confirmacion-backdrop">
      <div className="modal-confirmacion">
        <p>{mensaje}</p>
        <div className="modal-confirmacion-actions">
          <button onClick={onConfirmar} className="btn-confirmar">Confirmar</button>
          <button onClick={onCancelar} className="btn-cancelar">Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmacion;
