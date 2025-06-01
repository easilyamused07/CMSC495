import React from 'react';
import InjuryForm from './components/InjuryForm.tsx';

const App: React.FC = () => {
  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>AI First Aid Assistant</h1>
      <InjuryForm />
    </div>
  );
};

export default App;
