import { NEXT_PUBLIC_PROTOCOL, NEXT_PUBLIC_SERVER_HOST, NEXT_PUBLIC_CLIENT_PORT } from '../../constants/index';
import * as React from 'react';

import { Box, Input, Button, Container, ListDivider, Sheet, Typography, IconButton } from '@mui/joy';
// import ScienceIcon from '@mui/icons-material/Science';

// import WhatshotIcon from '@mui/icons-material/Whatshot';

import { useRouter } from 'next/router';
import axios from 'axios';
// import { SystemPurposeId } from '../../data';

export function CreateCategory() {
  const [title, setTitle] = React.useState('');
  const [icon, setIcon] = React.useState('');
  const [color, setColor] = React.useState('');
  const router = useRouter();
  const handleTitleChange = (event: any) => {
    setTitle(event.target.value);
    console.log('title:', title);
  };
  const handleColorChange = (event: any) => {
    setColor(event.target.value);
    console.log('color:', color);
  };
  const handleIconChange = (event: any) => {
    setIcon(event.target.value);
    console.log('color:', color);
  };
  const navigateToDashboard = () => {
    // router.push(`/editPersona/${id}`);
    router.push({
      pathname: '/',
    });
  };
  const createCategory = async () => {
    try {
      const response = await axios.post(`${NEXT_PUBLIC_PROTOCOL}://${NEXT_PUBLIC_SERVER_HOST}/api/category/create`, {
        title: title,
        icon: icon,
        color: color,
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
            <Input fullWidth variant="outlined" placeholder="Icon" value={icon} onChange={handleIconChange} />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'left', gap: 1 }}>
            <Typography>title</Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
            <Input fullWidth variant="outlined" placeholder="Title" value={title} onChange={handleTitleChange} />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'left', gap: 1 }}>
            <Typography>color</Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
            <Input fullWidth variant="outlined" placeholder="Color" value={color} onChange={handleColorChange} />
          </Box>
          <Button className="editPersona" type="button" variant="solid" sx={{ minWidth: 120 }} onClick={createCategory}>
            Create
          </Button>
        </form>
      </Container>
    </Sheet>
  );
}
