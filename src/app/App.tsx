import { useState } from 'react';
import TariffConfigurator from '../components/TariffConfigurator/TariffConfigurator';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <TariffConfigurator />
    </>
  );
}

export default App;
