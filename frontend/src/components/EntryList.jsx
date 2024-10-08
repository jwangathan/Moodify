import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { EntryItem, ListItem, UnorderedList } from './EntryListStyles';

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

	if (entries.length === 0) {
		return <div>Create an Entry!</div>;
	}

	return (
		<div>
			{entries && (
				<div>
					<UnorderedList>
						{entries.map((entry) => (
							<Entry key={entry.id} entry={entry} />
						))}
					</UnorderedList>
				</div>
			)}
		</div>
	);
};

export default EntryList;
