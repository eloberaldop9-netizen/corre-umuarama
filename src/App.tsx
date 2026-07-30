import {Player} from '@remotion/player';
import {JarbasCugulaTriade} from './remotion/JarbasCugulaTriade';
import {OQueDizALei} from './remotion/OQueDizALei';
import {AConversaoFinal} from './remotion/AConversaoFinal';
import {AConsequencia} from './remotion/AConsequencia';
import {AFraturaPatrimonio} from './remotion/AFraturaPatrimonio';
import {AGarantiaEstrutural} from './remotion/AGarantiaEstrutural';
import {ORaioXDoDefeito} from './remotion/ORaioXDoDefeito';
import {OProtocoloDeDefesa} from './remotion/OProtocoloDeDefesa';
import {OUltimatoJuridico} from './remotion/OUltimatoJuridico';
import {AResponsabilidadeCincoAnos} from './remotion/AResponsabilidadeCincoAnos';
import {NaoEBemAssim} from './remotion/NaoEBemAssim';
import {CadaCasoExigeAnalise} from './remotion/CadaCasoExigeAnalise';

export default function App() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 48,
        background: '#0a0a0b',
        padding: '40px 20px',
      }}
    >
      <section
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 24,
        }}
      >
        <div style={{textAlign: 'center', color: '#8b8b8d', fontFamily: 'Inter, sans-serif'}}>
          <h1 style={{color: '#fff', fontSize: 22, marginBottom: 4}}>
            Dr. Jarbas Cugula &mdash; A Tr&iacute;ade Institucional
          </h1>
          <p style={{fontSize: 14, margin: 0}}>
            Preview da anima&ccedil;&atilde;o &middot; 1080&times;1920 &middot; 30fps &middot; 10s
          </p>
        </div>
        <Player
          component={JarbasCugulaTriade}
          durationInFrames={300}
          fps={30}
          compositionWidth={1080}
          compositionHeight={1920}
          style={{width: 'min(90vw, 430px)', aspectRatio: '9 / 16'}}
          controls
          loop
          autoPlay
          muted
          initialFrame={45}
          numberOfSharedAudioTags={0}
        />
      </section>

      <section
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 24,
        }}
      >
        <div style={{textAlign: 'center', color: '#8b8b8d', fontFamily: 'Inter, sans-serif'}}>
          <h1 style={{color: '#fff', fontSize: 22, marginBottom: 4}}>
            &ldquo;O que diz a lei?&rdquo; &mdash; Dobradi&ccedil;a Narrativa
          </h1>
          <p style={{fontSize: 14, margin: 0}}>
            Preview da anima&ccedil;&atilde;o &middot; 1080&times;1920 &middot; 30fps &middot; 3s
          </p>
        </div>
        <Player
          component={OQueDizALei}
          durationInFrames={90}
          fps={30}
          compositionWidth={1080}
          compositionHeight={1920}
          style={{width: 'min(90vw, 430px)', aspectRatio: '9 / 16'}}
          controls
          loop
          autoPlay
          muted
          initialFrame={45}
          numberOfSharedAudioTags={0}
        />
      </section>

      <section
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 24,
        }}
      >
        <div style={{textAlign: 'center', color: '#8b8b8d', fontFamily: 'Inter, sans-serif'}}>
          <h1 style={{color: '#fff', fontSize: 22, marginBottom: 4}}>
            A Convers&atilde;o Final &mdash; Instagram
          </h1>
          <p style={{fontSize: 14, margin: 0}}>
            Preview da anima&ccedil;&atilde;o &middot; 1080&times;1920 &middot; 30fps &middot; 6s
          </p>
        </div>
        <Player
          component={AConversaoFinal}
          durationInFrames={180}
          fps={30}
          compositionWidth={1080}
          compositionHeight={1920}
          style={{width: 'min(90vw, 430px)', aspectRatio: '9 / 16'}}
          controls
          loop
          autoPlay
          muted
          initialFrame={108}
          numberOfSharedAudioTags={0}
        />
      </section>

      <section
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 24,
        }}
      >
        <div style={{textAlign: 'center', color: '#8b8b8d', fontFamily: 'Inter, sans-serif'}}>
          <h1 style={{color: '#fff', fontSize: 22, marginBottom: 4}}>
            A Consequ&ecirc;ncia &mdash; Advert&ecirc;ncias
          </h1>
          <p style={{fontSize: 14, margin: 0}}>
            Preview da anima&ccedil;&atilde;o &middot; 1080&times;1920 &middot; 30fps &middot; 3s
          </p>
        </div>
        <Player
          component={AConsequencia}
          durationInFrames={90}
          fps={30}
          compositionWidth={1080}
          compositionHeight={1920}
          style={{width: 'min(90vw, 430px)', aspectRatio: '9 / 16'}}
          controls
          loop
          autoPlay
          muted
          initialFrame={40}
          numberOfSharedAudioTags={0}
        />
      </section>

      <section
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 24,
        }}
      >
        <div style={{textAlign: 'center', color: '#8b8b8d', fontFamily: 'Inter, sans-serif'}}>
          <h1 style={{color: '#fff', fontSize: 22, marginBottom: 4}}>
            A Fratura do Patrim&ocirc;nio &mdash; O Mito dos 5 Anos
          </h1>
          <p style={{fontSize: 14, margin: 0}}>
            Preview da anima&ccedil;&atilde;o &middot; 1080&times;1920 &middot; 30fps &middot; 4s
          </p>
        </div>
        <Player
          component={AFraturaPatrimonio}
          durationInFrames={120}
          fps={30}
          compositionWidth={1080}
          compositionHeight={1920}
          style={{width: 'min(90vw, 430px)', aspectRatio: '9 / 16'}}
          controls
          loop
          autoPlay
          muted
          initialFrame={70}
          numberOfSharedAudioTags={0}
        />
      </section>

      <section
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 24,
        }}
      >
        <div style={{textAlign: 'center', color: '#8b8b8d', fontFamily: 'Inter, sans-serif'}}>
          <h1 style={{color: '#fff', fontSize: 22, marginBottom: 4}}>
            A Garantia Estrutural &mdash; O Monumento de Concreto e A&ccedil;o
          </h1>
          <p style={{fontSize: 14, margin: 0}}>
            Preview da anima&ccedil;&atilde;o &middot; 1080&times;1920 &middot; 30fps &middot; 4s
          </p>
        </div>
        <Player
          component={AGarantiaEstrutural}
          durationInFrames={120}
          fps={30}
          compositionWidth={1080}
          compositionHeight={1920}
          style={{width: 'min(90vw, 430px)', aspectRatio: '9 / 16'}}
          controls
          loop
          autoPlay
          muted
          initialFrame={70}
          numberOfSharedAudioTags={0}
        />
      </section>

      <section
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 24,
        }}
      >
        <div style={{textAlign: 'center', color: '#8b8b8d', fontFamily: 'Inter, sans-serif'}}>
          <h1 style={{color: '#fff', fontSize: 22, marginBottom: 4}}>
            O Raio-X do Defeito Oculto
          </h1>
          <p style={{fontSize: 14, margin: 0}}>
            Preview da anima&ccedil;&atilde;o &middot; 1080&times;1920 &middot; 30fps &middot; 4.3s
          </p>
        </div>
        <Player
          component={ORaioXDoDefeito}
          durationInFrames={130}
          fps={30}
          compositionWidth={1080}
          compositionHeight={1920}
          style={{width: 'min(90vw, 430px)', aspectRatio: '9 / 16'}}
          controls
          loop
          autoPlay
          muted
          initialFrame={90}
          numberOfSharedAudioTags={0}
        />
      </section>

      <section
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 24,
        }}
      >
        <div style={{textAlign: 'center', color: '#8b8b8d', fontFamily: 'Inter, sans-serif'}}>
          <h1 style={{color: '#fff', fontSize: 22, marginBottom: 4}}>
            O Protocolo de Defesa &mdash; Checklist de A&ccedil;&atilde;o
          </h1>
          <p style={{fontSize: 14, margin: 0}}>
            Preview da anima&ccedil;&atilde;o &middot; 1080&times;1920 &middot; 30fps &middot; 4s
          </p>
        </div>
        <Player
          component={OProtocoloDeDefesa}
          durationInFrames={120}
          fps={30}
          compositionWidth={1080}
          compositionHeight={1920}
          style={{width: 'min(90vw, 430px)', aspectRatio: '9 / 16'}}
          controls
          loop
          autoPlay
          muted
          initialFrame={60}
          numberOfSharedAudioTags={0}
        />
      </section>

      <section
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 24,
        }}
      >
        <div style={{textAlign: 'center', color: '#8b8b8d', fontFamily: 'Inter, sans-serif'}}>
          <h1 style={{color: '#fff', fontSize: 22, marginBottom: 4}}>
            O Ultimato Jur&iacute;dico &mdash; O Rel&oacute;gio Institucional
          </h1>
          <p style={{fontSize: 14, margin: 0}}>
            Preview da anima&ccedil;&atilde;o &middot; 1080&times;1920 &middot; 30fps &middot; 4s
          </p>
        </div>
        <Player
          component={OUltimatoJuridico}
          durationInFrames={120}
          fps={30}
          compositionWidth={1080}
          compositionHeight={1920}
          style={{width: 'min(90vw, 430px)', aspectRatio: '9 / 16'}}
          controls
          loop
          autoPlay
          muted
          initialFrame={60}
          numberOfSharedAudioTags={0}
        />
      </section>

      <section
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 24,
        }}
      >
        <div style={{textAlign: 'center', color: '#8b8b8d', fontFamily: 'Inter, sans-serif'}}>
          <h1 style={{color: '#fff', fontSize: 22, marginBottom: 4}}>
            A Responsabilidade dos 5 Anos &mdash; Institucional
          </h1>
          <p style={{fontSize: 14, margin: 0}}>
            Preview da anima&ccedil;&atilde;o &middot; 1080&times;1920 &middot; 30fps &middot; 7s
          </p>
        </div>
        <Player
          component={AResponsabilidadeCincoAnos}
          durationInFrames={210}
          fps={30}
          compositionWidth={1080}
          compositionHeight={1920}
          style={{width: 'min(90vw, 430px)', aspectRatio: '9 / 16'}}
          controls
          loop
          autoPlay
          muted
          initialFrame={60}
          numberOfSharedAudioTags={0}
        />
      </section>

      <section
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 24,
        }}
      >
        <div style={{textAlign: 'center', color: '#8b8b8d', fontFamily: 'Inter, sans-serif'}}>
          <h1 style={{color: '#fff', fontSize: 22, marginBottom: 4}}>
            &ldquo;N&atilde;o &Eacute; Bem Assim&rdquo; &mdash; Kinetic Typography
          </h1>
          <p style={{fontSize: 14, margin: 0}}>
            Preview da anima&ccedil;&atilde;o &middot; 1080&times;1920 &middot; 30fps &middot; 7.8s
          </p>
        </div>
        <Player
          component={NaoEBemAssim}
          durationInFrames={234}
          fps={30}
          compositionWidth={1080}
          compositionHeight={1920}
          style={{width: 'min(90vw, 430px)', aspectRatio: '9 / 16'}}
          controls
          loop
          autoPlay
          muted
          initialFrame={150}
          numberOfSharedAudioTags={0}
        />
      </section>

      <section
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 24,
        }}
      >
        <div style={{textAlign: 'center', color: '#8b8b8d', fontFamily: 'Inter, sans-serif'}}>
          <h1 style={{color: '#fff', fontSize: 22, marginBottom: 4}}>
            &ldquo;Cada Caso Exige An&aacute;lise&rdquo; &mdash; Or&iacute;gem, Provas e Prazos
          </h1>
          <p style={{fontSize: 14, margin: 0}}>
            Preview da anima&ccedil;&atilde;o &middot; 1080&times;1920 &middot; 30fps &middot; 6s
          </p>
        </div>
        <Player
          component={CadaCasoExigeAnalise}
          durationInFrames={180}
          fps={30}
          compositionWidth={1080}
          compositionHeight={1920}
          style={{width: 'min(90vw, 430px)', aspectRatio: '9 / 16'}}
          controls
          loop
          autoPlay
          muted
          initialFrame={100}
          numberOfSharedAudioTags={0}
        />
      </section>
    </div>
  );
}
