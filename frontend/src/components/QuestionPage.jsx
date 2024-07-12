import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const QuestionPage = ({ token }) => {
	const [mood, setMood] = useState();
	const navigate = useNavigate();
	const handleSubmit = (e) => {
		navigate('/playlist', { state: mood });
		e.preventDefault();
	};

	return (
		<div>
			{token && (
				<form onSubmit={handleSubmit}>
					<label>
						Question 1: How have you been feeling on a scale of 1.0 - 10.0?
						<br />
						<input
							type="text"
							value={mood}
							placeholder="Ex: 4.5"
							onChange={(e) => setMood(e.target.value)}
							required
						/>
					</label>
					<br />
					<input type="submit" value="Submit" />
				</form>
			)}
		</div>
	);
};

export default QuestionPage;
