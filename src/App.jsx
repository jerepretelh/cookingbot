import { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { getRecipeConfig, RECIPES } from './data/recipes';
import { Header } from './components/Header';
import { Overlay } from './components/Overlay';
import { Settings } from './components/Settings';
import { RecipePicker } from './components/RecipePicker';
import { SVGIcon } from './components/SVGIcon';

const defaultConfig = getRecipeConfig(RECIPES.huevo);

function App() {
  const [config, setConfig] = useState(defaultConfig);
  const [showRecipePicker, setShowRecipePicker] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentCycle, setCurrentCycle] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [timeLeft, setTimeLeft] = useState(config.prepTime);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayMessage, setOverlayMessage] = useState('');
  const [isManualWait, setIsManualWait] = useState(false);

  const requestRef = useRef();
  const previousTimeRef = useRef();
  const proceedCallbackRef = useRef(null);

  const launchConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#3b82f6', '#52c18d', '#f97316', '#ffffff'],
    });
  };

  const speakLocal = useCallback(
    (text) => {
      if (isMuted || !window.speechSynthesis) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = 1.1;
      window.speechSynthesis.speak(utterance);
    },
    [isMuted]
  );

  const animate = useCallback(
    (time) => {
      if (previousTimeRef.current !== undefined) {
        const deltaTime = (time - previousTimeRef.current) / 1000;
        if (isRunning && !showOverlay) {
          setTimeLeft((prev) => {
            const next = prev - deltaTime;
            return next <= 0 ? 0 : next;
          });
        }
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    },
    [isRunning, showOverlay]
  );

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [animate]);

  useEffect(() => {
    if (timeLeft <= 0 && isRunning && !showOverlay) {
      handleStepEnd();
    }
  }, [timeLeft, isRunning, showOverlay]);

  const handleStepEnd = () => {
    if (currentCycle === 0) {
      triggerOverlay('¡Ya está! ¡Echa tu ingrediente y a cocinar!', true, () => {
        setCurrentCycle(1);
        setCurrentStepIndex(0);
        setTimeLeft(config.steps[0].duration);
      });
    } else if (currentStepIndex === -2) {
      triggerOverlay('¡Genial! Ahora la siguiente porción, ¡tú puedes!', true, () => {
        setCurrentStepIndex(0);
        setTimeLeft(config.steps[0].duration);
      });
    } else if (currentStepIndex < config.steps.length - 1) {
      const nextIdx = currentStepIndex + 1;
      triggerOverlay('¡Dale la vuelta! ¡Va perfecto!', false, () => {
        setCurrentStepIndex(nextIdx);
        setTimeLeft(config.steps[nextIdx].duration);
      });
    } else if (currentCycle < config.cycles) {
      launchConfetti();
      triggerOverlay('¡Listo! Sácala y ¡a descansar un poco!', true, () => {
        setCurrentCycle((c) => c + 1);
        setCurrentStepIndex(-2);
        setTimeLeft(config.transitionTime);
      });
    } else {
      setIsRunning(false);
      launchConfetti();
      triggerOverlay('¡Felicidades! ¡Todo tu menú está listo!', true, () => goToRecipePicker());
    }
  };

  const triggerOverlay = (msg, manual, callback) => {
    setOverlayMessage(msg);
    setIsManualWait(manual);
    setShowOverlay(true);
    speakLocal(msg);
    proceedCallbackRef.current = callback;
    if (!manual) setTimeout(proceed, 3500);
  };

  const proceed = () => {
    setShowOverlay(false);
    if (proceedCallbackRef.current) {
      proceedCallbackRef.current();
      proceedCallbackRef.current = null;
    }
  };

  const goToRecipePicker = () => {
    setShowRecipePicker(true);
    setIsRunning(false);
    setCurrentCycle(0);
    setCurrentStepIndex(-1);
    setTimeLeft(config.prepTime);
    setShowOverlay(false);
  };

  const handleSelectRecipe = (newConfig) => {
    setConfig(newConfig);
    setTimeLeft(newConfig.prepTime);
    setCurrentCycle(0);
    setCurrentStepIndex(-1);
  };

  const handleStart = () => {
    setShowRecipePicker(false);
    speakLocal(`¡Arrancamos con ${config.ingredient}! ¡Vamos a cocinar!`);
    setIsRunning(true);
  };

  const theme = (() => {
    if (currentStepIndex === -1) return { label: 'Calentando...', color: '#3b82f6' };
    if (currentStepIndex === -2) return { label: 'Siguiente porción', color: '#a855f7' };
    return { label: config.steps[currentStepIndex].name, color: config.steps[currentStepIndex].hex };
  })();

  const maxTime =
    currentStepIndex === -1
      ? config.prepTime
      : currentStepIndex === -2
        ? config.transitionTime
        : config.steps[currentStepIndex].duration;
  const radius = 42;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (timeLeft / maxTime) * circ;

  if (showRecipePicker) {
    return (
      <div className="h-screen bg-black text-white flex flex-col font-sans select-none overflow-hidden">
        <Header
          isMuted={isMuted}
          onToggleMute={() => setIsMuted(!isMuted)}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />
        <RecipePicker
          onSelectRecipe={handleSelectRecipe}
          onStart={handleStart}
        />
        {isSettingsOpen && (
          <Settings
            config={config}
            setConfig={(c) => {
              setConfig(c);
              setTimeLeft(c.prepTime);
            }}
            onClose={() => setIsSettingsOpen(false)}
            onApply={() => setIsSettingsOpen(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="h-screen bg-black text-white flex flex-col font-sans select-none relative overflow-hidden">
      <Header
        isMuted={isMuted}
        onToggleMute={() => setIsMuted(!isMuted)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <div className="flex justify-center gap-2 mb-4">
        {[...Array(config.cycles)].map((_, i) => (
          <div
            key={i}
            className={`h-1 rounded-full transition-all duration-700 ${
              i < currentCycle - 1
                ? 'w-4 bg-blue-500'
                : i === (currentCycle > 0 ? currentCycle - 1 : 0) && currentCycle > 0
                  ? 'w-10 bg-white shadow-[0_0_10px_white]'
                  : 'w-4 bg-zinc-800'
            }`}
          />
        ))}
      </div>

      <main className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="relative w-full aspect-square max-w-[340px] flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle cx="50" cy="50" r={radius} stroke="rgba(255,255,255,0.06)" strokeWidth="4.5" fill="none" />
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke={theme.color}
              strokeWidth="5"
              fill="none"
              strokeDasharray={circ}
              strokeDashoffset={isNaN(offset) ? circ : offset}
              strokeLinecap="round"
              className="progress-ring"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[120px] font-black italic tracking-tighter tabular-nums leading-none">
              {Math.ceil(timeLeft)}
            </span>
            <div className="mt-2 flex flex-col items-center gap-1">
              <div className="flex items-center gap-2">
                <div
                  className="w-1.5 h-1.5 rounded-full animate-pulse-soft"
                  style={{ backgroundColor: theme.color }}
                />
                <span className="text-[11px] font-black uppercase tracking-[0.25em]" style={{ color: theme.color }}>
                  {theme.label}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 w-full max-w-xs flex flex-col items-center space-y-6">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="w-[200px] h-[68px] bg-white text-black rounded-full flex items-center justify-center gap-3 shadow-[0_20px_40px_rgba(255,255,255,0.15)] active:scale-95 transition-all"
          >
            <SVGIcon name={isRunning ? 'Pause' : 'Play'} size={24} fill="currentColor" />
            <span className="text-base font-black uppercase tracking-widest leading-none">
              {isRunning ? 'Pausar' : 'Seguir'}
            </span>
          </button>
          <button
            onClick={goToRecipePicker}
            className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-600 hover:text-white transition-colors"
          >
            Elegir otra receta
          </button>
        </div>
      </main>

      {showOverlay && (
        <Overlay message={overlayMessage} isManualWait={isManualWait} onProceed={proceed} />
      )}

      {isSettingsOpen && (
        <Settings
          config={config}
          setConfig={(c) => {
            setConfig(c);
            if (currentStepIndex === -1) setTimeLeft(c.prepTime);
          }}
          onClose={() => setIsSettingsOpen(false)}
          onApply={() => {
            setIsSettingsOpen(false);
            setTimeLeft(config.prepTime);
            setCurrentCycle(0);
            setCurrentStepIndex(-1);
          }}
        />
      )}
    </div>
  );
}

export default App;
