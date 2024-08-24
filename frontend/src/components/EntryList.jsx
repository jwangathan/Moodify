import { useSelector } from 'react-redux';
import { UnorderedList } from './ListStyles';

const Entry = ({ entry }) => {
	return <li>{entry.user.spotifyId}</li>;
};

const EntryList = ({ currUser }) => {
	const entries = useSelector((state) => state.entries);

	return (
		<div>
			{entries && (
				<div>
					<UnorderedList>
						{entries
							.filter(
								(entry) => entry.user.spotifyId === currUser.user.spotifyId
							)
							.map((entry) => (
								<Entry key={entry.id} entry={entry} />
							))}
					</UnorderedList>
				</div>
			)}
		</div>
	);
};

export default EntryList;
