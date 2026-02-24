import { SVGIcon } from './SVGIcon';

export const Overlay = ({ message, isManualWait, onProceed }) => (
  <div
    className={`fixed inset-0 z-50 flex flex-col items-center justify-center p-8 text-center backdrop-blur-2xl ${
      isManualWait ? 'bg-blue-600/95' : 'bg-orange-600/95'
    }`}
  >
    <div className="w-24 h-24 mb-10 bg-white/20 rounded-[40px] flex items-center justify-center animate-bounce shadow-2xl">
      <SVGIcon name={isManualWait ? "Hand" : "Timer"} size={48} className="text-white" />
    </div>
    <h2 className="text-5xl font-black italic mb-12 leading-tight uppercase tracking-tighter">{message}</h2>
    {isManualWait && (
      <button
        onClick={onProceed}
        className="bg-white text-black w-full max-w-[220px] py-6 rounded-full text-xl font-black uppercase active:scale-90 transition-transform shadow-2xl"
      >
        LISTO
      </button>
    )}
  </div>
);
