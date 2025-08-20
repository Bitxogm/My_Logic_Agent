import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './index.css';

// 1. Importa 'toast' y 'Toaster'
import toast, { Toaster } from 'react-hot-toast';

function App() {
  const [count, setCount] = useState(0);

  // Función para mostrar la notificación
  const notify = () => toast('¡Hola! Soy una tostada.');

  return (
    <>
      {/* 2. Coloca el componente <Toaster /> en la raíz */}
      <Toaster />
      
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <h1 className="text-3xl font-bold underline  bg-red-500 ">
        Hello world!
      </h1>
      <button className="btn btn-circle w-3xl ">daisy</button>
      
      {/* 3. Añade la función de 'toast' al evento onClick */}
      <button onClick={notify} className="btn btn-primary w-3xl ">
        Mostrar Toast
      </button>
      
      <button className="btn btn-secondary w-3xl ">daisy</button>
      <button className="btn btn-circle w-3xl ">daisy</button>

      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App