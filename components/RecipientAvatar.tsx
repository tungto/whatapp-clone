import { useRecipient } from '@/hooks/useRecipient';
import { Avatar } from '@mui/material';
import styled from 'styled-components';

const StyledContainer = styled.div`
	margin-right: 15px;
`;

type Props = ReturnType<typeof useRecipient>;

const RecipientAvatar = ({ recipient, recipientEmail }: Props) => {
	return (
		<StyledContainer>
			{recipient?.photoURL ? (
				<Avatar src={recipient?.photoURL} />
			) : (
				<Avatar>
					{recipientEmail && recipientEmail[0].toUpperCase()}
				</Avatar>
			)}
		</StyledContainer>
	);
};

export default RecipientAvatar;
