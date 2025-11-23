// ============================================
// APP - MAIN APPLICATION COMPONENT
// ============================================

import { RouterProvider } from 'react-router-dom';
import { router } from './app/router';
import './App.scss';

function App() {
  return <RouterProvider router={router} />;
}

export default App;
