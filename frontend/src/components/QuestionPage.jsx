import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QuestionContainer } from './QuestionPageStyles';

const QuestionPage = () => {
	const [step, setStep] = useState(1);
	const [situation, setSituation] = useState('');
	const [emotion, setEmotion] = useState('');
	const [fade, setFade] = useState('fade-enter');
	const navigate = useNavigate();

	const handleInputChange = (e) => {
		if (step === 1) {
			setSituation(e.target.value);
		} else if (step === 2) {
			setEmotion(e.target.value);
		}
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		setFade('fade-exit');
		setTimeout(() => {
			if (step === 1) {
				e.target.value = '';
				setStep(2);
			} else if (step === 2) {
				setStep(1);
				navigate('/entries/callback', {
					state: { situation, emotion },
				});
				setSituation('');
				setEmotion('');
			}
			setFade('fade-enter');
		}, 500);
	};

	useEffect(() => {
		setFade('fade-enter');
	}, [step]);

	return (
		<QuestionContainer className={fade}>
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
					value={step === 1 ? situation : emotion}
					onChange={handleInputChange}
					required
				/>
				<input type="submit" value="Submit" />
			</form>
		</QuestionContainer>
	);
};

export default QuestionPage;
