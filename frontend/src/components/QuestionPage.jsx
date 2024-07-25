import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const QuestionPage = () => {
	const [step, setStep] = useState(1);
	const [event, setEvent] = useState('');
	const [mood, setMood] = useState('');
	const navigate = useNavigate();

	const handleInputChange = (e) => {
		if (step === 1) {
			setEvent(e.target.value);
		} else if (step === 2) {
			setMood(e.target.value);
		}
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		if (step === 1) {
			e.target.value = '';
			setStep(2);
		} else if (step === 2) {
			setStep(1);
			navigate('/playlist', { state: { event, mood } });
			setEvent('');
			setMood('');
			console.log('HELP');
		}
	};
	return (
		<div>
			{step === 1 ? (
				<>
					<h1>Tell me about something in your life</h1>
					<h3>(E.g. I had a hard day at work, I have a party soon!)</h3>
				</>
			) : (
				<>
					<h1>What would you like to feel from this?</h1>
					<h3>
						(E.g. I want to feel more relaxed, I want something to get me
						excited)
					</h3>
				</>
			)}
			<form onSubmit={handleSubmit}>
				<input
					type="text"
					value={step === 1 ? event : mood}
					onChange={handleInputChange}
					required
				/>
				<input type="submit" value="Submit" />
			</form>
		</div>
	);
};

export default QuestionPage;
