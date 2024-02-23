import React from 'react';
import { FaRegEdit, FaRegCopy, FaRegTrashAlt } from "react-icons/fa";
interface Position {
  x: number;
  y: number;
}

interface ActionsBoxProps {
  position: Position;
  darkTheme?: boolean;
}

const ActionsMenu: React.FC<ActionsBoxProps> = ({ position, darkTheme = false }) => {
  const actionsBoxStyle: React.CSSProperties = {
    width: '135px',
    height: '150px',
    position: 'absolute',
    padding: '10px',
    borderRadius: '12px',
    gap: '5px',
    boxShadow: '0px 4px 3px rgba(0, 0, 0, 0.2)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    left: `${position?.x}px`,
    top: `${position?.y}px`,
  };

  const actionButton = {
    backgroundColor: 'transparent',
    display: 'flex',
    justifyContent: 'flex-start',
    gap: '10px',
    w: '125px',
    padding: '6px 12px 6px 12px',
    borderRadius: '8px',
    border: '1px solid #efefef',
    cursor: 'pointer',
    _hover: {
      backgroundColor: '#f7f7f7'
    }
  }

  return (
    <div id="actionsBox" style={actionsBoxStyle}>
      <button onClick={() => console.log('edit')} style={actionButton}>
        <FaRegEdit />
        <span>Edit</span>
      </button>
      <button onClick={() => console.log('copy')} style={actionButton}>
        <FaRegCopy />
        <span>Copy</span>
      </button>
      <button onClick={() => console.log('delete')} style={actionButton}>
        <FaRegTrashAlt />
        <span>Delete</span>
      </button>
    </div>
  );
};

export default ActionsMenu;