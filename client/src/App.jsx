import { BrowserRouter, Routes, Route } from "react-router-dom";
import ClientPage from "./ClientPage";
import HostPage from "./HostPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/client" element={<ClientPage />} />
        <Route path="/host" element={<HostPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;