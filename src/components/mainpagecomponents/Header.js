import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; 

class Header extends Component {
    render() {
        return (
            <header className="header">
                <div className="headercontainer">
                    <h1 className="header-title">Data Monetization Strategies</h1>
                    <nav className="navbar">
                        <Link className="nav-link" to="/">Home</Link>
                        <Link className="nav-link" to="/about">About</Link>
                        <Link className="nav-link" to="/quotes">Quotes</Link>
                        <Link className="nav-link" to="/getStarted">Get Started</Link>
                    </nav>
                </div>
            </header>
        );
    }
}

export default Header;
