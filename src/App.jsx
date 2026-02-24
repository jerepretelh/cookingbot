import { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { getRecipeConfig, RECIPES } from './data/recipes';
import { Header } from './components/Header';
import { Overlay } from './components/Overlay';
import { RecipePicker } from './components/RecipePicker';
import { SVGIcon } from './components/SVGIcon';

const defaultConfig = getRecipeConfig(RECIPES.huevo);

// Índices: -3 precalentar sartén (omitible), -2 echar aceite (manual), -1 calentar aceite, 0+ cocción
const STEP_PREHEAT_PAN = -3;
const STEP_HEAT_OIL = -1;

function App() {
  const [config, setConfig] = useState(defaultConfig);
  const [showRecipePicker, setShowRecipePicker] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentCycle, setCurrentCycle] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(STEP_PREHEAT_PAN);
  const [timeLeft, setTimeLeft] = useState(config.preheatPanTime ?? 40);
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayMessage, setOverlayMessage] = useState('');
  const [overlayShowSkip, setOverlayShowSkip] = useState(false);
  const [isManualWait, setIsManualWait] = useState(false);

  const requestRef = useRef();
  const previousTimeRef = useRef();
  const proceedCallbackRef = useRef(null);

  const launchConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#52c18d', '#f97316', '#ffffff'],
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
    const heatOilTime = config.heatOilTime ?? 40;
    if (currentStepIndex === STEP_PREHEAT_PAN) {
      triggerOverlay('Echa el aceite en la sartén', true, () => {
        setCurrentStepIndex(STEP_HEAT_OIL);
        setTimeLeft(heatOilTime);
      });
    } else if (currentStepIndex === STEP_HEAT_OIL) {
      triggerOverlay(`¡Ya está! ¡Echa tu ${config.ingredient} y a cocinar!`, true, () => {
        setCurrentCycle(1);
        setCurrentStepIndex(0);
        setTimeLeft(config.steps[0].duration);
      });
    } else if (currentStepIndex === -2) {
      triggerOverlay(`¡Genial! ¡La siguiente ${config.ingredient}!`, true, () => {
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
      triggerOverlay(`¡Listo! Saca tu ${config.ingredient} y ¡a descansar!`, true, () => {
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

  const triggerOverlay = (msg, manual, callback, showSkip = false) => {
    setOverlayMessage(msg);
    setOverlayShowSkip(showSkip);
    setIsManualWait(manual);
    setShowOverlay(true);
    speakLocal(msg);
    proceedCallbackRef.current = callback;
    if (!manual) setTimeout(proceed, 3500);
  };

  const proceed = () => {
    setShowOverlay(false);
    setOverlayShowSkip(false);
    if (proceedCallbackRef.current) {
      proceedCallbackRef.current();
      proceedCallbackRef.current = null;
    }
  };

  const handleSkipPreheat = () => {
    setShowOverlay(true);
    setOverlayMessage('Echa el aceite en la sartén');
    setIsManualWait(true);
    speakLocal('Echa el aceite en la sartén');
    proceedCallbackRef.current = () => {
      setCurrentStepIndex(STEP_HEAT_OIL);
      setTimeLeft(config.heatOilTime ?? 40);
      setShowOverlay(false);
    };
  };

  const goToRecipePicker = () => {
    setShowRecipePicker(true);
    setIsRunning(false);
    setCurrentCycle(0);
    setCurrentStepIndex(STEP_PREHEAT_PAN);
    setTimeLeft(config.preheatPanTime ?? 40);
    setShowOverlay(false);
  };

  const handleSelectRecipe = (newConfig) => {
    setConfig(newConfig);
    setTimeLeft(newConfig.preheatPanTime ?? 40);
    setCurrentCycle(0);
    setCurrentStepIndex(STEP_PREHEAT_PAN);
  };

  const handleStart = () => {
    setShowRecipePicker(false);
    speakLocal(`Precalienta la sartén y vamos a cocinar ${config.ingredient}. ¡Empezamos!`);
    setIsRunning(true);
  };

  const theme = (() => {
    if (currentStepIndex === STEP_PREHEAT_PAN) return { label: '¡Vamos a cocinar!', color: '#64748b' };
    if (currentStepIndex === STEP_HEAT_OIL) return { label: 'Calentando aceite', color: '#3b82f6' };
    if (currentStepIndex === -2) return { label: `Siguiente ${config.ingredient}`, color: '#a855f7' };
    return { label: config.steps[currentStepIndex].name, color: config.steps[currentStepIndex].hex };
  })();

  const getMaxTime = () => {
    if (currentStepIndex === STEP_PREHEAT_PAN) return config.preheatPanTime ?? 40;
    if (currentStepIndex === STEP_HEAT_OIL) return config.heatOilTime ?? 40;
    if (currentStepIndex === -2) return config.transitionTime;
    return config.steps[currentStepIndex]?.duration ?? 60;
  };

  const maxTime = getMaxTime();
  const radius = 42;
  const circ = 2 * Math.PI * radius;
  const offset = maxTime > 0 ? circ - (timeLeft / maxTime) * circ : circ;

  if (showRecipePicker) {
    return (
      <div className="h-screen bg-zinc-900 text-white flex flex-col select-none overflow-hidden">
        <Header isMuted={isMuted} onToggleMute={() => setIsMuted(!isMuted)} showSettings={false} />
        <RecipePicker onSelectRecipe={handleSelectRecipe} onStart={handleStart} />
      </div>
    );
  }

  return (
    <div className="h-screen bg-zinc-900 text-white flex flex-col font-sans select-none relative overflow-hidden">
      <Header
        isMuted={isMuted}
        onToggleMute={() => setIsMuted(!isMuted)}
        showSettings={false}
        onOtherRecipe={goToRecipePicker}
      />

      <div className="flex justify-center gap-1.5 mb-2">
        {[...Array(config.cycles)].map((_, i) => (
          <div
            key={i}
            className={`h-1 rounded-full transition-all duration-500 ${
              i < currentCycle - 1
                ? 'w-4 bg-emerald-500'
                : i === (currentCycle > 0 ? currentCycle - 1 : 0) && currentCycle > 0
                  ? 'w-8 bg-white'
                  : 'w-4 bg-white/20'
            }`}
          />
        ))}
      </div>

      <main className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="relative w-full aspect-square max-w-[300px] flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle cx="50" cy="50" r={radius} stroke="rgba(255,255,255,0.08)" strokeWidth="4" fill="none" />
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
            <span className="text-[100px] font-bold tabular-nums leading-none">
              {Math.ceil(timeLeft)}
            </span>
            <div className="mt-2 flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: theme.color }}
              />
              <span className="text-sm font-medium" style={{ color: theme.color }}>
                {theme.label}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center gap-5">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="w-64 h-20 bg-white text-zinc-900 rounded-full flex items-center justify-center gap-3 text-xl font-bold active:scale-[0.98] transition-transform min-h-[56px]"
          >
            <SVGIcon name={isRunning ? 'Pause' : 'Play'} size={28} fill="currentColor" />
            {isRunning ? 'Pausar' : 'Seguir'}
          </button>
          {currentStepIndex === STEP_PREHEAT_PAN && isRunning && (
            <button
              onClick={handleSkipPreheat}
              className="py-4 px-8 text-base text-zinc-500 hover:text-white min-h-[48px]"
            >
              Omitir precalentado
            </button>
          )}
        </div>
      </main>

      {showOverlay && (
        <Overlay
          message={overlayMessage}
          isManualWait={isManualWait}
          onProceed={proceed}
          showSkip={false}
        />
      )}

    </div>
  );
}

export default App;
