import React, { useState } from 'react';
import styles from './styles.module.css'

const Feedback = ({ setFeedback, handleSubmitFeedback }) => {
    const [feedback, setLocalFeedback] = useState('');

    const handleFeedbackChange = (event) => {
        setLocalFeedback(event.target.value);
        setFeedback(event.target.value);
    };
    
    return (
        <div className={styles.cardContainer}>
            <div className={styles.card} style={{height:'280px', width:'300px', marginTop:'50px', marginLeft:'70px'}}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <textarea
                        value={feedback}
                        onChange={handleFeedbackChange}
                        placeholder="Enter your feedback here..."
                        rows={4}
                        cols={50}
                        style={{ width: '100%', height:'160px', padding: '10px', marginBottom: '20px', border: '1px solid #ccc', borderRadius: '5px'  , color: 'white', background: 'linear-gradient(60deg, #880E4F, #1A237E)'}}
                    />
                </div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button onClick={handleSubmitFeedback} className="submit-feedback-button">Submit</button>
                </div>
                <div className={styles.layers}>
                    {[...Array(10)].map((_, index) => (
                        <div key={index} className={styles.layer} style={{ '--tz': `${(index + 1) * -4}px` }}></div>
                    ))}
                    <div className={styles.layer} style={{ boxShadow: '0 0 0.5em #000d inset, 0 0 5px #000' }}></div>
                </div>
            </div>
        </div>
    );
};

export default Feedback;
