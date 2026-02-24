import React from 'react';
import Sidebar from './Sidebar';
import DrawingCanvas from './DrawingCanvas';
import SonificationSelector from './SonificationSelector';
import StatusPanel from './StatusPanel';
import BottomBar from './BottomBar';

const CanvasPage: React.FC = () => {
  return (
    <div className="flex flex-1 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col relative overflow-hidden">
        <SonificationSelector />
        <StatusPanel />
        <DrawingCanvas />
        <BottomBar />
      </div>
    </div>
  );
};

export default CanvasPage;
