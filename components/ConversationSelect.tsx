import { useRecipient } from '@/hooks/useRecipient';
import { Conversation } from '@/types';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import RecipientAvatar from './RecipientAvatar';

const StyledContainer = styled.div`
	display: flex;
	align-items: center;
	cursor: pointer;
	padding: 15px;
	word-break: break-all;
	:hover {
		background-color: lightgrey;
	}
	border: 1px solid #e9e9e9;
`;

const ConversationSelect = ({
	id,
	conversationUsers,
}: {
	id: string;
	conversationUsers: Conversation['users'];
}) => {
	const { recipient, recipientEmail } = useRecipient(conversationUsers);

	const router = useRouter();

	const onSelectConversation = (id: string) => {
		router.push(`/conversations/${id}`);
	};

	return (
		<StyledContainer onClick={() => onSelectConversation(id)}>
			<RecipientAvatar
				recipient={recipient}
				recipientEmail={recipientEmail}
			/>
			<span>{recipientEmail}</span>
		</StyledContainer>
	);
};

export default ConversationSelect;
