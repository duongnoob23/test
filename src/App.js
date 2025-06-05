import "./styles.css";
import { BrowserRouter as Router } from "react-router-dom";
import AppLayout from "./Routes/AppLayout";

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
