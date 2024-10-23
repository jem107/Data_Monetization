import React, { Component } from 'react';
import './QnASection.css';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { Link } from 'react-router-dom';

class QnASection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentQuestionIndex: 0,
            selectedAnswers: [],
            currentQuestionAnswers: [],
            questions: [],
            strategies: [],
            resultText: '',
            guidelineSrc: '',
            strategyDistribution: {}
        };
    }

    componentDidMount() {
        // Fetch CSV data
        const csvUrl = `${process.env.PUBLIC_URL}/questions.csv`;
        fetch(csvUrl)
            .then(response => response.text())
            .then(csvText => this.processCSV(csvText))
            .catch(error => console.error('Error fetching CSV:', error));
    }

    // Custom function to split the CSV row but keep content inside parentheses together
    smartSplit(row) {
        const regex = /(?:\([^()]*\)|[^,])+/g;
        return row.match(regex).map(part => part.trim());
    }

    // Function to capitalize the first letter and remove special characters
    cleanAnswer(answer) {
        return answer
            .replace(/[^a-zA-Z0-9\s]/g, '') // Remove special characters
            .trim() // Trim whitespace
            .replace(/^\w/, c => c.toUpperCase()); // Capitalize the first letter
    }

    processCSV(csvText) {
        const rows = csvText.split('\n').map(row => this.smartSplit(row));
        const strategies = rows[0].slice(1); // First row contains strategy names

        let questions = [];
        for (let i = 1; i < rows.length; i++) {
            const question = rows[i][0];
            let answers = rows[i].slice(1).map(answer => this.cleanAnswer(answer)); // Clean answers

            // Map answers to corresponding strategies
            let answersMappedToStrategies = answers.map((answer, index) => ({
                answer,
                strategy: strategies[index]
            }));

            questions.push({ question, answers: answersMappedToStrategies });
        }

        this.setState({ questions, strategies });
    }

    calculateResult() {
        const { selectedAnswers, strategies } = this.state;
        let strategyScores = strategies.reduce((acc, strategy) => ({ ...acc, [strategy]: 0 }), {}); // Initialize score object
    
        // Calculate score for each selected answer
        selectedAnswers.forEach(selectedAnswerObj => {
            // Check if the answer corresponds to a strategy and increment the score
            if (selectedAnswerObj.strategy && strategyScores[selectedAnswerObj.strategy] !== undefined) {
                strategyScores[selectedAnswerObj.strategy]++;
            }
        });
    
        const maxScore = Math.max(...Object.values(strategyScores)); // Get max score
        const bestStrategies = Object.keys(strategyScores).filter(strategy => strategyScores[strategy] === maxScore); // Find strategies with max score
    
        // Set the result text
        const resultText = bestStrategies.length === 0
            ? "No strategies could be determined based on your answers."
            : `Best Strategies: ${bestStrategies.join(', ')}`;
    
        // Set the guideline source based on all the best strategies
        const guidelineSrc = bestStrategies.length > 0
            ? bestStrategies.map(strategy => `./guidelines/${strategy.replace(/\s/g, '-')}.pdf`)
            : [];
    
        // Update strategy distribution for the pie chart
        this.setState({
            resultText,
            guidelineSrc,
            strategyDistribution: strategyScores
        });
    }
    
    handleAnswerChange = (event, answerObj) => {
        const { currentQuestionAnswers } = this.state;
    
        if (event.target.checked) {
            this.setState({ currentQuestionAnswers: [...currentQuestionAnswers, answerObj] });
        } else {
            this.setState({ currentQuestionAnswers: currentQuestionAnswers.filter(answer => answer !== answerObj) });
        }
    };
    
    // Update the nextQuestion method to include strategy in selected answers
    nextQuestion = () => {
        const { currentQuestionIndex, questions, currentQuestionAnswers } = this.state;
    
        if (currentQuestionAnswers.length === 0) {
            alert('Please select at least one answer.');
            return;
        }
    
        // Include strategy information in the selected answers
        this.setState((prevState) => ({
            selectedAnswers: [...prevState.selectedAnswers, ...currentQuestionAnswers.map(answer => ({
                answer: answer.answer,
                strategy: answer.strategy
            }))],
            currentQuestionAnswers: [], // Reset current question answers
            currentQuestionIndex: prevState.currentQuestionIndex + 1
        }), () => {
            if (this.state.currentQuestionIndex >= questions.length - 1) {
                this.calculateResult();
            }
        });
    };
    

    handleNextClick = () => {
        this.nextQuestion();
    };

    renderPieChart() {
        const { strategyDistribution } = this.state;

        // Prepare data for the Pie chart
        const data = Object.entries(strategyDistribution).map(([strategy, count]) => ({
            name: strategy,
            value: count,
        })).filter(item => item.value > 0); // Filter out strategies with zero count

        const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];

        return (
            <div className="pie-chart-container">
                <h4>Strategy Distribution</h4>
                <PieChart width={400} height={400}>
                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={80}
                        fill="#8884d8"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </div>
        );
    }

    render() {
        const { currentQuestionIndex, questions, resultText, currentQuestionAnswers, guidelineSrc } = this.state;
        const currentQuestion = questions[currentQuestionIndex];
    
        return (
            <section id="qna" className="qna">
                <div className="container">
                    {resultText ? (
                        <div id="result-section" className="result-section">
                            <h3>{resultText}</h3>
                            {guidelineSrc.length > 0 && (
                                <div>
                                    <h4>Guidelines:</h4>
                                    <ul>
                                        {guidelineSrc.map((src, index) => {
                                            const strategyName = src.split('/').pop().replace(/\.pdf$/, '').replace(/-/g, ' ');
                                            return (
                                                <li key={index}>
                                                    <a
                                                        href={src}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        {strategyName}
                                                    </a>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            )}
                            <div className="guidelines-text-container">
                                <p className="guidelines-info-text">
                                    Want to explore more? You can view all the guidelines to better understand the strategies and how to apply them.
                                </p>
                                <Link to="/guideline-list" className="view-guidelines-btn">
                                    View All Guidelines
                                </Link>
                            </div>
                            {this.renderPieChart()} {/* Render the pie chart */}
                        </div>
                    ) : (
                        <>
                            <h2 id="question-title" className="question-title">
                                Answer the questions to determine the best strategy for your data
                            </h2>
                            {currentQuestion ? (
                                <div className="question-container active">
                                    <h3 className="question-text">{currentQuestion.question}</h3>
                                    {currentQuestion.answers.map((answerObj, index) => (
                                        <label key={index} className="answer-label">
                                            <input
                                                type="checkbox"
                                                value={answerObj.answer}
                                                name={`question-${currentQuestionIndex}`}
                                                onChange={(e) => this.handleAnswerChange(e, answerObj)}
                                                checked={currentQuestionAnswers.includes(answerObj)}
                                            />
                                            <span className="checkmark"></span>
                                            {answerObj.answer}
                                        </label>
                                    ))}
                                    <button id="next-btn" className="next-btn" onClick={this.handleNextClick}>
                                        Next
                                    </button>
                                </div>
                            ) : (
                                <p>Loading questions...</p>
                            )}
                        </>
                    )}
                </div>
            </section>
        );
    }    
}

export default QnASection;
