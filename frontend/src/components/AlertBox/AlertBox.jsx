import React, { useState } from 'react';
import './AlertBox.css'

function AlertBox({ message, isOpen }) {
  return (
    <div>
      <dialog open={isOpen}>
        <p>{message}</p>
      </dialog>
    </div>
  );
}

export default AlertBox;

