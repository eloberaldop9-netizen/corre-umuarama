import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile } from 'remotion';
import { Protecao1_Manchete } from './scenes/Protecao1_Manchete';
import { Protecao2_Propostas } from './scenes/Protecao2_Propostas';
import { Protecao3_Leis } from './scenes/Protecao3_Leis';
import { Protecao4_Rede } from './scenes/Protecao4_Rede';
import { PROTECAO_SCENES, PROTECAO_TOTAL_FRAMES } from './protecao-timing';

// Vídeo 04 — "Ana Novais — Proteção à Infância"
// Proposta: combate à violência contra crianças e adolescentes.
// Estética "jornal limpo": página de jornal minimalista (papel, manchete em
// serifa, foto P&B de matéria, marca-texto amarelo, acentos roxos), com o
// ritmo e o respiro do vídeo aprovado "A Causa" — só letterings-chave.
export const TOTAL_FRAMES = PROTECAO_TOTAL_FRAMES;

export interface ProtecaoAssets {
  fotoViolencia: string; // Cena 1 — menina encolhida com o ursinho (violência)
  fotoPrevencao: string; // Cena 2 — mão do adulto segurando a da criança (prevenção)
  fotoEscola: string; // Cena 2 — sala de aula, mãos levantadas (educação nas escolas)
  fotoPsicologo: string; // Cena 2 — psicóloga acolhendo a criança (atendimento)
  fotoLeis: string; // Cena 3 — martelo da Justiça e livros (leis)
  fotoDenuncia: string; // Cena 3 — dedo discando no celular (canais de denúncia)
  fotoRede: string; // Cena 4 — mãos protegendo a roda de pessoas (rede integrada)
  narracao: string | null;
}

// Fotos licenciadas do Adobe Stock (licença gratuita).
export const PROTECAO_ASSETS: ProtecaoAssets = {
  fotoViolencia: 'stock-violencia.jpg',
  fotoPrevencao: 'stock-prevencao.jpg',
  fotoEscola: 'stock-escola.jpg',
  fotoPsicologo: 'stock-psicologo.jpg',
  fotoLeis: 'stock-leis.jpg',
  fotoDenuncia: 'stock-denuncia.jpg',
  fotoRede: 'stock-rede.jpg',
  narracao: 'narracao-protecao.mp3',
};

export const VideoAnaNovaisProtecao: React.FC = () => {
  const A = PROTECAO_ASSETS;
  const S = PROTECAO_SCENES;
  return (
    <AbsoluteFill style={{ backgroundColor: '#000000' }}>
      {A.narracao ? <Audio src={staticFile(`assets/${A.narracao}`)} /> : null}
      <Sequence name="Cena 1 — A Manchete" from={S.c1.from} durationInFrames={S.c1.duration}>
        <Protecao1_Manchete assets={A} />
      </Sequence>
      <Sequence name="Cena 2 — As Propostas" from={S.c2.from} durationInFrames={S.c2.duration}>
        <Protecao2_Propostas assets={A} />
      </Sequence>
      <Sequence name="Cena 3 — As Leis" from={S.c3.from} durationInFrames={S.c3.duration}>
        <Protecao3_Leis assets={A} />
      </Sequence>
      <Sequence name="Cena 4 — A Rede Integrada" from={S.c4.from} durationInFrames={S.c4.duration}>
        <Protecao4_Rede assets={A} />
      </Sequence>
    </AbsoluteFill>
  );
};
