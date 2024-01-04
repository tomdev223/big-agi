import { NEXT_PUBLIC_SERVER_PORT, NEXT_PUBLIC_SERVER_HOST, NEXT_PUBLIC_CLIENT_PORT } from '../../../../constants';
import * as React from 'react';
import { shallow } from 'zustand/shallow';

import { ListItemButton, ListItemDecorator } from '@mui/joy';
import CallIcon from '@mui/icons-material/Call';

import { SystemPurposeId, SystemPurposes } from '../../../../data';

import { AppBarDropdown } from '~/common/layout/AppBarDropdown';
import { DConversationId, useChatStore } from '~/common/state/store-chats';
import { launchAppCall } from '~/common/app.routes';
import { useUIPreferencesStore } from '~/common/state/store-ui';
import { useUXLabsStore } from '~/common/state/store-ux-labs';

import axios from 'axios';
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
    description: string | React.JSX.Element;
    systemMessage: string;
    symbol: string;
    imageUri?: string;
    examples?: string[];
    highlighted?: boolean;
    call?: { starters?: string[] };
    voices?: { elevenLabs?: { voiceId: string } };
  };
};
function AppBarPersonaDropdown(props: {
  systemPurposeId: SystemPurposeId | null;
  setSystemPurposeId: (systemPurposeId: SystemPurposeId | null) => void;
  onCall?: () => void;
}) {
  // external state
  const { zenMode } = useUIPreferencesStore(
    (state) => ({
      zenMode: state.zenMode,
    }),
    shallow,
  );

  const handleSystemPurposeChange = (_event: any, value: SystemPurposeId | null) => props.setSystemPurposeId(value);

  // options

  let appendOption: React.JSX.Element | undefined = undefined;

  const [systemPurposes, setSystemPurposes] = React.useState<RequiredDataType>({});
  if (props.onCall) {
    const enableCallOption = !!props.systemPurposeId;
    appendOption = (
      <ListItemButton color="primary" disabled={!enableCallOption} key="menu-call-persona" onClick={props.onCall} sx={{ minWidth: 160 }}>
        <ListItemDecorator>
          <CallIcon color={enableCallOption ? 'primary' : 'warning'} />
        </ListItemDecorator>
        Call&nbsp; {!!props.systemPurposeId && systemPurposes[props.systemPurposeId]?.symbol}
      </ListItemButton>
    );
  }
  React.useEffect(() => {
    function transformData(originalData: OriginalDataType[]): RequiredDataType {
      let transformedData: RequiredDataType = {};

      originalData.forEach((item) => {
        transformedData[item.title] = {
          title: item.title,
          description: item.description,
          systemMessage: item.systemMessage,
          symbol: item.symbol,
          examples: item.examples,
          call: item.call,
          voices: item.voices,
        };
      });

      return transformedData;
    }
    // Function to transform the original structure into the desired result
    function transformToResult(data: RequiredDataType): string {
      return Object.values(data)
        .map((role) => role.title)
        .join(' | ');
    }
    const fetchData = async () => {
      try {
        console.log('Server host', NEXT_PUBLIC_SERVER_HOST);
        // Replace with your own URL and data
        const url = `http://${NEXT_PUBLIC_SERVER_HOST}:${NEXT_PUBLIC_SERVER_PORT}/api/persona`;
        const config: any = {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
          },
        };
        const response = await axios.get(url, config);

        const originalData: OriginalDataType[] = response.data;
        const requiredData = transformData(originalData);
        setSystemPurposes(requiredData);

        // Usage
        const result = transformToResult(requiredData);
        console.log('title sum id', result);
        console.log('Required data', requiredData);
      } catch (error) {
        console.error('Error during the Axios POST request:', error);
      }
    };
    const data = fetchData(); // Fetch data from an API or database
  }, []);
  return (
    <AppBarDropdown
      items={systemPurposes}
      showSymbols={zenMode !== 'cleaner'}
      value={props.systemPurposeId}
      onChange={handleSystemPurposeChange}
      appendOption={appendOption}
    />
  );
}

export function usePersonaIdDropdown(conversationId: DConversationId | null) {
  // external state
  const labsCalling = useUXLabsStore((state) => state.labsCalling);
  const { systemPurposeId } = useChatStore((state) => {
    const conversation = state.conversations.find((conversation) => conversation.id === conversationId);
    return {
      systemPurposeId: conversation?.systemPurposeId ?? null,
    };
  }, shallow);

  const personaDropdown = React.useMemo(
    () =>
      systemPurposeId ? (
        <AppBarPersonaDropdown
          systemPurposeId={systemPurposeId}
          setSystemPurposeId={(systemPurposeId) => {
            if (conversationId && systemPurposeId) useChatStore.getState().setSystemPurposeId(conversationId, systemPurposeId);
          }}
          onCall={
            labsCalling
              ? () => {
                  if (conversationId && systemPurposeId) launchAppCall(conversationId, systemPurposeId);
                }
              : undefined
          }
        />
      ) : null,
    [conversationId, labsCalling, systemPurposeId],
  );

  return { personaDropdown };
}
