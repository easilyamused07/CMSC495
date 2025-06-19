import React from 'react';
import InjuryForm from './components/InjuryForm_old.tsx';
import OpenAIComponent from './components/OpenAIComponent.tsx';


const App: React.FC = () => {
  return (
    /*
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>AI First Aid Assistant</h1>
      <InjuryForm />
    </div>
    */

   // src/App.js

    <div className="App">
      <OpenAIComponent />
    </div>
  )
};

export default App;
