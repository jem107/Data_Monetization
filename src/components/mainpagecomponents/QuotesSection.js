import React, { Component } from 'react';

class QuotesSection extends Component {
    render() {
        return (
            <section id="quotes" className="quotes">
                <div className="container">
                    <h2>Quotes on Data</h2>
                    <blockquote>
                        <p>"Data is the new oil." - Clive Humby</p>
                    </blockquote>
                    <blockquote>
                        <p>"Without data, you're just another person with an opinion." - W. Edwards Deming</p>
                    </blockquote>
                </div>
            </section>
        );
    }
}

export default QuotesSection;