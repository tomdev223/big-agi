import { NEXT_PUBLIC_PROTOCOL, NEXT_PUBLIC_SERVER_HOST, NEXT_PUBLIC_CLIENT_PORT } from '../../constants/index';

import * as React from 'react';
import { shallow } from 'zustand/shallow';

import { Box, Button, Checkbox, Grid, IconButton, Input, Stack, Textarea, Typography } from '@mui/joy';
import ClearIcon from '@mui/icons-material/Clear';
import ScienceIcon from '@mui/icons-material/Science';
import SearchIcon from '@mui/icons-material/Search';
import TelegramIcon from '@mui/icons-material/Telegram';

import axios from 'axios';
// Constants for tile sizes / grid width - breakpoints need to be computed here to work around
// the "flex box cannot shrink over wrapped content" issue
//
// Absolutely dislike this workaround, but it's the only way I found to make it work
import { useRouter } from 'next/router';

const bpTileSize = { xs: 116, md: 125, xl: 130 };
const bpTileSizeWidth = { xs: 180, md: 200, xl: 250 };
const tileCols = [3, 4, 6];
const tileSpacing = 1;
const bpMaxWidth = Object.entries(bpTileSize).reduce(
  (acc, [key, value], index) => {
    acc[key] = tileCols[index] * (value + 8 * tileSpacing) - 8 * tileSpacing;
    return acc;
  },
  {} as Record<string, number>,
);
const bpTileGap = { xs: 0.5, md: 1 };

// Add this utility function to get a random array element
const getRandomElement = <T,>(array: T[]): T | undefined => (array.length > 0 ? array[Math.floor(Math.random() * array.length)] : undefined);

/**
 * Purpose selector for the current chat. Clicking on any item activates it for the current chat.
 */

type OriginalDataType = {
  id: string;
  createdDate: string;
  updatedDate: string;
  title: string;
  icon: string;
  color: string;
};
export function AllCategory(props: {}) {
  const router = useRouter();
  const navigateToPersonaEdit = (id: string) => {
    // router.push(`/editPersona/${id}`);
    router.push({
      pathname: '/editPersona',
      query: { id: id }, // Additional query params can be added here
    });
  };

  // state
  const [searchQuery, setSearchQuery] = React.useState('');
  const [editId, setEditId] = React.useState('');
  const [categories, setCategories] = React.useState<OriginalDataType[]>([]);

  const findByCategory = async (categoryId: string) => {
    try {
      const response = await axios.post(`${NEXT_PUBLIC_PROTOCOL}://${NEXT_PUBLIC_SERVER_HOST}/api/persona/findByCategory`, {
        categoryId: categoryId,
      });
      if (response.data) {
        console.log('Category', response.data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const goToPersonasPage = (id: string) => {
    findByCategory(id as string);
    setEditId(id);
  };
  const goToCreate = () => {
    // router.push(`/createPersona`);
    router.push({
      pathname: '/category/createCategory',
    });
  };
  const goToEdit = () => {
    router.push({
      pathname: '/category/editCategory/',
      query: { id: editId }, // Additional query params can be added here
    });
  };

  React.useEffect(() => {
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
    fetchData();
  }, []);
  return (
    <>
      <Stack
        direction="column"
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          backgroundColor: 'white',
          p: { xs: 3, md: 6 },
          alignItems: 'center',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'left', gap: 1 }}>
          <Typography sx={{ fontSize: 20, marginBottom: 5 }}>Available training categories</Typography>
        </Box>
        <Box sx={{ maxWidth: bpMaxWidth }}>
          <Grid container spacing={tileSpacing} sx={{ justifyContent: 'flex-start' }}>
            {categories.map((item, key) => (
              <Grid key={key}>
                <Button
                  onClick={() => goToPersonasPage(item.id as string)}
                  variant={'soft'}
                  color={'neutral'}
                  sx={{
                    flexDirection: 'column',
                    fontWeight: 500,
                    gap: bpTileGap,
                    height: bpTileSize,
                    width: bpTileSizeWidth,
                    backgroundColor: item.color,
                    margin: 1,
                  }}
                >
                  <div style={{ fontSize: '2rem' }}>{item.icon}</div>
                  <div>{item.title}</div>
                </Button>
              </Grid>
            ))}
          </Grid>
        </Box>
        <Box sx={{ maxWidth: bpMaxWidth }}>
          <Button className="editPersona" type="button" variant="solid" onClick={goToCreate} sx={{ marginRight: 2 }}>
            Add
          </Button>
          <Button className="editPersona" type="button" variant="outlined" onClick={goToEdit}>
            Edit
          </Button>
        </Box>
        <Box></Box>
      </Stack>
    </>
  );
}
