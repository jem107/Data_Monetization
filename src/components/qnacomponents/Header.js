import React, { Component } from 'react';

class Header extends Component {
    render() {
        return (
            <header className="header">
                <div className="container">
                    <h1>Select Your Data Monetization Strategy</h1>
                    <nav className="navbar">
                        <a href="/">Home</a>
                    </nav>
                </div>
            </header>
        );
    }
}

export default Header;