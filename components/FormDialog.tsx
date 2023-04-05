import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function FormDialog(props: any) {
	const [open, setOpen] = React.useState(false);

	const { recipientEmail, onRecipientEmailChange, createConversation } =
		props;

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		onRecipientEmailChange('');
		setOpen(false);
	};

	const handleCreateConversation = async () => {
		handleClose();
		await createConversation();
	};

	return (
		<>
			<Button fullWidth onClick={handleClickOpen}>
				Start a new conversation
			</Button>
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>New Conversation</DialogTitle>
				<DialogContent>
					<DialogContentText>
						To start a new conversation to this website, please
						enter your email address here. We will send updates
						occasionally.
					</DialogContentText>
					<TextField
						autoFocus
						margin='dense'
						id='name'
						label='Email Address'
						type='email'
						fullWidth
						variant='standard'
						value={recipientEmail}
						onChange={(event) =>
							onRecipientEmailChange(event.target.value)
						}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>Cancel</Button>
					<Button
						disabled={!recipientEmail}
						onClick={handleCreateConversation}>
						Create
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}
