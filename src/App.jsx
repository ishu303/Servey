import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useSpring } from 'framer-motion';
import { ChevronDown, Check, Heart, BookOpen, TrendingUp, Users, Zap, Target, Sparkles } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import confetti from 'canvas-confetti';
import SmoothScrollWrapper from './components/SmoothScrollWrapper';
import MagneticButton from './components/MagneticButton';
import CustomCursor from './components/CustomCursor';
import ParticleField from './components/ParticleField';

// Main App Component with Smooth Scroll
const MindExplorationApp = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState({
    firstThought: '',
    persona: '',
    challenge: '',
    role: '',
    timeCommitment: '',
    supportTypes: [],
    reflection: ''
  });

  const { scrollYProgress } = useScroll();
  const scaleProgress = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const opacityProgress = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.6]);

  const sectionRefs = useRef([]);
  const totalSections = 9;

  const scrollToSection = (index) => {
    if (sectionRefs.current[index]) {
      sectionRefs.current[index].scrollIntoView({ behavior: 'smooth' });
      setCurrentSection(index);
    }
  };

  useEffect(() => {
    const observers = sectionRefs.current.map((ref, index) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setCurrentSection(index);
          }
        },
        { threshold: 0.5 }
      );
      if (ref) observer.observe(ref);
      return observer;
    });

    return () => observers.forEach(obs => obs.disconnect());
  }, []);

  const updateAnswer = (key, value) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    // Celebration confetti effect
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#a855f7', '#3b82f6', '#ec4899', '#10b981']
    });

    setTimeout(() => {
      confetti({
        particleCount: 100,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#a855f7', '#3b82f6'],
      });
      confetti({
        particleCount: 100,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ec4899', '#10b981'],
      });
    }, 250);

    console.log('Collected answers:', answers);
    scrollToSection(8);
  };

  return (
    <SmoothScrollWrapper>
      <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-950 overflow-x-hidden">
        {/* Custom Cursor */}
        <CustomCursor />

        {/* Particle Field */}
        <ParticleField />

        {/* Animated gradient overlay */}
        <motion.div
          className="fixed inset-0 pointer-events-none z-0"
          style={{ opacity: opacityProgress }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-orange-600/10 via-amber-600/10 to-teal-600/10 animate-gradient" />
        </motion.div>

        {/* Enhanced Progress Bar */}
        <EnhancedProgressBar current={currentSection} total={totalSections} scrollProgress={scrollYProgress} />

        {/* Section 1: Hero */}
        <section ref={el => sectionRefs.current[0] = el} className="min-h-screen flex items-center justify-center px-4 relative z-10">
          <HeroSection onStart={() => scrollToSection(1)} />
        </section>

        {/* Section 2: First Thought */}
        <section ref={el => sectionRefs.current[1] = el} className="min-h-screen flex items-center justify-center px-4 py-20 relative z-10">
          <FirstThoughtSection
            value={answers.firstThought}
            onChange={(val) => updateAnswer('firstThought', val)}
            onNext={() => scrollToSection(2)}
          />
        </section>

        {/* Section 3: Persona */}
        <section ref={el => sectionRefs.current[2] = el} className="min-h-screen flex items-center justify-center px-4 py-20 relative z-10">
          <PersonaSection
            value={answers.persona}
            onChange={(val) => updateAnswer('persona', val)}
            onNext={() => scrollToSection(3)}
          />
        </section>

        {/* Section 4: Challenge */}
        <section ref={el => sectionRefs.current[3] = el} className="min-h-screen flex items-center justify-center px-4 py-20 relative z-10">
          <ChallengeSection
            value={answers.challenge}
            onChange={(val) => updateAnswer('challenge', val)}
            onNext={() => scrollToSection(4)}
          />
        </section>

        {/* Section 5: Role */}
        <section ref={el => sectionRefs.current[4] = el} className="min-h-screen flex items-center justify-center px-4 py-20 relative z-10">
          <RoleSection
            value={answers.role}
            onChange={(val) => updateAnswer('role', val)}
            onNext={() => scrollToSection(5)}
          />
        </section>

        {/* Section 6: Time Commitment */}
        <section ref={el => sectionRefs.current[5] = el} className="min-h-screen flex items-center justify-center px-4 py-20 relative z-10">
          <TimeSection
            value={answers.timeCommitment}
            onChange={(val) => updateAnswer('timeCommitment', val)}
            onNext={() => scrollToSection(6)}
          />
        </section>

        {/* Section 7: Support Type */}
        <section ref={el => sectionRefs.current[6] = el} className="min-h-screen flex items-center justify-center px-4 py-20 relative z-10">
          <SupportSection
            values={answers.supportTypes}
            onChange={(val) => updateAnswer('supportTypes', val)}
            onNext={() => scrollToSection(7)}
          />
        </section>

        {/* Section 8: Reflection */}
        <section ref={el => sectionRefs.current[7] = el} className="min-h-screen flex items-center justify-center px-4 py-20 relative z-10">
          <ReflectionSection
            value={answers.reflection}
            onChange={(val) => updateAnswer('reflection', val)}
            onSubmit={handleSubmit}
          />
        </section>

        {/* Section 9: Thank You */}
        <section ref={el => sectionRefs.current[8] = el} className="min-h-screen flex items-center justify-center px-4 relative z-10">
          <ThankYouSection />
        </section>
      </div>
    </SmoothScrollWrapper>
  );
};

