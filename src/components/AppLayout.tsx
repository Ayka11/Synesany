import React from 'react';
import Header from '@/components/synth/Header';
import CanvasPage from '@/components/synth/CanvasPage';

const AppLayout: React.FC = () => {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header />
      <CanvasPage />
    </div>
  );
};

export default AppLayout;
