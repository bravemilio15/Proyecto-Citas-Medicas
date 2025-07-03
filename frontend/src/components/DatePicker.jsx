import React from 'react';

const DatePicker = ({ value, onChange, minDate, diasDisponibles = [] }) => {
  // minDate en formato yyyy-mm-dd
  const min = minDate ? minDate.toISOString().slice(0, 10) : undefined;

  // Validar si el día está disponible
  const isDayAvailable = (dateStr) => {
    if (!diasDisponibles.length) return true;
    const d = new Date(dateStr);
    return diasDisponibles.includes(d.getDay());
  };

  return (
    <div className="form-group">
      <label htmlFor="fecha">Fecha</label>
      <input
        type="date"
        id="fecha"
        name="fecha"
        value={value}
        min={min}
        onChange={e => {
          // Solo permitir días disponibles
          if (isDayAvailable(e.target.value)) {
            onChange(e.target.value);
          } else {
            onChange('');
          }
        }}
        required
      />
    </div>
  );
};

export default DatePicker;
