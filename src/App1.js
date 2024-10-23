import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Footer from './components/mainpagecomponents/Footer';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentQuestionIndex: 0,
      selectedAnswers: [],
      questions: [],
      strategies: [],
    };
  }

  componentDidMount() {
    // Fetch the CSV file and load the questions
    const csvUrl = 'https://raw.githubusercontent.com/jem107/Data-Monetization-project/refs/heads/main/Q%26A%20Final.csv';
    
    fetch(csvUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then(csvText => {
        this.processCSV(csvText);
      })
      .catch(error => console.error('Error fetching CSV:', error));
  }

  // Custom function to split the CSV row but keep content inside parentheses together
  smartSplit(row) {
    const regex = /(?:\([^()]*\)|[^,])+/g;
    return row.match(regex).map(part => part.trim());
  }

  processCSV(csvText) {
    const rows = csvText.split('\n').map(row => this.smartSplit(row));

    // First row contains strategy names, so we'll store that
    const strategies = rows[0].slice(1);  // Ignore the first column (questions)

    let questions = [];

    // Process each row for questions and their respective answers
    for (let i = 1; i < rows.length; i++) {
      const question = rows[i][0];  // First column is the question
      let answers = rows[i].slice(1);  // Remaining columns are the answers

      // Clean up answers (trim spaces and keep everything inside parentheses intact)
      answers = answers.map(answer => answer.replace(/["']/g, '').trim());

      // Remove duplicate answers for display purposes, but track all possible answers later
      const uniqueAnswers = [...new Set(answers)];

      questions.push({ question, answers: uniqueAnswers, allAnswers: answers });
    }

    this.setState({ questions, strategies }, () => this.displayQuestion(0));
  }

  displayQuestion(index) {
    // This function is used to set the current question in the state for rendering
    this.setState({ currentQuestionIndex: index });
  }

  nextQuestion = () => {
    const { currentQuestionIndex, selectedAnswers, questions } = this.state;

    const checkboxes = document.querySelectorAll(`input[name=question-${currentQuestionIndex}]:checked`);

    if (checkboxes.length === 0) {
      alert('Please select at least one answer');
      return;
    }

    const newSelectedAnswers = [...selectedAnswers];

    checkboxes.forEach(checkbox => {
      newSelectedAnswers.push(checkbox.value);
    });

    this.setState(
      { selectedAnswers: newSelectedAnswers },
      () => {
        // Move to the next question or show the result
        if (currentQuestionIndex < questions.length - 1) {
          this.displayQuestion(currentQuestionIndex + 1);
        } else {
          this.calculateResult();
        }
      }
    );
  };

  calculateResult() {
    const { selectedAnswers, questions, strategies } = this.state;

    // Initialize score for each strategy
    let score = Array(strategies.length).fill(0);

    // Iterate over selected answers
    selectedAnswers.forEach(answer => {
      questions.forEach((q, questionIndex) => {
        q.allAnswers.forEach((ans, answerIndex) => {
          // Increment score for all strategies where the answer belongs
          if (answer === ans) {
            score[answerIndex]++;
          }
        });
      });
    });

    // Find the highest score
    const maxScore = Math.max(...score);

    // Find all strategies with the highest score
    const bestStrategies = strategies.filter((strategy, index) => score[index] === maxScore);

    // If no strategy is found, show a message instead of an empty result
    const resultText = bestStrategies.length === 0
      ? "No strategies could be determined based on your answers."
      : `Best Strategies: ${bestStrategies.join(', ')}`;

    // Show the result
    this.setState({ resultText });
  }

  render() {
    const { currentQuestionIndex, questions, resultText } = this.state;
    const currentQuestion = questions[currentQuestionIndex];

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1>Interactive Q&A</h1>
        </header>

        <div id="qna">
          {currentQuestion && (
            <div className="question-container active">
              <h3>{currentQuestion.question}</h3>
              {currentQuestion.answers.map((answer, index) => (
                <label key={index}>
                  <input type="checkbox" value={answer} name={`question-${currentQuestionIndex}`} />
                  {answer}
                </label>
              ))}
              <br />
              <button id="next-btn" onClick={this.nextQuestion}>
                Next
              </button>
            </div>
          )}
        </div>

        {resultText && (
          <div id="result-section">
            <h3>{resultText}</h3>
          </div>
        )}

      <Footer />
      </div>

      
    );
  }
}

export default App;
