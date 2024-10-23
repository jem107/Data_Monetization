import React, { Component } from 'react';
import Modal from 'react-modal';
import './ResultSection.css';

// Set the root element for accessibility
Modal.setAppElement('#root');

class ResultSection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isModalOpen: false,
            documentContent: null,
            selectedGuideline: null,
        };
    }

    // Function to open the modal and fetch the document content
    openModal = (guideline) => {
        if (guideline) { // Ensure the guideline is valid
            this.setState({ isModalOpen: true, selectedGuideline: guideline }, () => {
                this.fetchDocumentContent(guideline);
            });
        }
    };

    // Function to close the modal
    closeModal = () => {
        this.setState({ isModalOpen: false, documentContent: null });
    };

    // Function to fetch the document content based on the selected guideline
    fetchDocumentContent = (guideline) => {
        const documentUrl = `/guidelines/${guideline.replace(/\s+/g, '_')}.docx`; // Adjust the filename format as needed

        // Google Docs Viewer for fetching and viewing the document in an iframe
        const googleDocsUrl = `https://docs.google.com/gview?url=${window.location.origin}${documentUrl}&embedded=true`;

        // Update state to display the document
        this.setState({ documentContent: googleDocsUrl });
    };

    render() {
        const { isModalOpen, documentContent, selectedGuideline } = this.state;
        const { bestStrategy } = this.props; // Assuming bestStrategy is passed as a prop from the parent

        return (
            <section id="result-section" className="result">
                <div className="container">
                    <h2>Your Best Matching Strategy is:</h2>
                    <p id="result">{bestStrategy || "Your Result Goes Here"}</p>

                    {/* Show button only if a strategy is available */}
                    {bestStrategy && (
                        <button
                            className="guidelines-btn"
                            onClick={() => this.openModal(bestStrategy)}
                        >
                            View {bestStrategy} Guidelines
                        </button>
                    )}

                    {/* Modal to display the document content */}
                    <Modal
                        isOpen={isModalOpen}
                        onRequestClose={this.closeModal}
                        contentLabel="Guideline Document"
                        className="guideline-modal"
                        overlayClassName="guideline-overlay"
                    >
                        <h2>{selectedGuideline} Guidelines</h2>
                        {documentContent ? (
                            <iframe
                                src={documentContent}
                                width="100%"
                                height="600px"
                                title="Guideline Document"
                            ></iframe>
                        ) : (
                            <p>Loading document...</p>
                        )}
                        <button className="close-btn" onClick={this.closeModal}>
                            Close
                        </button>
                    </Modal>
                </div>
            </section>
        );
    }
}

export default ResultSection;
