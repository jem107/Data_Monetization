import React, { Component } from 'react';
import './App.css'; 
import AboutSection from './components/mainpagecomponents/AboutSection';
import Header from './components/mainpagecomponents/Header';
import QuotesSection from './components/mainpagecomponents/QuotesSection';
import GetStartedSection from './components/mainpagecomponents/GetStartedSection';
import Footer from './components/mainpagecomponents/Footer';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import QnASection from './components/qnacomponents/QnASection';
import GuidelineList from './components/qnacomponents/GuidelineList';

class App extends Component {
  render() {
    return (
        <BrowserRouter>
            <div className="App">
            <Header />
            <Routes>
                <Route path="/" element={<MainContent />} />
                <Route path="/about" element={<AboutSection />} />
                <Route path="/quotes" element={<QuotesSection />} />
                <Route path="/getStarted" element={<GetStartedSection />} />
                <Route path="/qna" element={<QnASection />} />
                <Route path="/guideline-list" element={<GuidelineList />} />
            </Routes>
            <Footer />
            </div>
        </BrowserRouter>
        );
    }
}

const MainContent = () => (
    <>
      <AboutSection />
      <QuotesSection />
      <GetStartedSection />
    </>
  );

export default App;
