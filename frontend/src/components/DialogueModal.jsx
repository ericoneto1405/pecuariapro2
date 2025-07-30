// frontend/src/components/DialogueModal.jsx

import React from 'react';

function DialogueModal({ isOpen, onClose, npcName, dialogueText }) {
  if (!isOpen) {
    return null;
  }

  return (
    // Backdrop
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0, 0, 0, 0.7)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center',
      padding: '24px'
    }}>
      {/* Modal Content */}
      <div style={{
        background: '#181a1f',
        border: '1px solid #374151',
        borderRadius: '12px',
        padding: '24px',
        width: '100%',
        maxWidth: '700px',
        color: '#fff',
        boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
        animation: 'slideUp 0.3s ease-out'
      }}>
        <h3 style={{ color: '#90caf9', margin: '0 0 8px 0', fontSize: '1.2rem' }}>
          {npcName} diz:
        </h3>
        <p style={{ color: '#e0e0e0', fontSize: '1rem', lineHeight: '1.6', margin: '0 0 20px 0' }}>
          "{dialogueText}"
        </p>
        <button
          onClick={onClose}
          style={{
            background: '#1976d2',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 20px',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '1rem',
            width: '100%'
          }}
        >
          Fechar
        </button>
      </div>
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default DialogueModal; 