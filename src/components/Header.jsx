import { SVGIcon } from './SVGIcon';

export const Header = ({ isMuted, onToggleMute, onOpenSettings }) => (
  <header className="px-6 pt-8 pb-4 flex justify-between items-start z-10">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)]">
        <SVGIcon name="ChefHat" size={20} className="text-white" fill="currentColor" />
      </div>
      <div>
        <h1 className="text-xs font-black uppercase tracking-tight italic leading-none">
          Chef Bot <span className="text-blue-500">PRO</span>
        </h1>
        <p className="text-[7px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Sincronizado</p>
      </div>
    </div>

    <div className="flex gap-2">
      <button
        onClick={onToggleMute}
        className="w-11 h-11 bg-zinc-900/80 backdrop-blur rounded-2xl flex items-center justify-center border border-white/5 active:scale-95 transition-transform"
      >
        <SVGIcon
          name={isMuted ? "VolumeX" : "Volume2"}
          size={18}
          className={isMuted ? "text-red-500" : "text-zinc-400"}
        />
      </button>
      <button
        onClick={onOpenSettings}
        className="w-11 h-11 bg-zinc-900/80 backdrop-blur rounded-2xl flex items-center justify-center border border-white/5 active:scale-95 transition-transform"
      >
        <SVGIcon name="Sliders" size={18} className="text-zinc-400" />
      </button>
    </div>
  </header>
);
