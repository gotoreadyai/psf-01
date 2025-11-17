import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CreateInvoice } from './pages/CreateInvoice';
import { ManageInvoices } from './pages/ManageInvoices';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CreateInvoice />} />
        <Route path="/manage" element={<ManageInvoices />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
