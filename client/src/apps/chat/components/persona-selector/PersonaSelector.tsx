import { NEXT_PUBLIC_SERVER_PORT, NEXT_PUBLIC_SERVER_HOST, NEXT_PUBLIC_CLIENT_PORT } from '../../../../constants';
import * as React from 'react';
import { shallow } from 'zustand/shallow';

import { Box, Button, Checkbox, Grid, IconButton, Input, Stack, Textarea, Typography } from '@mui/joy';
import ClearIcon from '@mui/icons-material/Clear';
import ScienceIcon from '@mui/icons-material/Science';
import SearchIcon from '@mui/icons-material/Search';
import TelegramIcon from '@mui/icons-material/Telegram';

import { DConversationId, useChatStore } from '~/common/state/store-chats';
import { Link } from '~/common/components/Link';
import { useUIPreferencesStore } from '~/common/state/store-ui';
import { useUXLabsStore } from '~/common/state/store-ux-labs';

import { SystemPurposeId, SystemPurposes } from '../../../../data';
import { usePurposeStore } from './store-purposes';

import axios from 'axios';
// Constants for tile sizes / grid width - breakpoints need to be computed here to work around
// the "flex box cannot shrink over wrapped content" issue
//
// Absolutely dislike this workaround, but it's the only way I found to make it work
import { useRouter } from 'next/router';

