import { SVGIcon } from './SVGIcon';

export const Overlay = ({ message, isManualWait, onProceed, showSkip, onSkip }) => (
  <div
    className={`fixed inset-0 z-50 flex flex-col items-center justify-center p-8 text-center backdrop-blur-2xl ${
      isManualWait ? 'bg-blue-600/95' : 'bg-orange-600/95'
    }`}
  >
    <div className="w-24 h-24 mb-10 bg-white/20 rounded-full flex items-center justify-center animate-bounce shadow-2xl">
      <SVGIcon name={isManualWait ? 'Hand' : 'Timer'} size={48} className="text-white" />
    </div>
    <h2 className="text-4xl font-black mb-10 leading-tight">{message}</h2>
    {isManualWait && (
      <button
        onClick={onProceed}
        className="bg-white text-black w-full max-w-[280px] py-6 rounded-full text-2xl font-bold active:scale-[0.98] transition-transform shadow-2xl min-h-[64px]"
      >
        Listo
      </button>
    )}
    {showSkip && (
      <button
        onClick={onSkip}
        className="mt-4 text-white/80 text-sm font-medium hover:text-white"
      >
        Omitir
      </button>
    )}
  </div>
);
