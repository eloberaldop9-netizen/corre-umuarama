// Caption chunks per scene, in LOCAL frames (relative to each scene's own
// <Sequence>), derived from the actual voiceover script aligned to the
// silence/pause boundaries measured from the recording's waveform (30fps).
export type CaptionChunk = {
  text: string;
  start: number;
  end: number;
};

export const scene1Captions: CaptionChunk[] = [
  {text: 'Sua IPTV parou de funcionar?', start: 0, end: 84},
];

export const scene2Captions: CaptionChunk[] = [
  {text: 'Antes de achar que o problema é a sua internet, atenção:', start: 12, end: 103},
  {
    text: 'Serviços de IPTV não oficiais e aparelhos de TV box irregulares podem sofrer bloqueios e ficar fora do ar,',
    start: 113,
    end: 274,
  },
  {
    text: 'mesmo quando a sua conexão com a internet está funcionando normalmente.',
    start: 284,
    end: 373,
  },
];

export const scene3Captions: CaptionChunk[] = [
  {text: 'Então, faça um teste simples:', start: 9, end: 54},
  {text: 'Seu celular conecta no Wi-Fi?', start: 71, end: 122},
  {
    text: 'YouTube, Instagram e outros aplicativos estão funcionando normalmente?',
    start: 133,
    end: 234,
  },
];

export const scene4Captions: CaptionChunk[] = [
  {
    text: 'Se a resposta for sim, mas somente a IPTV não funciona, provavelmente o problema não está na sua internet.',
    start: 7,
    end: 161,
  },
];

export const scene5Captions: CaptionChunk[] = [
  {
    text: 'A V10 Net continua entregando a sua conexão normalmente,',
    start: 4,
    end: 88,
  },
  {
    text: 'mas não possui controle sobre servidores, aplicativos ou serviços de IPTV de terceiros.',
    start: 94,
    end: 216,
  },
];

export const scene6Captions: CaptionChunk[] = [
  {text: 'Qualquer dúvida, entre em contato com a nossa equipe.', start: 4, end: 76},
];
