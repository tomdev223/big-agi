import * as React from 'react';

import { Box, Input, Button, Container, ListDivider, Sheet, Typography, IconButton } from '@mui/joy';
import { YTPersonaCreator } from './YTPersonaCreator';
import ScienceIcon from '@mui/icons-material/Science';

import WhatshotIcon from '@mui/icons-material/Whatshot';

import { useRouter } from 'next/router';
import axios from 'axios';
import { SystemPurposeId } from '../../data';

export function EditPersona() {
  const [id, setId] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [symbol, setSymbol] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [prompts, setPrompts] = React.useState('');
  const router = useRouter();
  const handleTitleChange = (event) => {
    setTitle(event.target.value);
    console.log('title:', title);
  };
  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
    console.log('description:', description);
  };
  const handleSymbolChange = (event) => {
    setSymbol(event.target.value);
    console.log('description:', description);
  };
  const handlePromptsChange = (event) => {
    setPrompts(event.target.value);
    console.log('prompts:', prompts);
  };
  const getPersonaByTitle = async (title: string) => {
    try {
      const response = await axios.post('http://3.13.141.173:3001/api/persona/findByTitle', {
        title: title,
      });
      setSymbol(response.data[0].symbol as string);
      setTitle(response.data[0].title as string);
      setDescription(response.data[0].description as string);
      setPrompts(response.data[0].systemMessage as string);
      setId(response.data[0]._id as string);
      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const navigateToPersonaEdit = (title: SystemPurposeId | null) => {
    // router.push(`/editPersona/${id}`);
    router.push({
      pathname: '/editPersona',
      query: { id: title }, // Additional query params can be added here
    });
  };
  const updatePersona = async () => {
    try {
      const response = await axios.post('http://3.13.141.173:3001/api/persona/update', {
        id: id,
        title: title,
        symbol: symbol,
        description: description,
        systemMessage: prompts,
      });
      if (response.data) {
        navigateToPersonaEdit(title as SystemPurposeId);
      }
      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  React.useEffect(() => {
    const title = router.query.id;

    // Do something with the parameter
    console.log('Query parameter:', title);

    getPersonaByTitle(title);
  }, [router.query, title, symbol, description]);
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
            <Input fullWidth variant="outlined" placeholder="symbol" value={symbol} onChange={handleSymbolChange} />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'left', gap: 1 }}>
            <Typography>title</Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
            <Input fullWidth variant="outlined" placeholder="title" value={title} onChange={handleTitleChange} />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'left', gap: 1 }}>
            <Typography>description</Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
            <Input fullWidth variant="outlined" placeholder="description" value={description} onChange={handleDescriptionChange} />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'left', gap: 1 }}>
            <Typography>prompts</Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
            <Input fullWidth variant="outlined" placeholder="prompts" value={prompts} onChange={handlePromptsChange} />
          </Box>
          <Button className="editPersona" type="button" variant="solid" sx={{ minWidth: 120 }} onClick={updatePersona}>
            Update
          </Button>
        </form>
      </Container>
    </Sheet>
  );
}
