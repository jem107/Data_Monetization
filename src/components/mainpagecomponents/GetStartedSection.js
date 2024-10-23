import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class GetStartedSection extends Component {
  render() {

    return (
      <div>
        <section id="start" className="get-started">
            <div className="container">
                <h2>Ready to Choose Your Data Monetization Strategy?</h2>
                <p>
                    Click the button below to start answering questions and determine the best strategy for your data.
                </p>
                <Link to="/qna">
                    <button>
                        Let's Start to Select the Strategy
                    </button>
                </Link>
            </div>
        </section>
      </div>
    );
  }
}

export default GetStartedSection;