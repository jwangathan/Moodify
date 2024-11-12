import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import {
	CenteredText,
	EntryItem,
	ListItem,
	UnorderedList,
	Heading,
	Button,
	ButtonContainer,
} from './EntryListStyles';

const Entry = ({ entry }) => {
	const navigate = useNavigate();
	return (
		<ListItem>
			<EntryItem onClick={() => navigate(`/entries/${entry.id}`)}>
				<p>Tell me about something in your life.</p>
				<em>{entry.situation}</em>
				<p>What would you like to feel from this?</p>
				<em>{entry.emotion}</em>
				<small>
					Created On: {new Date(entry.createdAt).toLocaleDateString()}
				</small>
			</EntryItem>
		</ListItem>
	);
};

const EntryList = () => {
	const entries = useSelector((state) => state.entries);
	const navigate = useNavigate();

	const handleClick = () => {
		navigate('/question');
	};

	return (
		<>
			<Heading>Your Mood Journal</Heading>
			<ButtonContainer>
				{entries.length === 0 ? (
					<CenteredText>
						<p>Share your life's ups and downs, and see how music can help</p>
						<Button onClick={handleClick}>Create your first entry</Button>
					</CenteredText>
				) : (
					<Button onClick={handleClick}>Add New Entry</Button>
				)}
			</ButtonContainer>
			{entries && (
				<div>
					<UnorderedList>
						{entries.map((entry) => (
							<Entry key={entry.id} entry={entry} />
						))}
					</UnorderedList>
				</div>
			)}
		</>
	);
};

export default EntryList;
