import { NEXT_PUBLIC_PROTOCOL, NEXT_PUBLIC_SERVER_HOST, NEXT_PUBLIC_CLIENT_PORT } from '../../constants';
import * as React from 'react';

import { Box, Input, Button, Container, ListDivider, Sheet, Typography, IconButton } from '@mui/joy';
import { YTPersonaCreator } from './YTPersonaCreator';
import ScienceIcon from '@mui/icons-material/Science';

import WhatshotIcon from '@mui/icons-material/Whatshot';

import { useRouter } from 'next/router';
import axios from 'axios';
import { Textarea } from '@mui/joy';
import { SystemPurposeId } from '../../data';

export function EditPersona() {
  const [id, setId] = React.useState('');
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
    console.log('symbol:', symbol);
  };
  const handlePromptsChange = (event: any) => {
    setPrompts(event.target.value);
    console.log('prompts:', prompts);
  };
  const getPersonaById = async (id: string) => {
    try {
      const response = await axios.get(`${NEXT_PUBLIC_PROTOCOL}://${NEXT_PUBLIC_SERVER_HOST}/api/persona/${id}`);
      console.log('Response:', response.data);
      if (response.data) {
        setSymbol(response.data.persona.symbol);
        setTitle(response.data.persona.title);
        setDescription(response.data.persona.description);
        setPrompts(response.data.persona.systemMessage);
        setId(response.data.persona.id);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const navigateToPersonaEdit = (id: string) => {
    // router.push(`/editPersona/${id}`);
    router.push({
      pathname: '/editPersona',
      query: { id: id }, // Additional query params can be added here
    });
  };
  const updatePersona = async () => {
    try {
      const response = await axios.post(`${NEXT_PUBLIC_PROTOCOL}://${NEXT_PUBLIC_SERVER_HOST}/api/persona/update`, {
        id: id,
        title: title,
        symbol: symbol,
        description: description,
        systemMessage: prompts,
      });
      if (response.data) {
        navigateToPersonaEdit(id as string);
      }
      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  React.useEffect(() => {
    const id = router.query.id;

    getPersonaById(id as string);
  }, [router.query]);
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
          <Button className="editPersona" type="button" variant="solid" sx={{ minWidth: 120 }} onClick={updatePersona}>
            Update
          </Button>
        </form>
      </Container>
    </Sheet>
  );
}
