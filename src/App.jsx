import Signup from "./Pages/Signup";
import Dashboard from "./Pages/Dashboard";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
function App() {
  return (
    <div>
      {/* <Router>
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/" exact component={Signup} />
    </Router> */}
      <Router>
        <Routes>
          <Route exact path="/" element={<Signup />}></Route>
          <Route exact path="/dashboard" element={<Dashboard />}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
