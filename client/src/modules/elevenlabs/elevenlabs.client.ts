import { NEXT_PUBLIC_PROTOCOL, NEXT_PUBLIC_SERVER_HOST, NEXT_PUBLIC_CLIENT_PORT } from '../../constants/index';
import { backendCaps } from '~/modules/backend/state-backend';

import { AudioLivePlayer } from '~/common/util/AudioLivePlayer';
import { CapabilityElevenLabsSpeechSynthesis } from '~/common/components/useCapabilities';
import { playSoundBuffer } from '~/common/util/audioUtils';
import { useUIPreferencesStore } from '~/common/state/store-ui';

import type { SpeechInputSchema } from './elevenlabs.router';
import { getElevenLabsData, useElevenLabsData } from './store-module-elevenlabs';
import axios from 'axios';


export const isValidElevenLabsApiKey = (apiKey?: string) => !!apiKey && apiKey.trim()?.length >= 32;

export const isElevenLabsEnabled = (apiKey?: string) => apiKey
  ? isValidElevenLabsApiKey(apiKey)
  : backendCaps().hasVoiceElevenLabs;


export function useCapability(): CapabilityElevenLabsSpeechSynthesis {
  const [clientApiKey, voiceId] = useElevenLabsData();
  const isConfiguredServerSide = backendCaps().hasVoiceElevenLabs;
  const isConfiguredClientSide = clientApiKey ? isValidElevenLabsApiKey(clientApiKey) : false;
  const mayWork = isConfiguredServerSide || isConfiguredClientSide || !!voiceId;
  return { mayWork, isConfiguredServerSide, isConfiguredClientSide };
}


export async function speakText(text: string, voiceId?: string) {
  if (!(text?.trim())) return;

  const { elevenLabsApiKey, elevenLabsVoiceId } = getElevenLabsData();
  if (!isElevenLabsEnabled(elevenLabsApiKey)) return;

  const { preferredLanguage } = useUIPreferencesStore.getState();
  const nonEnglish = !(preferredLanguage?.toLowerCase()?.startsWith('en'));

  try {
    //Elevenlab for TTS
    const edgeResponse = await fetchApiElevenlabsSpeech(text, elevenLabsApiKey, voiceId || elevenLabsVoiceId, nonEnglish, false);
    const audioBuffer = await edgeResponse.arrayBuffer();
    await playSoundBuffer(audioBuffer);
  } catch (error) {
    console.error('Error playing first text:', error);
  }
}

// let liveAudioPlayer: LiveAudioPlayer | undefined = undefined;

export async function EXPERIMENTAL_speakTextStream(text: string, voiceId?: string) {
  if (!(text?.trim())) return;

  const { elevenLabsApiKey, elevenLabsVoiceId } = getElevenLabsData();
  if (!isElevenLabsEnabled(elevenLabsApiKey)) return;

  const { preferredLanguage } = useUIPreferencesStore.getState();
  const nonEnglish = !(preferredLanguage?.toLowerCase()?.startsWith('en'));

  const edgeResponse = await fetchApiElevenlabsSpeech(text, elevenLabsApiKey, voiceId || elevenLabsVoiceId, nonEnglish, true);
  // if (!liveAudioPlayer)
  const liveAudioPlayer = new AudioLivePlayer();
  // fire/forget
  void liveAudioPlayer.EXPERIMENTAL_playStream(edgeResponse);
}


/**
 * Note: we have to use this client-side API instead of TRPC because of ArrayBuffers..
 */
async function fetchApiElevenlabsSpeech(text: string, elevenLabsApiKey: string, elevenLabsVoiceId: string, nonEnglish: boolean, streaming: boolean): Promise<Response> {
  // NOTE: hardcoded 1000 as a failsafe, since the API will take very long and consume lots of credits for longer texts
  const speechInput: SpeechInputSchema = {
    elevenKey: elevenLabsApiKey,
    text: text.slice(0, 1000),
    voiceId: elevenLabsVoiceId,
    nonEnglish,
    ...(streaming && { streaming: true, streamOptimization: 4 }),
  };
 //Piper for TTS
   
  // const response: any = await axios.post('https://aitools.lamassucrm.com/piper/tts?model=US-danny&pitch=1',
  // {
  //   "message": text.slice(0, 1000),
  //   "filters":{"robotic":["roundstart"]}
  // });
  const response = await fetch('https://aitools.lamassucrm.com/piper/tts?model=US-danny&pitch=1', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: {
      message: text.slice(0, 1000),
      filters:{"robotic":["roundstart"]}
    },
  });
  // const response = await fetch('/api/elevenlabs/speech', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(speechInput),
  // });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || errorData.message || 'Unknown error');
  }

  return response;
}