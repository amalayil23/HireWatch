import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import MyNavbar from './Navbar.js';

function App() {
  return (
    <div className="App">
      <MyNavbar />
      <header className="App-header">
        <h1>Welcome to HireWatch</h1>
        <p>Join us for on your dream job hunt</p>
      </header>
    </div>
  );
}

export default App;