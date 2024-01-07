import { NEXT_PUBLIC_PROTOCOL, NEXT_PUBLIC_SERVER_HOST, NEXT_PUBLIC_CLIENT_PORT } from '../../constants/index';
import * as React from 'react';

import { Box, Input, Button, Container, ListDivider, Sheet, Typography, IconButton } from '@mui/joy';
// import { YTPersonaCreator } from './YTPersonaCreator';
// import ScienceIcon from '@mui/icons-material/Science';

// import WhatshotIcon from '@mui/icons-material/Whatshot';

import { useRouter } from 'next/router';
import axios from 'axios';
import { Textarea } from '@mui/joy';
// import { SystemPurposeId } from '../../data';

export function CreatePersona() {
  const [title, setTitle] = React.useState('');
  const [symbol, setSymbol] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [prompts, setPrompts] = React.useState('');
  const router = useRouter();
  const handleTitleChange = (event: any) => {
    setTitle(event.target.value);
    console.log('title:', title);
  };
  const handleDescriptionChange = (event: any) => {
    setDescription(event.target.value);
    console.log('description:', description);
  };
  const handleSymbolChange = (event: any) => {
    setSymbol(event.target.value);
    console.log('description:', description);
  };
  const handlePromptsChange = (event: any) => {
    setPrompts(event.target.value);
    console.log('prompts:', prompts);
  };
  const navigateToDashboard = () => {
    // router.push(`/editPersona/${id}`);
    router.push({
      pathname: '/',
    });
  };
  const createPersona = async () => {
    try {
      const response = await axios.post(`${NEXT_PUBLIC_PROTOCOL}://${NEXT_PUBLIC_SERVER_HOST}/api/persona/create`, {
        title: title,
        symbol: symbol,
        description: description,
        systemMessage: prompts,
      });
      if (response.data) {
        navigateToDashboard();
      }
      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  return (
    <Sheet
      sx={{
        flexGrow: 1,
        overflowY: 'auto',
        backgroundColor: 'background.level1',
        p: { xs: 3, md: 6 },
      }}
    >
      <Container disableGutters maxWidth="md" sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography level="title-lg" sx={{ textAlign: 'center' }}>
          Edit Persona Profile
        </Typography>

        <ListDivider sx={{ my: 2 }} />
        <form>
          {' '}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'left', gap: 1 }}>
            <Typography>Avatar Image Url</Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
            <Input fullWidth variant="outlined" placeholder="Symbol" value={symbol} onChange={handleSymbolChange} />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'left', gap: 1 }}>
            <Typography>title</Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
            <Input fullWidth variant="outlined" placeholder="Title" value={title} onChange={handleTitleChange} />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'left', gap: 1 }}>
            <Typography>description</Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
            <Input fullWidth variant="outlined" placeholder="Description" value={description} onChange={handleDescriptionChange} />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'left', gap: 1 }}>
            <Typography>prompts</Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
            <Textarea variant="soft" autoFocus minRows={1} placeholder="Prompts" value={prompts} onChange={handlePromptsChange} style={{ width: '100%' }} />
            {/* <Input fullWidth variant="outlined" placeholder="Prompts" value={prompts} onChange={handlePromptsChange} /> */}
          </Box>
          <Button className="editPersona" type="button" variant="solid" sx={{ minWidth: 120 }} onClick={createPersona}>
            Create
          </Button>
        </form>
      </Container>
    </Sheet>
  );
}