// Enhanced Progress Bar with Animation
const EnhancedProgressBar = ({ current, total, scrollProgress }) => {
  const scaleX = useSpring(scrollProgress, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-xl shadow-2xl border-b border-orange-600/20"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <motion.div
        className="h-1 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600"
        style={{ scaleX, transformOrigin: 'left' }}
      />
      <div className="flex justify-center items-center gap-2 py-4">
        {[...Array(total)].map((_, i) => (
          <motion.div
            key={i}
            className={`rounded-full transition-all duration-500 ${i <= current
              ? 'w-3 h-3 bg-gradient-to-r from-orange-600 to-amber-600 shadow-lg shadow-orange-600/50'
              : 'w-2 h-2 bg-slate-600'
              }`}
            animate={i === current ? { scale: [1, 1.3, 1] } : {}}
            transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 1 }}
          />
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950/50 pointer-events-none" />
    </motion.div>
  );
};

// Hero Section with 3D Effects
const HeroSection = ({ onStart }) => {
  const [ref, inView] = useInView({ threshold: 0.3, triggerOnce: false });

  return (
    <motion.div
      ref={ref}
      className="text-center max-w-4xl relative"
      initial={{ opacity: 0, y: 100 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      {/* Glowing orb behind text */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      <motion.div
        initial={{ scale: 0.8 }}
        animate={inView ? { scale: 1 } : { scale: 0.8 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <motion.h1
          className="text-6xl md:text-8xl font-bold mb-6 leading-tight relative z-10"
          style={{
            background: 'linear-gradient(to right, #a855f7, #3b82f6, #ec4899)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
          animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
          transition={{ duration: 5, repeat: Infinity }}
        >
          Let's See What's in Your Mind Today 👀
        </motion.h1>
      </motion.div>

      <motion.p
        className="text-xl md:text-2xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        No forms. No right or wrong answers.<br />
        Just a small interactive experiment with your thoughts.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <MagneticButton
          onClick={onStart}
          className="group px-10 py-5 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-full text-xl font-bold shadow-2xl shadow-orange-600/50 hover:shadow-purple-500/70 transform transition-all duration-300 relative overflow-hidden"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-teal-600 to-orange-600"
            initial={{ x: '100%' }}
            whileHover={{ x: 0 }}
            transition={{ duration: 0.3 }}
          />
          <span className="relative z-10 flex items-center gap-2">
            Start the Experience
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ChevronDown className="w-6 h-6" />
            </motion.div>
          </span>
        </MagneticButton>
      </motion.div>

      {/* Floating icons */}
      <div className="absolute inset-0 pointer-events-none">
        {[Sparkles, Zap, Heart, Target].map((Icon, i) => (
          <motion.div
            key={i}
            className="absolute text-orange-400/20"
            style={{
              left: `${20 + i * 20}%`,
              top: `${30 + (i % 2) * 40}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, 0],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          >
            <Icon className="w-12 h-12" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// First Thought Section with Stagger Animation
const FirstThoughtSection = ({ value, onChange, onNext }) => {
  const bubbles = ['Guidance', 'Direction', 'Community', 'Motivation', 'Experience', 'Someone to Ask'];
  const [selected, setSelected] = useState(value);
  const [customInput, setCustomInput] = useState('');
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: false });

  const handleBubbleClick = (bubble) => {
    setSelected(bubble);
    onChange(bubble);
    setCustomInput('');
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setCustomInput(val);
    onChange(val);
    setSelected('');
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 50, scale: 0.8 },
    show: { opacity: 1, y: 0, scale: 1 }
  };

  return (
    <motion.div
      ref={ref}
      className="max-w-5xl w-full"
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      variants={container}
    >
      <motion.div className="text-center mb-12" variants={item}>
        <h2 className="text-5xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
          First Thought
        </h2>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto">
          When you think about growing in life — skills, career, confidence — what's the FIRST thing that pops into your mind?
        </p>
      </motion.div>

      <motion.div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8" variants={container}>
        {bubbles.map((bubble) => (
          <motion.button
            key={bubble}
            onClick={() => handleBubbleClick(bubble)}
            className={`p-6 rounded-2xl text-lg font-semibold transition-all duration-300 relative overflow-hidden group ${selected === bubble
              ? 'bg-gradient-to-br from-orange-600 to-amber-600 text-white shadow-2xl shadow-orange-600/50'
              : 'bg-slate-800/50 backdrop-blur-sm text-slate-200 hover:bg-slate-800/80 border border-orange-600/20'
              }`}
            variants={item}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-orange-600/50 to-amber-600/50"
              initial={{ x: '-100%' }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3 }}
            />
            <span className="relative z-10">{bubble}</span>
          </motion.button>
        ))}
      </motion.div>

      <motion.div className="text-center mb-8" variants={item}>
        <p className="text-slate-400 mb-3">Or type your own:</p>
        <motion.input
          type="text"
          value={customInput}
          onChange={handleInputChange}
          placeholder="Type one word or short phrase..."
          className="w-full max-w-md px-6 py-4 rounded-full bg-slate-800/50 backdrop-blur-sm border-2 border-orange-500/30 focus:border-orange-500 focus:outline-none text-center text-white transition-all placeholder-slate-500"
          whileFocus={{ scale: 1.02, borderColor: '#a855f7' }}
        />
      </motion.div>

      <AnimatePresence>
        {(selected || customInput) && (
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <MagneticButton
              onClick={onNext}
              className="px-10 py-4 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-full font-bold shadow-2xl shadow-orange-600/50 hover:shadow-purple-500/70"
            >
              Next →
            </MagneticButton>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Persona Section with 3D Tilt
const PersonaSection = ({ value, onChange, onNext }) => {
  const personas = [
    { id: 'explorer', icon: '🔍', title: 'The Explorer', desc: 'Curious, tries things alone first' },
    { id: 'strategist', icon: '🎯', title: 'The Strategist', desc: 'Wants a clear path' },
    { id: 'mentor-seeker', icon: '🧑‍🏫', title: 'The Mentor-Seeker', desc: 'Likes asking someone experienced' },
    { id: 'lone-wolf', icon: '🐺', title: 'The Lone Wolf', desc: 'Figures things out solo' },
    { id: 'quick-learner', icon: '⚡', title: 'The Quick Learner', desc: 'Learns by doing fast' }
  ];

  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: false });

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const item = {
    hidden: { opacity: 0, y: 30, rotateX: -15 },
    show: { opacity: 1, y: 0, rotateX: 0 }
  };

  return (
    <motion.div
      ref={ref}
      className="max-w-6xl w-full"
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      variants={container}
    >
      <motion.div className="text-center mb-12" variants={item}>
        <h2 className="text-5xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-teal-400 to-orange-400 bg-clip-text text-transparent">
          Which version of you shows up?
        </h2>
        <p className="text-xl text-slate-300">
          When you start something new… which version of 'you' usually appears?
        </p>
      </motion.div>

      <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8" variants={container}>
        {personas.map((persona) => (
          <motion.button
            key={persona.id}
            onClick={() => onChange(persona.id)}
            className={`p-8 rounded-3xl text-left transition-all duration-300 relative overflow-hidden group perspective ${value === persona.id
                ? 'bg-gradient-to-br from-teal-600 to-orange-600 text-white shadow-2xl shadow-teal-500/50 scale-105'
                : 'bg-slate-800/50 backdrop-blur-sm border border-teal-500/20 hover:border-blue-500/50'
              }`}
            variants={item}
            whileHover={{ scale: 1.05, rotateY: 5, z: 50 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-orange-500/20"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />

            <motion.div
              className="text-5xl mb-4"
              animate={value === persona.id ? { scale: [1, 1.2, 1], rotate: [0, 10, 0] } : {}}
              transition={{ duration: 0.5 }}
            >
              {persona.icon}
            </motion.div>

            <h3 className={`text-2xl font-bold mb-2 relative z-10 ${value === persona.id ? 'text-white' : 'text-slate-200'}`}>
              {persona.title}
            </h3>
            <p className={`relative z-10 ${value === persona.id ? 'text-blue-100' : 'text-slate-400'}`}>
              {persona.desc}
            </p>

            {value === persona.id && (
              <motion.div
                className="absolute top-4 right-4"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                <Check className="text-white w-7 h-7" />
              </motion.div>
            )}
          </motion.button>
        ))}
      </motion.div>

      <AnimatePresence>
        {value && (
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <MagneticButton
              onClick={onNext}
              className="px-10 py-4 bg-gradient-to-r from-teal-600 to-orange-600 text-white rounded-full font-bold shadow-2xl shadow-teal-500/50"
            >
              Next →
            </MagneticButton>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Challenge Section
const ChallengeSection = ({ value, onChange, onNext }) => {
  const challenges = [
    "Not knowing where to start",
    "No one to guide me",
    "Too much information online",
    "Lack of confidence",
    "No structure / no direction",
    "Not sure which skill is right for me"
  ];

  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: false });

  return (
    <motion.div
      ref={ref}
      className="max-w-4xl w-full"
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6 }}
    >
      <div className="text-center mb-12">
        <motion.h2
          className="text-5xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent"
          initial={{ scale: 0.8 }}
          animate={inView ? { scale: 1 } : { scale: 0.8 }}
          transition={{ duration: 0.5 }}
        >
          Your Roadblocks
        </motion.h2>
        <p className="text-xl text-slate-300">
          Which kind of hurdle slows you down the most when you're trying to grow or learn something?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {challenges.map((challenge, i) => (
          <motion.button
            key={challenge}
            onClick={() => onChange(challenge)}
            className={`p-6 rounded-2xl text-lg font-medium text-left transition-all duration-300 ${value === challenge
                ? 'bg-gradient-to-br from-amber-600 to-orange-600 text-white shadow-2xl shadow-amber-500/50 scale-105'
                : 'bg-slate-800/50 backdrop-blur-sm text-slate-200 border border-amber-500/20 hover:border-pink-500/50'
              }`}
            initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            whileHover={{ scale: 1.03, x: 5 }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="relative z-10">{challenge}</span>
            {value === challenge && (
              <motion.div
                className="inline-block ml-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Check className="w-5 h-5" />
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {value && (
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <MagneticButton
              onClick={onNext}
              className="px-10 py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-full font-bold shadow-2xl shadow-amber-500/50"
            >
              Next →
            </MagneticButton>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Role Section
const RoleSection = ({ value, onChange, onNext }) => {
  const roles = [
    { text: "I'd love to help others — even a little.", icon: <Heart className="w-6 h-6" /> },
    { text: "I prefer learning from someone experienced.", icon: <BookOpen className="w-6 h-6" /> },
    { text: "Depends on the situation.", icon: <TrendingUp className="w-6 h-6" /> },
    { text: "Both! Teach and learn.", icon: <Users className="w-6 h-6" /> },
    { text: "Not sure yet.", icon: <Target className="w-6 h-6" /> }
  ];

  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: false });

  return (
    <motion.div
      ref={ref}
      className="max-w-3xl w-full"
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="text-center mb-12">
        <motion.h2
          className="text-5xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent"
          initial={{ y: 30, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          What's Your Natural Role?
        </motion.h2>
        <p className="text-xl text-slate-300">
          Imagine a space where people help each other grow. What role would you naturally take?
        </p>
      </div>

      <div className="space-y-4 mb-8">
        {roles.map((role, i) => (
          <motion.button
            key={role.text}
            onClick={() => onChange(role.text)}
            className={`w-full p-6 rounded-2xl text-lg font-medium text-left flex items-center gap-4 transition-all duration-300 ${value === role.text
                ? 'bg-gradient-to-r from-green-600 to-amber-600 text-white shadow-2xl shadow-teal-500/50'
                : 'bg-slate-800/50 backdrop-blur-sm text-slate-200 border border-teal-500/20 hover:border-green-500/50'
              }`}
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            whileHover={{ scale: 1.02, x: 10 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              className={value === role.text ? 'text-white' : 'text-teal-400'}
              animate={value === role.text ? { rotate: [0, 360] } : {}}
              transition={{ duration: 0.5 }}
            >
              {role.icon}
            </motion.div>
            <span className="flex-1">{role.text}</span>
            {value === role.text && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                <Check className="text-white w-6 h-6" />
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {value && (
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <MagneticButton
              onClick={onNext}
              className="px-10 py-4 bg-gradient-to-r from-green-600 to-amber-600 text-white rounded-full font-bold shadow-2xl shadow-teal-500/50"
            >
              Next →
            </MagneticButton>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Time Section with Interactive Slider
const TimeSection = ({ value, onChange, onNext }) => {
  const timeOptions = [
    { value: '0-15', label: '0-15 mins/day', emoji: '⚡' },
    { value: '15-30', label: '15-30 mins/day', emoji: '🌱' },
    { value: '30-60', label: '30-60 mins/day', emoji: '🌿' },
    { value: '60-120', label: '1-2 hours/day', emoji: '🌳' },
    { value: 'weekends', label: 'Only weekends', emoji: '📅' }
  ];

  const [selectedIndex, setSelectedIndex] = useState(
    value ? timeOptions.findIndex(opt => opt.value === value) : 2
  );
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: false });

  const handleChange = (e) => {
    const index = parseInt(e.target.value);
    setSelectedIndex(index);
    onChange(timeOptions[index].value);
  };

  return (
    <motion.div
      ref={ref}
      className="max-w-3xl w-full"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.6 }}
    >
      <div className="text-center mb-12">
        <motion.h2
          className="text-5xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent"
          initial={{ y: 30 }}
          animate={inView ? { y: 0 } : { y: 30 }}
          transition={{ duration: 0.6 }}
        >
          Your Real Time
        </motion.h2>
        <p className="text-xl text-slate-300">
          When it comes to improving your skills, how much time can you actually give?
        </p>
      </div>

      <motion.div
        className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-orange-500/20"
        initial={{ y: 50 }}
        animate={inView ? { y: 0 } : { y: 50 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="text-center mb-8">
          <motion.div
            className="text-7xl mb-4"
            animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {timeOptions[selectedIndex].emoji}
          </motion.div>
          <motion.div
            className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent"
            key={selectedIndex}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {timeOptions[selectedIndex].label}
          </motion.div>
        </div>

        <div className="relative">
          <input
            type="range"
            min="0"
            max={timeOptions.length - 1}
            value={selectedIndex}
            onChange={handleChange}
            className="w-full h-3 bg-transparent appearance-none cursor-pointer slider-custom"
            style={{
              background: `linear-gradient(to right, 
                rgb(251, 146, 60) 0%, 
                rgb(251, 146, 60) ${(selectedIndex / (timeOptions.length - 1)) * 100}%, 
                rgb(51, 65, 85) ${(selectedIndex / (timeOptions.length - 1)) * 100}%, 
                rgb(51, 65, 85) 100%)`
            }}
          />
          <div className="flex justify-between mt-4 text-sm text-slate-400">
            <span>Quick</span>
            <span>Extended</span>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {value && (
          <motion.div
            className="text-center mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <MagneticButton
              onClick={onNext}
              className="px-10 py-4 bg-gradient-to-r from-orange-600 to-pink-600 text-white rounded-full font-bold shadow-2xl shadow-orange-500/50"
            >
              Next →
            </MagneticButton>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Support Section
const SupportSection = ({ values, onChange, onNext }) => {
  const supports = [
    'Quick Doubt Solving',
    'Step-by-Step Guidance',
    'Career Path Suggestions',
    'Real Experience Sharing',
    'Project / Skill Recommendations',
    'Motivation & Accountability'
  ];

  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: false });

  const toggleSupport = (support) => {
    const newValues = values.includes(support)
      ? values.filter(v => v !== support)
      : [...values, support];
    onChange(newValues);
  };

  return (
    <motion.div
      ref={ref}
      className="max-w-5xl w-full"
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="text-center mb-12">
        <motion.h2
          className="text-5xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-sky-400 to-blue-400 bg-clip-text text-transparent"
          initial={{ scale: 0.8 }}
          animate={inView ? { scale: 1 } : { scale: 0.8 }}
          transition={{ duration: 0.6 }}
        >
          What Would Help the Most?
        </motion.h2>
        <p className="text-xl text-slate-300 mb-2">
          If you had support that truly matched your pace, what kind would feel most helpful?
        </p>
        <p className="text-sm text-sky-400">(Select one or more)</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {supports.map((support, i) => (
          <motion.button
            key={support}
            onClick={() => toggleSupport(support)}
            className={`p-6 rounded-2xl text-lg font-medium transition-all duration-300 relative overflow-hidden ${values.includes(support)
                ? 'bg-gradient-to-br from-cyan-600 to-amber-600 text-white shadow-2xl shadow-sky-500/50'
                : 'bg-slate-800/50 backdrop-blur-sm text-slate-200 border border-sky-500/20 hover:border-cyan-500/50'
              }`}
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-400/20"
              initial={{ x: '-100%' }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3 }}
            />
            <span className="relative z-10">{support}</span>
            {values.includes(support) && (
              <motion.div
                className="inline-block ml-2"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                <Check className="w-5 h-5 inline" />
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {values.length > 0 && (
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <MagneticButton
              onClick={onNext}
              className="px-10 py-4 bg-gradient-to-r from-cyan-600 to-amber-600 text-white rounded-full font-bold shadow-2xl shadow-sky-500/50"
            >
              Next →
            </MagneticButton>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Reflection Section
const ReflectionSection = ({ value, onChange, onSubmit }) => {
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: false });
  const [charCount, setCharCount] = useState(0);

  const handleChange = (e) => {
    onChange(e.target.value);
    setCharCount(e.target.value.length);
  };

  return (
    <motion.div
      ref={ref}
      className="max-w-3xl w-full"
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6 }}
    >
      <div className="text-center mb-12">
        <motion.h2
          className="text-5xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent"
          initial={{ scale: 0.8 }}
          animate={inView ? { scale: 1 } : { scale: 0.8 }}
          transition={{ duration: 0.6 }}
        >
          Your Ideal Growth Experience
        </motion.h2>
        <p className="text-xl text-slate-300">
          If you could design your perfect growth experience for yourself, what would it look like?
        </p>
      </div>

      <motion.div
        className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-orange-600/20"
        initial={{ y: 50 }}
        animate={inView ? { y: 0 } : { y: 50 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <motion.textarea
          value={value}
          onChange={handleChange}
          placeholder="Write freely… no right or wrong answer."
          rows="8"
          className="w-full p-6 rounded-2xl bg-slate-900/50 border-2 border-orange-500/30 focus:border-orange-500 focus:outline-none text-white text-lg resize-none transition-all placeholder-slate-500"
          whileFocus={{ scale: 1.01, borderColor: '#a855f7' }}
        />
        <div className="flex justify-between items-center mt-3">
          {value && (
            <motion.p
              className="text-sm text-orange-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              We're listening... ✨
            </motion.p>
          )}
          <motion.p
            className="text-sm text-slate-500 ml-auto"
            animate={{ opacity: charCount > 0 ? 1 : 0.5 }}
          >
            {charCount} characters
          </motion.p>
        </div>
      </motion.div>

      <div className="text-center mt-8">
        <MagneticButton
          onClick={onSubmit}
          disabled={!value}
          className={`px-12 py-5 rounded-full font-bold text-xl shadow-2xl transform transition-all duration-300 ${value
              ? 'bg-gradient-to-r from-orange-600 via-pink-600 to-orange-600 text-white hover:shadow-purple-500/70'
              : 'bg-slate-700 text-slate-500 cursor-not-allowed'
            }`}
        >
          <span className="flex items-center gap-2">
            Finish ✨
            <Sparkles className="w-5 h-5" />
          </span>
        </MagneticButton>
      </div>
    </motion.div>
  );
};

// Thank You Section with Celebration
const ThankYouSection = () => {
  const [ref, inView] = useInView({ threshold: 0.3, triggerOnce: true });

  useEffect(() => {
    if (inView) {
      // Trigger confetti when section comes in view
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }, 300);
    }
  }, [inView]);

  return (
    <motion.div
      ref={ref}
      className="text-center max-w-2xl"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.8, type: 'spring' }}
    >
      <motion.div
        className="mb-8"
        initial={{ scale: 0, rotate: -180 }}
        animate={inView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
        transition={{ duration: 0.8, delay: 0.2, type: 'spring', stiffness: 200 }}
      >
        <div className="inline-block p-8 bg-gradient-to-br from-orange-600 via-pink-600 to-orange-600 rounded-full shadow-2xl shadow-orange-600/50 relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full"
          />
          <Check className="w-20 h-20 text-white relative z-10" />
        </div>
      </motion.div>

      <motion.h2
        className="text-6xl font-bold text-white mb-6"
        initial={{ y: 30, opacity: 0 }}
        animate={inView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        Thank You
      </motion.h2>

      <motion.p
        className="text-2xl text-slate-300 mb-4 leading-relaxed"
        initial={{ y: 30, opacity: 0 }}
        animate={inView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        Thanks for exploring.<br />
        Your thoughts help shape something meaningful, simple, and useful.
      </motion.p>

      <motion.p
        className="text-slate-400"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        You can close this page anytime or refresh to explore again.
      </motion.p>

      <motion.div
        className="mt-12 flex justify-center gap-6 flex-wrap"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        {['💭', '🌱', '✨', '🎯', '💡', '🚀'].map((emoji, i) => (
          <motion.div
            key={i}
            className="text-5xl"
            animate={{
              y: [0, -15, 0],
              rotate: [0, 10, -10, 0],
              opacity: [0.3, 1, 0.3]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.2
            }}
          >
            {emoji}
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default MindExplorationApp;





