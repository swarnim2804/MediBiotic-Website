import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <h2 className="logo">MediBiotic</h2>
      <ul className="nav-links">
        <li><Link to="/medibot">Medibot</Link></li>
        <li><Link to="/nearby">Nearby Services</Link></li>
        <li><Link to="/wellbeing">Wellbeing Monitor</Link></li>
        <li><Link to="/records">Health Records</Link></li>
        <li><Link to="/sos">SOS Reminders</Link></li>
        <li><Link to="/exercise">Exercise Tracker</Link></li>
        <li><Link to="/forum">Community Forum</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;

