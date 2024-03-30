import { useState, useEffect, useRef } from 'react';
import { NEXT_PUBLIC_ALL_TALKS } from 'src/constants';
import WavPlayer from 'webaudio-wav-stream-player';

const useAudioPlayer = () => {
  const player = useRef(new WavPlayer());

  useEffect(() => {
    // Set event listeners for the player
    player.current.onFirstChunkReceived = () => {
      console.log('First chunk received');
    };
    player.current.onFirstChunkPlayed = () => {
      console.log('First chunk played');
    };

    return () => {
      // Cleanup: Stop the player when the component unmounts
      player.current.stop();
    };
  }, []);

  const fetchAndPlayAudio = async (text: string, language: string) => {
    await player.current.play(
      `${NEXT_PUBLIC_ALL_TALKS}/api/tts-generate-streaming?text=${encodeURIComponent(text)}&voice=female_02.wav&language=${language}&output_file=output.wav`,
    );
  };

  const stopAudio = () => {
    player.current.stop();
  };

  return {
    fetchAndPlayAudio,
    stopAudio,
  };
};

export default useAudioPlayer;
