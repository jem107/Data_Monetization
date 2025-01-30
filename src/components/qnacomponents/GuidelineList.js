import React, { useEffect, useState } from 'react';
import './GuidelineList.css';  // Import custom CSS for this component

const GuidelineList = () => {
    const [guidelines, setGuidelines] = useState([]);

    useEffect(() => {
        const fetchGuidelines = async () => {
            try {
                //const response = await fetch(`${process.env.PUBLIC_URL}/guidelines.json`);
                const response = await fetch(`/guidelines.json`);
                const data = await response.json();
                setGuidelines(data);
            } catch (error) {
                console.error('Error fetching guidelines:', error);
            }
        };

        fetchGuidelines();
    }, []);

    return (
        <section id="guideline-list-section" className="guideline-list-section">
            <div className="container">
                <h2 className="section-title">All Guidelines</h2>
                <ul className="guideline-list">
                    {guidelines.map((guideline, index) => (
                        <li key={index} className="guideline-item">
                            <a
                                href={`${process.env.PUBLIC_URL}/guidelines/${guideline.file}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="guideline-link"
                            >
                                {guideline.name}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
};

export default GuidelineList;