const bpTileSize = { xs: 116, md: 125, xl: 130 };
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
  _id: string;
  title: string;
  description: string;
  systemMessage: string;
  symbol: string;
  __v: number;
  call: {
    starters: string[];
  };
  voices: {
    elevenLabs: {
      voiceId: string;
    };
  };
  examples: string[];
};
type RequiredDataType = {
  [key: string]: {
    title: string;
    description: string;
    systemMessage: string;
    symbol: string;
    examples: string[];
    call: {
      starters: string[];
    };
    voices: {
      elevenLabs: {
        voiceId: string;
      };
    };
    highlighted?: boolean; // Add this line
  };
};
export function PersonaSelector(props: { systemPurposes: RequiredDataType, conversationId: DConversationId; runExample: (example: string) => void }) {
  const router = useRouter();
  const navigateToPersonaEdit = (id: SystemPurposeId | null) => {
    // router.push(`/editPersona/${id}`);
    router.push({
      pathname: '/editPersona',
      query: { id: id }, // Additional query params can be added here
    });
  };
  const goToCreate = () => {
    // router.push(`/createPersona`);
    router.push({
      pathname: '/createPersona',
    });
  };


  // state
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filteredIDs, setFilteredIDs] = React.useState<SystemPurposeId[] | null>(null);
  const [editMode, setEditMode] = React.useState(false);
  // const [systemPurposes, setSystemPurposes] = React.useState<RequiredDataType[] | {}>({});

  // external state
  const showFinder = useUIPreferencesStore((state) => state.showPurposeFinder);
  const labsPersonaYTCreator = useUXLabsStore((state) => state.labsPersonaYTCreator);
  const { systemPurposeId, setSystemPurposeId } = useChatStore((state) => {
    const conversation = state.conversations.find((conversation) => conversation.id === props.conversationId);
    return {
      systemPurposeId: conversation ? conversation.systemPurposeId : null,
      setSystemPurposeId: conversation ? state.setSystemPurposeId : null,
    };
  }, shallow);
  const { hiddenPurposeIDs, toggleHiddenPurposeId } = usePurposeStore(
    (state) => ({ hiddenPurposeIDs: state.hiddenPurposeIDs, toggleHiddenPurposeId: state.toggleHiddenPurposeId }),
    shallow,
  );

  // safety check - shouldn't happen
  if (!systemPurposeId || !setSystemPurposeId) return null;

  const handleSearchClear = () => {
    setSearchQuery('');
    setFilteredIDs(null);
  };

  const handleSearchOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    if (!query) return handleSearchClear();
    setSearchQuery(query);

    // Filter results based on search term
    const ids = Object.keys(props.systemPurposes)
      .filter((key) => props.systemPurposes?.hasOwnProperty(key))
      .filter((key) => {
        const purpose = props.systemPurposes [key as SystemPurposeId];
        return (
          purpose.title.toLowerCase().includes(query.toLowerCase()) ||
          (typeof purpose.description === 'string' && purpose.description.toLowerCase().includes(query.toLowerCase()))
        );
      });
    setFilteredIDs(ids as SystemPurposeId[]);

    // If there's a search term, activate the first item
    if (ids.length && !ids.includes(systemPurposeId)) handlePurposeChanged(ids[0] as SystemPurposeId);
  };

  const handleSearchOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key == 'Escape') handleSearchClear();
  };

  const toggleEditMode = () => {
    // setEditMode(!editMode);
    navigateToPersonaEdit(systemPurposeId as SystemPurposeId);
  };
  const redirectToCreate = () => {
    goToCreate();
  };

  const handlePurposeChanged = (purposeId: SystemPurposeId | null) => {
    console.log('PurposeId', purposeId);
    if (purposeId) setSystemPurposeId(props.conversationId, purposeId);
  };

  const handleCustomSystemMessageChange = (v: React.ChangeEvent<HTMLTextAreaElement>): void => {
    // TODO: persist this change? Right now it's reset every time.
    //       maybe we shall have a "save" button just save on a state to persist between sessions
    props.systemPurposes['Custom'].systemMessage = v.target.value;
  };

  // we show them all if the filter is clear (null)
  const unfilteredPurposeIDs = filteredIDs && showFinder ? filteredIDs : Object.keys(props.systemPurposes);
  const purposeIDs = editMode ? unfilteredPurposeIDs : unfilteredPurposeIDs.filter((id) => !hiddenPurposeIDs.includes(id));

  const selectedPurpose = purposeIDs.length ? props.systemPurposes[systemPurposeId] ?? null : null;
  const selectedExample = (selectedPurpose?.examples && getRandomElement(selectedPurpose.examples)) || null;

  // React.useEffect(() => {
  //   function transformData(originalData: OriginalDataType[]): RequiredDataType {
  //     let transformedData: RequiredDataType = {};
  //
  //     originalData.forEach((item) => {
  //       transformedData[item.title] = {
  //         title: item.title,
  //         description: item.description,
  //         systemMessage: item.systemMessage,
  //         symbol: item.symbol,
  //         examples: item.examples,
  //         call: item.call,
  //         voices: item.voices,
  //       };
  //     });
  //
  //     return transformedData;
  //   }
  //   // Function to transform the original structure into the desired result
  //   function transformToResult(data: RequiredDataType): string {
  //     return Object.values(data)
  //       .map((role) => role.title)
  //       .join(' | ');
  //   }
  //   const fetchData = async () => {
  //     try {
  //       console.log('Server host', NEXT_PUBLIC_SERVER_HOST);
  //       // Replace with your own URL and data
  //       const url = `http://${NEXT_PUBLIC_SERVER_HOST}:${NEXT_PUBLIC_SERVER_PORT}/api/persona`;
  //       const config: any = {
  //         headers: {
  //           'Access-Control-Allow-Origin': '*',
  //           'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
  //         },
  //       };
  //       const response = await axios.get(url, config);
  //
  //       const originalData: OriginalDataType[] = response.data;
  //       const requiredData = transformData(originalData);
  //       setSystemPurposes(requiredData);
  //
  //       // Usage
  //       const result = transformToResult(requiredData);
  //       console.log('title sum id', result);
  //       console.log('Required data', requiredData);
  //     } catch (error) {
  //       console.error('Error during the Axios POST request:', error);
  //     }
  //   };
  //   const data = fetchData(); // Fetch data from an API or database
  // }, []);
  return (
    <>
      {showFinder && (
        <Box sx={{ p: 2 * tileSpacing }}>
          <Input
            fullWidth
            variant="outlined"
            color="neutral"
            value={searchQuery}
            onChange={handleSearchOnChange}
            onKeyDown={handleSearchOnKeyDown}
            placeholder="Search for purpose…"
            startDecorator={<SearchIcon />}
            endDecorator={
              searchQuery && (
                <IconButton variant="plain" color="neutral" onClick={handleSearchClear}>
                  <ClearIcon />
                </IconButton>
              )
            }
            sx={{
              boxShadow: 'sm',
            }}
          />
        </Box>
      )}

      <Stack direction="column" sx={{ minHeight: '60vh', justifyContent: 'center', alignItems: 'center' }}>
        <Box sx={{ maxWidth: bpMaxWidth }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              gap: 2,
              mb: 1,
            }}
          >
            <Typography level="title-sm">AI Persona</Typography>
            <Button variant="plain" color="neutral" size="sm" onClick={redirectToCreate}>
              Create
            </Button>
            <Button variant="plain" color="neutral" size="sm" onClick={toggleEditMode}>
              {editMode ? 'Done' : 'Edit'}
            </Button>
          </Box>

          <Grid container spacing={tileSpacing} sx={{ justifyContent: 'flex-start' }}>
            {purposeIDs.map((spId) => (
              <Grid key={spId}>
                <Button
                  variant={!editMode && systemPurposeId === spId ? 'solid' : 'soft'}
                  color={!editMode && systemPurposeId === spId ? 'primary' : props.systemPurposes[spId as SystemPurposeId].highlighted ? 'warning' : 'neutral'}
                  onClick={() => !editMode && handlePurposeChanged(spId as SystemPurposeId)}
                  sx={{
                    flexDirection: 'column',
                    fontWeight: 500,
                    gap: bpTileGap,
                    height: bpTileSize,
                    width: bpTileSize,
                    ...(editMode || systemPurposeId !== spId
                      ? {
                          boxShadow: 'md',
                          ...(props.systemPurposes[spId as SystemPurposeId]?.highlighted ? {} : { backgroundColor: 'background.surface' }),
                        }
                      : {}),
                  }}
                >
                  {editMode && (
                    <Checkbox
                      label={<Typography level="body-sm">show</Typography>}
                      checked={!hiddenPurposeIDs.includes(spId)}
                      onChange={() => toggleHiddenPurposeId(spId)}
                      sx={{ alignSelf: 'flex-start' }}
                    />
                  )}
                  <div style={{ fontSize: '2rem' }}>{props.systemPurposes[spId as SystemPurposeId]?.symbol}</div>
                  <div>{props.systemPurposes[spId as SystemPurposeId]?.title}</div>
                </Button>
              </Grid>
            ))}
          </Grid>
          <Typography
            level="body-sm"
            sx={{
              mt: selectedExample ? 1 : 3,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              // justifyContent: 'center',
              '&:hover > button': { opacity: 1 },
            }}
          >
            {!selectedPurpose ? (
              'Oops! No AI persona found for your search.'
            ) : selectedExample ? (
              <>
                Example: {selectedExample}
                <IconButton
                  variant="plain"
                  color="primary"
                  size="md"
                  onClick={() => props.runExample(selectedExample)}
                  sx={{ opacity: 0, transition: 'opacity 0.3s' }}
                >
                  <TelegramIcon />
                </IconButton>
              </>
            ) : (
              selectedPurpose.description
            )}
          </Typography>

          {systemPurposeId === 'Custom' && (
            <Textarea
              variant="outlined"
              autoFocus
              placeholder={'Craft your custom system message here…'}
              minRows={3}
              defaultValue={props.systemPurposes['Custom']?.systemMessage}
              onChange={handleCustomSystemMessageChange}
              sx={{
                backgroundColor: 'background.level1',
                '&:focus-within': {
                  backgroundColor: 'background.popup',
                },
                lineHeight: 1.75,
                mt: 1,
              }}
            />
          )}
        </Box>
      </Stack>
    </>
  );
}
