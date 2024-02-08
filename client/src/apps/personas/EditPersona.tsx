import { NEXT_PUBLIC_PROTOCOL, NEXT_PUBLIC_SERVER_HOST, NEXT_PUBLIC_CLIENT_PORT } from '../../constants';
import * as React from 'react';

import { Box, Input, Button, Container, ListDivider, Sheet, Typography, Option, Select, IconButton } from '@mui/joy';
import { YTPersonaCreator } from './YTPersonaCreator';
import ScienceIcon from '@mui/icons-material/Science';

import WhatshotIcon from '@mui/icons-material/Whatshot';

import { useRouter } from 'next/router';
import axios from 'axios';
import { Textarea } from '@mui/joy';
import { SystemPurposeId } from '../../data';
import { useState } from 'react';

import { EXPERIMENTAL_speakTextStream } from '~/modules/elevenlabs/elevenlabs.client';
type OriginalDataType = {
  id: string;
  createdDate: string;
  updatedDate: string;
  title: string;
  icon: string;
  color: string;
};

type VoiceModelType = {
  id: string;
  createdDate: string;
  updatedDate: string;
  language: string;
  genre: string;
  modelName: string;
};
export function EditPersona() {
  const [id, setId] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [symbol, setSymbol] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [prompts, setPrompts] = React.useState('');
  const [categoryId, setCategoryId] = React.useState('');
  const [categories, setCategories] = React.useState<OriginalDataType[]>([]);

  const [language, setLanguage] = useState(null);
  const [genre, setGenre] = useState(null);
  const [voiceModel, setVoiceModel] = useState(null);
  const [voiceModels, setVoiceModels] = React.useState<VoiceModelType[]>([]);

  const router = useRouter();
  const handleTitleChange = (event: any) => {
    setTitle(event.target.value);
  };
  const handleDescriptionChange = (event: any) => {
    setDescription(event.target.value);
  };
  const handleSymbolChange = (event: any) => {
    setSymbol(event.target.value);
  };
  const handlePromptsChange = (event: any) => {
    setPrompts(event.target.value);
  };
  const handleCategoryIdChangeSelf = (event: any) => {
    setCategoryId(event.target.value);
  };
  const handleCategoryIdChange = (val: string) => {
    setCategoryId(val);
  };
  const getPersonaById = async (id: string) => {
    try {
      const response = await axios.get(`${NEXT_PUBLIC_PROTOCOL}://${NEXT_PUBLIC_SERVER_HOST}/api/persona/${id}`);
      if (response.data) {
        setSymbol(response.data.persona.symbol);
        setTitle(response.data.persona.title);
        setDescription(response.data.persona.description);
        setPrompts(response.data.persona.systemMessage);
        setCategoryId(response.data.persona.category.id);
        setId(response.data.persona.id);
        setLanguage(response.data.persona.voices.piper.language);
        setVoiceModel(response.data.persona.voices.piper.modelName);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const navigateToPersonaEdit = (id: string) => {
    // router.push(`/editPersona/${id}`);
    router.push({
      pathname: '/indexByCategory',
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
        categoryId: categoryId,
        voices: {
          piper: {
            language: language,
            modelName: voiceModel,
          },
        },
      });
      if (response.data) {
        navigateToPersonaEdit(categoryId as string);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleVoiceChange = (_event: any, value: any | null) => {
    setCategoryId(value);
  };

  const handleVoiceModelChange = (_event: any, value: any | null) => {
    setVoiceModel(value);
    if (language && value) {
      void EXPERIMENTAL_speakTextStream(
        'Our AI Training Platform equips call center agents with the skills and confidence to excel in customer interactions',
        language,
        value,
      );
    }
  };
  const handleLanguageChange = (_event: any, value: any | null) => {
    setLanguage(value);
  };
  React.useEffect(() => {
    const id = router.query.id;

    getPersonaById(id as string);
    const fetchData = async () => {
      try {
        // Replace with your own URL and data
        const url = `${NEXT_PUBLIC_PROTOCOL}://${NEXT_PUBLIC_SERVER_HOST}/api/category`;
        const config: any = {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
          },
        };
        const response = await axios.get(url, config);

        const originalData: OriginalDataType[] = response.data;
        setCategories(originalData);
      } catch (error) {
        console.error('Error during the Axios POST request:', error);
      }
    };

    const getVoiceModels = async () => {
      try {
        const response = await axios.get(`${NEXT_PUBLIC_PROTOCOL}://${NEXT_PUBLIC_SERVER_HOST}/api/voiceModel`);
        const resultData: VoiceModelType[] = response.data;
        setVoiceModels(resultData);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchData();
    getVoiceModels();
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
            <Typography>Title</Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
            <Input fullWidth variant="outlined" placeholder="Title" value={title} onChange={handleTitleChange} />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'left', gap: 1 }}>
            <Typography>Description</Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
            <Input fullWidth variant="outlined" placeholder="Description" value={description} onChange={handleDescriptionChange} />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'left', gap: 1 }}>
            <Typography>Prompts</Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
            <Textarea variant="soft" autoFocus minRows={1} placeholder="Prompts" value={prompts} onChange={handlePromptsChange} style={{ width: '100%' }} />
            {/* <Input fullWidth variant="outlined" placeholder="Prompts" value={prompts} onChange={handlePromptsChange} /> */}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'left', gap: 1 }}>
            <Typography>Category</Typography>
          </Box>
          <Box>
            <Select
              value={categoryId}
              onChange={handleVoiceChange}
              variant="outlined"
              slotProps={{
                root: { sx: { width: '100%' } },
                indicator: { sx: { opacity: 0.5 } },
              }}
            >
              {categories.map((option, key) => (
                <Option key={key} value={option.id}>
                  {option.title}
                </Option>
              ))}
            </Select>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'left', gap: 1 }}>
            <Typography>Language</Typography>
          </Box>
          <Box>
            <Select
              value={language}
              onChange={handleLanguageChange}
              variant="outlined"
              slotProps={{
                root: { sx: { width: '100%' } },
                indicator: { sx: { opacity: 0.5 } },
              }}
            >
              <Option value={'en'}>English</Option>
              <Option value={'es'}>Spanish</Option>
            </Select>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'left', gap: 1 }}>
            <Typography>VoiceModel</Typography>
          </Box>
          <Box>
            <Select
              value={voiceModel}
              onChange={handleVoiceModelChange}
              variant="outlined"
              slotProps={{
                root: { sx: { width: '100%' } },
                indicator: { sx: { opacity: 0.5 } },
              }}
            >
              {voiceModels.map((option, key) =>
                // <Option key={key} value={option.modelName}>
                //   {option.modelName}
                // </Option>
                option.language == language ? ( // Assuming 'isActive' is the condition you're checking
                  <Option key={key} value={option.modelName}>
                    {option.modelName}
                  </Option>
                ) : null,
              )}
            </Select>
          </Box>
          <Button className="editPersona" type="button" variant="solid" sx={{ minWidth: 120 }} onClick={updatePersona}>
            Update
          </Button>
        </form>
      </Container>
    </Sheet>
  );
}
