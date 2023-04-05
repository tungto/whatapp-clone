import { auth, db } from '@/config/firebase';
import ChatIcon from '@mui/icons-material/Chat';
import LogoutIcon from '@mui/icons-material/Logout';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import { Avatar, Button, IconButton, Tooltip } from '@mui/material';
import * as EmailValidator from 'email-validator';
import { addDoc, collection, query, where } from 'firebase/firestore';
import { useState } from 'react';
import { useAuthState, useSignOut } from 'react-firebase-hooks/auth';
import styled from 'styled-components';
import FormDialog from './FormDialog';

import { Conversation } from '@/types';
import { useCollection } from 'react-firebase-hooks/firestore';
import ConversationSelect from './ConversationSelect';

const StyledContainer = styled.div`
	height: 100vh;
	min-width: 300px;
	max-width: 350px;
	overflow-y: scroll;
	border-right: 1px solid whitesmoke;
	/* Hide scrollbar for Chrome, Safari and Opera */
	::-webkit-scrollbar {
		display: none;
	}
	/* Hide scrollbar for IE, Edge and Firefox */
	-ms-overflow-style: none; /* IE and Edge */
	scrollbar-width: none; /* Firefox */
`;

const StyledHeader = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 15px;
	height: 80px;
	border-bottom: 1px solid whitesmoke;
	position: sticky;
	top: 0;
	background-color: white;
	z-index: 1;
`;

const StyledSearch = styled.div`
	display: flex;
	align-items: center;
	padding: 15px;
	border-radius: 2px;
	color: #aaa0a0;
`;

const StyledUserAvatar = styled(Avatar)`
	cursor: pointer;
	:hover {
		opacity: 0.8;
	}
`;

const StyledSearchInput = styled.input`
	outline: none;
	border: none;
	flex: 1;
`;

const StyledSidebarButton = styled(Button)`
	width: 100%;
	border-top: 1px solid whitesmoke;
	border-bottom: 1px solid whitesmoke;
`;

const Sidebar = () => {
	const [signOut, loading, error] = useSignOut(auth);
	const [recipientEmail, setRecipientEmail] = useState('');
	const [loggedInUser] = useAuthState(auth);

	const logout = async () => {
		try {
			await signOut();
		} catch (error) {
			throw new Error(`Logout error: ` + error);
		}
	};

	const queryGetConversationForCurrentUser = query(
		collection(db, 'conversations'),
		where('users', 'array-contains', loggedInUser?.email)
	);

	const [conversationSnapshot, _loading, _error] = useCollection(
		queryGetConversationForCurrentUser
	);

	const iseConversationExisted = (recipientEmail: string) => {
		return conversationSnapshot?.docs.find((conv) =>
			(conv.data() as Conversation).users.includes(recipientEmail)
		);
	};

	const validateRecipientEmail = async () => {
		// check if email is valid

		if (!recipientEmail) return false;

		if (!EmailValidator.validate(recipientEmail)) return false;

		if (recipientEmail === loggedInUser?.email) return false;

		if (iseConversationExisted(recipientEmail)) return false;

		return true;
	};

	const createConversation = async () => {
		const isRecipientEmailValid = await validateRecipientEmail();

		if (!isRecipientEmailValid) {
			console.log('THE RECIPIENT EMAIL ALREADY EXISTED!!');
			return;
		}

		// add conversation user to db "conversation" collection
		// a conversation is between the currently logged in user and the user invited

		console.log('invite checked=====');

		await addDoc(collection(db, 'conversations'), {
			users: [loggedInUser?.email, recipientEmail],
		});
	};

	return (
		<StyledContainer>
			<StyledHeader>
				<Tooltip title={loggedInUser?.email} placement='right'>
					<StyledUserAvatar src={loggedInUser?.photoURL || ''} />
				</Tooltip>

				<div>
					<IconButton>
						<ChatIcon />
					</IconButton>
					<IconButton>
						<MoreVertIcon />
					</IconButton>
					<IconButton onClick={logout}>
						<LogoutIcon />
					</IconButton>
				</div>
			</StyledHeader>
			<StyledSearch>
				<SearchIcon />
				<StyledSearchInput placeholder='Search in conversations' />
			</StyledSearch>
			<StyledSidebarButton>
				<FormDialog
					onRecipientEmailChange={(value: string) => {
						setRecipientEmail(value);
					}}
					recipientEmail={recipientEmail}
					createConversation={createConversation}
				/>
			</StyledSidebarButton>

			{conversationSnapshot?.docs.map((conv) => {
				return (
					<ConversationSelect
						key={conv.id}
						id={conv.id}
						conversationUsers={(conv.data() as Conversation).users}
					/>
				);
			})}
		</StyledContainer>
	);
};

export default Sidebar;
