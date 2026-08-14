// Caption chunks per scene, in LOCAL frames (relative to each scene's own
// <Sequence>), derived from the actual voiceover script aligned to the
// silence/pause boundaries measured from the recording's waveform (30fps).
// Long sentences are split into several short chunks (~5-8 words each, so
// they never wrap past 2 lines on screen) whose durations are apportioned
// by word count within the original measured phrase window.
export type CaptionChunk = {
  text: string;
  start: number;
  end: number;
};

export const scene1Captions: CaptionChunk[] = [
  {text: 'Sua IPTV parou de funcionar?', start: 0, end: 84},
];

export const scene2Captions: CaptionChunk[] = [
  {text: 'Antes de achar que o problema é', start: 12, end: 76},
  {text: 'a sua internet, atenção:', start: 76, end: 103},

  {text: 'Serviços de IPTV não oficiais e', start: 113, end: 164},
  {text: 'aparelhos de TV box irregulares podem', start: 164, end: 215},
  {text: 'sofrer bloqueios e ficar fora do ar,', start: 215, end: 274},

  {text: 'mesmo quando a sua conexão com a', start: 284, end: 340},
  {text: 'internet está funcionando normalmente.', start: 340, end: 373},
];

export const scene3Captions: CaptionChunk[] = [
  {text: 'Então, faça um teste simples:', start: 9, end: 54},
  {text: 'Seu celular conecta no Wi-Fi?', start: 71, end: 122},
  {text: 'YouTube, Instagram e outros aplicativos', start: 133, end: 196},
  {text: 'estão funcionando normalmente?', start: 196, end: 234},
];

export const scene4Captions: CaptionChunk[] = [
  {text: 'Se a resposta for sim,', start: 7, end: 48},
  {text: 'mas somente a IPTV não funciona,', start: 48, end: 96},
  {text: 'provavelmente o problema não está na sua internet.', start: 96, end: 161},
];

export const scene5Captions: CaptionChunk[] = [
  {text: 'A V10 Net continua entregando', start: 4, end: 51},
  {text: 'a sua conexão normalmente,', start: 51, end: 88},

  {text: 'mas não possui controle sobre servidores,', start: 94, end: 150},
  {text: 'aplicativos ou serviços de IPTV de terceiros.', start: 150, end: 216},
];

export const scene6Captions: CaptionChunk[] = [
  {text: 'Qualquer dúvida, entre em contato', start: 4, end: 44},
  {text: 'com a nossa equipe.', start: 44, end: 76},
];
