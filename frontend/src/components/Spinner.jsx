import { SpinnerContainer, CenteredContainer } from './SpinnerStyles';

const Spinner = ({ message }) => {
	return (
		<CenteredContainer>
			<SpinnerContainer />
			<span className="sr-only"> {message} </span>
		</CenteredContainer>
	);
};

export default Spinner;
