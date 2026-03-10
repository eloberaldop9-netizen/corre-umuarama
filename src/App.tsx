import React from 'react';
import { motion } from 'motion/react';
import { 
  ArrowRight, 
  Target, 
  Heart, 
  Zap, 
  Users, 
  MapPin, 
  Instagram,
  MessageCircle,
  Activity,
  Brain,
  ShieldCheck,
  TrendingUp,
  Award,
  CheckCircle2,
  Phone
} from 'lucide-react';

const WHATSAPP_NUMBER = "5544999999999"; // Substitua pelo número real
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=Olá! Gostaria de saber mais sobre a assessoria Corre Umuarama.`;
const INSTAGRAM_LINK = "https://instagram.com/correumuarama";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  initial: {},
  whileInView: {
    transition: {
      staggerChildren: 0.1
    }
  },
  viewport: { once: true }
};

export default function App() {
  return (
    <div className="min-h-screen bg-brand-light font-sans overflow-x-hidden">
      {/* Header */}
      <header className="bg-brand-blue py-4 sticky top-0 z-50 shadow-md">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <img src="/logo.png" alt="Corre Umuarama" className="h-12 object-contain" onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }} />
            <div className="hidden text-white font-heading font-bold text-xl italic tracking-wider">
              CORRE <span className="text-brand-orange">UMUARAMA</span>
            </div>
          </motion.div>
          <motion.a 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            href={WHATSAPP_LINK} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="bg-brand-orange hover:bg-orange-600 text-white px-4 py-2 rounded-full font-semibold text-sm flex items-center gap-2 transition-colors shadow-lg shadow-orange-500/20"
          >
            <MessageCircle size={18} />
            <span className="hidden sm:inline">Fale Conosco</span>
          </motion.a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-brand-blue text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <motion.img 
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.2 }}
            transition={{ duration: 1.5 }}
            src="https://images.unsplash.com/photo-1552674605-db6ffd4facb5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
            alt="Pessoas correndo" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-brand-blue via-brand-blue/90 to-transparent"></div>
        </div>
        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="max-w-3xl">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-4xl md:text-6xl font-heading font-extrabold mb-6 leading-tight"
            >
              Transforme seu corpo e mente. <span className="text-brand-orange">Corra com a gente.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="text-lg md:text-xl mb-8 text-gray-200 leading-relaxed max-w-2xl"
            >
              Assessoria de corrida para iniciantes e corredores de todos os níveis, com acompanhamento profissional, acolhimento e treinos presenciais em Umuarama e online.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="bg-brand-orange hover:bg-orange-600 text-white px-8 py-4 rounded-full font-bold text-lg flex items-center justify-center gap-2 transition-transform hover:scale-105 shadow-xl shadow-orange-500/30">
                <MessageCircle size={24} />
                Quero fazer parte
              </a>
              <a href={INSTAGRAM_LINK} target="_blank" rel="noopener noreferrer" className="bg-white/10 hover:bg-white/20 border border-white/30 text-white px-8 py-4 rounded-full font-bold text-lg flex items-center justify-center gap-2 transition-colors">
                <Instagram size={24} />
                Conheça nosso Instagram
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Para Quem É */}
      <section className="py-20 bg-brand-light">
        <div className="container mx-auto px-4">
          <motion.div 
            {...fadeIn}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-brand-blue mb-4">A Corre Umuarama é para você que...</h2>
            <p className="text-gray-600">Não importa o seu ritmo ou experiência, temos o acompanhamento certo para o seu objetivo.</p>
          </motion.div>
          
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              { icon: <Target />, text: "Quer começar a correr do zero" },
              { icon: <TrendingUp />, text: "Quer sair da caminhada para a corrida" },
              { icon: <Activity />, text: "Quer melhorar o condicionamento físico" },
              { icon: <ShieldCheck />, text: "Quer evoluir com segurança" },
              { icon: <Award />, text: "Quer correr 5 km, 10 km ou meia maratona" },
              { icon: <Heart />, text: "Busca saúde física e mental" },
              { icon: <Zap />, text: "Quer mais constância e motivação" },
              { icon: <Users />, text: "Procura uma comunidade para crescer junto" }
            ].map((item, index) => (
              <motion.div 
                key={index}
                variants={fadeIn}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow group"
              >
                <div className="w-14 h-14 bg-orange-100 text-brand-orange rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {React.cloneElement(item.icon, { size: 28 })}
                </div>
                <p className="font-semibold text-gray-800">{item.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.h2 
            {...fadeIn}
            className="text-3xl md:text-4xl font-heading font-bold text-brand-blue text-center mb-16"
          >
            Benefícios da corrida para o corpo e para a mente
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Físicos */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-blue-50 p-8 rounded-3xl border border-blue-100"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-brand-blue text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <Activity size={24} />
                </div>
                <h3 className="text-2xl font-heading font-bold text-brand-blue">Benefícios Físicos</h3>
              </div>
              <ul className="space-y-4">
                {[
                  "Mais disposição no dia a dia",
                  "Melhora do condicionamento físico",
                  "Fortalecimento muscular",
                  "Melhora da saúde cardiovascular",
                  "Controle de peso",
                  "Aumento de energia",
                  "Melhora da postura e resistência"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="text-brand-orange shrink-0 mt-1" size={20} />
                    <span className="text-gray-700 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Mentais */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-orange-50 p-8 rounded-3xl border border-orange-100"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-brand-orange text-white rounded-full flex items-center justify-center shadow-lg shadow-orange-500/20">
                  <Brain size={24} />
                </div>
                <h3 className="text-2xl font-heading font-bold text-brand-orange">Benefícios Mentais</h3>
              </div>
              <ul className="space-y-4">
                {[
                  "Redução do estresse",
                  "Mais foco e clareza mental",
                  "Melhora da autoestima",
                  "Sensação de bem-estar",
                  "Mais disciplina",
                  "Mais confiança",
                  "Alívio da ansiedade e tensão do dia a dia"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="text-brand-blue shrink-0 mt-1" size={20} />
                    <span className="text-gray-700 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Diferenciais */}
      <section className="py-20 bg-brand-blue text-white">
        <div className="container mx-auto px-4">
          <motion.div 
            {...fadeIn}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Nosso diferencial</h2>
            <p className="text-blue-200">Por que escolher a Corre Umuarama e não treinar sozinho?</p>
          </motion.div>
          
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              "Treinos personalizados conforme objetivo e nível",
              "Atendimento acolhedor e próximo",
              "Orientação profissional",
              "Suporte para quem está começando",
              "Comunidade motivadora",
              "Presencial em Umuarama e online",
              "Evolução com segurança",
              "Acompanhamento contínuo",
              "Preparação para provas",
              "Ambiente que incentiva constância e superação"
            ].map((item, index) => (
              <motion.div 
                key={index}
                variants={fadeIn}
                className="flex items-start gap-4 bg-white/5 p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors"
              >
                <div className="w-10 h-10 bg-brand-orange/20 text-brand-orange rounded-full flex items-center justify-center shrink-0">
                  <CheckCircle2 size={20} />
                </div>
                <p className="font-medium text-lg pt-1">{item}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="py-20 bg-brand-light">
        <div className="container mx-auto px-4">
          <motion.h2 
            {...fadeIn}
            className="text-3xl md:text-4xl font-heading font-bold text-brand-blue text-center mb-16"
          >
            Como funciona
          </motion.h2>
          
          <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch max-w-5xl mx-auto">
            {/* Step 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex-1 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative text-center"
            >
              <div className="w-16 h-16 bg-brand-blue text-white text-2xl font-bold rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/30">1</div>
              <h3 className="text-xl font-bold text-brand-blue mb-3">Você entra em contato</h3>
              <p className="text-gray-600">Fala com a equipe para entendermos a melhor forma de você começar.</p>
            </motion.div>
            
            {/* Step 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex-1 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative text-center"
            >
              <div className="w-16 h-16 bg-brand-orange text-white text-2xl font-bold rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-orange-500/30">2</div>
              <h3 className="text-xl font-bold text-brand-blue mb-3">A gente entende seu objetivo</h3>
              <p className="text-gray-600">Seja saúde, constância, emagrecimento, performance ou preparação para prova.</p>
            </motion.div>
            
            {/* Step 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex-1 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative text-center"
            >
              <div className="w-16 h-16 bg-brand-blue text-white text-2xl font-bold rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/30">3</div>
              <h3 className="text-xl font-bold text-brand-blue mb-3">Você começa com acompanhamento</h3>
              <p className="text-gray-600">Com orientação profissional, apoio e evolução no seu próprio ritmo.</p>
            </motion.div>
          </div>
          
          <motion.div 
            {...fadeIn}
            className="mt-12 text-center"
          >
            <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="inline-flex bg-brand-orange hover:bg-orange-600 text-white px-8 py-4 rounded-full font-bold text-lg items-center justify-center gap-2 transition-transform hover:scale-105 shadow-lg shadow-orange-500/30">
              Dar o primeiro passo
              <ArrowRight size={20} />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Sobre */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-12 max-w-6xl">
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex-1"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-brand-blue mb-6">Mais do que corrida, uma comunidade</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              A <strong className="text-brand-orange">Corre Umuarama</strong> é uma assessoria de corrida que une orientação profissional, acolhimento e comunidade para ajudar pessoas de diferentes níveis a começarem ou evoluírem na corrida com segurança e constância.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Com treinos presenciais em Umuarama e acompanhamento online, a proposta é transformar a corrida em algo possível, prazeroso e sustentável para a sua vida.
            </p>
            <div className="mt-8 flex items-center gap-4 text-brand-blue font-semibold">
              <MapPin size={24} className="text-brand-orange shrink-0" />
              <span>Atendimento presencial em Umuarama, PR e Online para todo o Brasil.</span>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex-1 w-full"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-4/3">
              <img 
                src="https://images.unsplash.com/photo-1571008887538-b36bb32f4571?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                alt="Equipe correndo" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-brand-blue/10"></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Prova Social */}
      <section className="py-20 bg-brand-light">
        <div className="container mx-auto px-4">
          <motion.h2 
            {...fadeIn}
            className="text-3xl md:text-4xl font-heading font-bold text-brand-blue text-center mb-16"
          >
            Quem corre com a gente sente a diferença
          </motion.h2>
          
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
          >
            {[
              "Aqui você não precisa começar pronto.",
              "Cada passo importa.",
              "Você evolui no seu ritmo, com apoio de verdade.",
              "Correr em grupo transforma o processo."
            ].map((quote, index) => (
              <motion.div 
                key={index}
                variants={fadeIn}
                className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-center text-center relative hover:scale-105 transition-transform"
              >
                <div className="text-brand-orange/20 text-6xl font-serif absolute top-4 left-4">"</div>
                <p className="text-xl font-heading font-semibold text-gray-800 relative z-10 italic">
                  {quote}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 bg-brand-orange text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="lines" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M0 40L40 0H20L0 20M40 40V20L20 40" stroke="currentColor" strokeWidth="2" fill="none"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#lines)"/>
          </svg>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.h2 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-heading font-extrabold mb-6"
          >
            Vem fazer parte do nosso time
          </motion.h2>
          <motion.p 
            {...fadeIn}
            className="text-xl mb-10 max-w-2xl mx-auto font-medium text-orange-50"
          >
            Comece com apoio, evolua com segurança e descubra o que a corrida pode transformar na sua vida.
          </motion.p>
          <motion.div 
            {...fadeIn}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="bg-white text-brand-orange hover:bg-gray-50 px-8 py-4 rounded-full font-bold text-lg flex items-center justify-center gap-2 transition-transform hover:scale-105 shadow-xl">
              <MessageCircle size={24} />
              Chamar no WhatsApp
            </a>
            <a href={INSTAGRAM_LINK} target="_blank" rel="noopener noreferrer" className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-4 rounded-full font-bold text-lg flex items-center justify-center gap-2 transition-colors">
              <Instagram size={24} />
              Quero saber mais
            </a>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-blue text-white py-12 border-t border-white/10">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-4">
            <img src="/logo.png" alt="Corre Umuarama" className="h-12 object-contain" onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }} />
            <div className="hidden text-white font-heading font-bold text-2xl italic tracking-wider">
              CORRE <span className="text-brand-orange">UMUARAMA</span>
            </div>
            <p className="text-blue-200 text-sm max-w-xs text-center md:text-left">
              Transformando vidas através da corrida, com acolhimento e resultados reais.
            </p>
          </div>
          
          <div className="flex flex-col items-center md:items-end gap-3">
            <a href={INSTAGRAM_LINK} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-200 hover:text-white transition-colors">
              <Instagram size={20} />
              @correumuarama
            </a>
            <div className="flex items-center gap-2 text-blue-200">
              <MapPin size={20} />
              Umuarama, Paraná
            </div>
            <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-200 hover:text-white transition-colors">
              <Phone size={20} />
              Falar no WhatsApp
            </a>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-12 pt-8 border-t border-white/10 text-center text-blue-300 text-sm">
          <p>&copy; {new Date().getFullYear()} Corre Umuarama. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

