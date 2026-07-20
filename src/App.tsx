import {Player} from '@remotion/player';
import {JarbasCugulaTriade} from './remotion/JarbasCugulaTriade';

export default function App() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 24,
        background: '#0a0a0b',
        padding: '40px 20px',
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
    </div>
  );
}
