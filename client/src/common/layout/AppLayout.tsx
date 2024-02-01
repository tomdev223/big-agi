import * as React from 'react';
import { shallow } from 'zustand/shallow';

import { Box, Container } from '@mui/joy';

import { ModelsModal } from '../../apps/models-modal/ModelsModal';
import { SettingsModal } from '../../apps/settings-modal/SettingsModal';
import { ShortcutsModal } from '../../apps/settings-modal/ShortcutsModal';

import { isPwa } from '~/common/util/pwaUtils';
import { useAppStateStore } from '~/common/state/store-appstate';
import { useUIPreferencesStore } from '~/common/state/store-ui';

import { AppBar } from './AppBar';
import { GlobalShortcutItem, useGlobalShortcuts } from '../components/useGlobalShortcut';
import { NoSSR } from '../components/NoSSR';
import { openLayoutModelsSetup, openLayoutPreferences, openLayoutShortcuts } from './store-applayout';
import { NEXT_PUBLIC_PROTOCOL, NEXT_PUBLIC_SERVER_HOST } from '../../constants';
import axios from 'axios';
import { DModelSourceId, useSourceSetup } from '~/modules/llms/store-llms';
import { ModelVendorOpenAI } from '~/modules/llms/vendors/openai/openai.vendor';

type OriginalDataType = {
  id: string;
  createdDate: string;
  updatedDate: string;
  apiname: string;
  key: string;
};
export function AppLayout(props: {
  noAppBar?: boolean, suspendAutoModelsSetup?: boolean,
  children: React.ReactNode,
  sourceId: DModelSourceId,
}) {
  // external state
  const { centerMode } = useUIPreferencesStore(state => ({ centerMode: isPwa() ? 'full' : state.centerMode }), shallow);

  // usage counter, for progressive disclosure of features
  useAppStateStore(state => state.usageCount);

  // global shortcuts for modals
  const shortcuts = React.useMemo((): GlobalShortcutItem[] => [
    ['m', true, true, false, openLayoutModelsSetup],
    ['p', true, true, false, openLayoutPreferences],
    ['?', true, true, false, openLayoutShortcuts],
  ], []);
  useGlobalShortcuts(shortcuts);
  const { source, sourceHasLLMs, access, updateSetup } =
    useSourceSetup(props.sourceId, ModelVendorOpenAI.getAccess);
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        // Replace with your own URL and data
        const url = `${NEXT_PUBLIC_PROTOCOL}://${NEXT_PUBLIC_SERVER_HOST}/api/apikey`;
        const config: any = {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
          },
        };
        const response = await axios.get(url, config);

        const originalData: OriginalDataType[] = response.data;
        let apikey = "";
        originalData.map(output => {
          if (output.apiname === 'openai api')
          {
            apikey = output.key;
            console.log("Open ai api key:", output.key);
          }
          else
            console.log("Not open ai api key", output.key);
        });

        await updateSetup({ oaiKey: apikey });
        console.log("Get all apikeys", originalData);
      } catch (error) {
        console.error('Error during the Axios POST request:', error);
      }
    };
    fetchData();
  }, []);
  return (
    // Global NoSSR wrapper: the overall Container could have hydration issues when using localStorage and non-default maxWidth
    <NoSSR>

      <Container
        disableGutters
        maxWidth={centerMode === 'full' ? false : centerMode === 'narrow' ? 'md' : 'xl'}
        sx={{
          boxShadow: {
            xs: 'none',
            md: centerMode === 'narrow' ? 'md' : 'none',
            xl: centerMode !== 'full' ? 'lg' : 'none',
          },
        }}>

        <Box sx={{
          display: 'flex', flexDirection: 'column',
          height: '100dvh',
        }}>

          {!props.noAppBar && <AppBar sx={{
            zIndex: 20, // position: 'sticky', top: 0,
          }} />}

          {props.children}

        </Box>

      </Container>

      {/* Overlay Settings */}
      <SettingsModal />

      {/* Overlay Models (& Model Options )*/}
      <ModelsModal suspendAutoModelsSetup={props.suspendAutoModelsSetup} />

      {/* Overlay Shortcuts */}
      <ShortcutsModal />

    </NoSSR>
  );
}