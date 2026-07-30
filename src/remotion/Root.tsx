import React from 'react';
import {Composition} from 'remotion';
import {JarbasCugulaTriade} from './JarbasCugulaTriade';
import {OQueDizALei} from './OQueDizALei';
import {AConversaoFinal} from './AConversaoFinal';
import {AConsequencia} from './AConsequencia';
import {AFraturaPatrimonio} from './AFraturaPatrimonio';
import {AGarantiaEstrutural} from './AGarantiaEstrutural';
import {ORaioXDoDefeito} from './ORaioXDoDefeito';
import {OProtocoloDeDefesa} from './OProtocoloDeDefesa';
import {OUltimatoJuridico} from './OUltimatoJuridico';
import {AResponsabilidadeCincoAnos} from './AResponsabilidadeCincoAnos';
import {NaoEBemAssim} from './NaoEBemAssim';
import {CadaCasoExigeAnalise} from './CadaCasoExigeAnalise';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="JarbasCugulaTriade"
        component={JarbasCugulaTriade}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="OQueDizALei"
        component={OQueDizALei}
        durationInFrames={90}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="AConversaoFinal"
        component={AConversaoFinal}
        durationInFrames={180}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="AConsequencia"
        component={AConsequencia}
        durationInFrames={90}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="AFraturaPatrimonio"
        component={AFraturaPatrimonio}
        durationInFrames={120}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="AGarantiaEstrutural"
        component={AGarantiaEstrutural}
        durationInFrames={120}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ORaioXDoDefeito"
        component={ORaioXDoDefeito}
        durationInFrames={130}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="OProtocoloDeDefesa"
        component={OProtocoloDeDefesa}
        durationInFrames={120}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="OUltimatoJuridico"
        component={OUltimatoJuridico}
        durationInFrames={120}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="AResponsabilidadeCincoAnos"
        component={AResponsabilidadeCincoAnos}
        durationInFrames={210}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="NaoEBemAssim"
        component={NaoEBemAssim}
        durationInFrames={234}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="CadaCasoExigeAnalise"
        component={CadaCasoExigeAnalise}
        durationInFrames={180}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
