import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile } from 'remotion';
import {
  VM_Avancar, VM_Capa, VM_Escolas, VM_Fundo, VM_Lei, VM_Mecanismo, VM_Mulher, VM_Patrulha, VM_Politicas, VM_Unidas, VM_Vereadora, VM_Violencia,
} from './scenes/VMulher';
import { VM_Selo } from './scenes/VM_Selo';
import { BEATS, OFFSET, VM_ASSETS, VMULHER_TOTAL_FRAMES } from './vmulher-timing';

// Vídeo 03 (refeito) — "Ana Novais — Violência contra a Mulher".
// Capa com a foto da mão + UNIDAS CONSEGUIREMOS VENCER ESSA BATALHA; áudio da
// própria Ana (Lei Maria da Penha, Agosto Lilás, Patrulha Maria da Penha,
// fundo de capacitação); modelo de motion da referência do Senado adaptado à
// paleta e à tipografia da campanha.
export const TOTAL_FRAMES = VMULHER_TOTAL_FRAMES;

const seq = (name: string, b: { from: number; to: number }, el: React.ReactNode) => (
  <Sequence name={name} from={b.from} durationInFrames={b.to - b.from}>{el}</Sequence>
);

export const VideoAnaNovaisViolenciaMulher: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#000000' }}>
    <Sequence from={OFFSET}><Audio src={staticFile(`assets/${VM_ASSETS.narracao}`)} /></Sequence>
    {seq('Capa', BEATS.capa, <VM_Capa />)}
    {seq('1 — Lei Maria da Penha', BEATS.lei, <VM_Lei />)}
    {seq('2 — Violência doméstica', BEATS.violencia, <VM_Violencia />)}
    {seq('3 — Temos que avançar', BEATS.avancar, <VM_Avancar />)}
    {seq('4 — Vereadora / Agosto Lilás', BEATS.vereadora, <VM_Vereadora />)}
    {seq('5 — Nas escolas', BEATS.escolas, <VM_Escolas />)}
    {seq('6 — Como mulher', BEATS.mulher, <VM_Mulher />)}
    {seq('7 — Patrulha Maria da Penha', BEATS.patrulha, <VM_Patrulha />)}
    {seq('8 — Mais um mecanismo', BEATS.mecanismo, <VM_Mecanismo />)}
    {seq('9 — Fundo especial', BEATS.fundo, <VM_Fundo />)}
    {seq('10 — Políticas públicas', BEATS.politicas, <VM_Politicas />)}
    {seq('11 — Unidas', BEATS.unidas, <VM_Unidas />)}
    {seq('Selo', BEATS.selo, <VM_Selo />)}
  </AbsoluteFill>
);
