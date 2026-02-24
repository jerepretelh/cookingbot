import { SVGIcon } from './SVGIcon';

export const Header = ({ isMuted, onToggleMute, showSettings, onOpenSettings, onOtherRecipe }) => (
  <header className="px-4 py-4 flex justify-between items-center z-10">
    <div className="flex items-center gap-2">
      <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center">
        <SVGIcon name="ChefHat" size={20} className="text-white" fill="currentColor" />
      </div>
      <span className="font-semibold text-white">Chef Bot</span>
    </div>

    <div className="flex gap-1">
      {onOtherRecipe && (
        <button
          onClick={onOtherRecipe}
          className="px-5 py-3 rounded-2xl bg-white/5 text-base font-medium text-zinc-400 hover:text-white min-h-[48px]"
        >
          Otra receta
        </button>
      )}
      <button
        onClick={onToggleMute}
        className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center min-w-[56px] min-h-[56px]"
        aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}
      >
        <SVGIcon
          name={isMuted ? 'VolumeX' : 'Volume2'}
          size={20}
          className={isMuted ? 'text-amber-400' : 'text-zinc-400'}
        />
      </button>
      {showSettings && (
        <button
          onClick={onOpenSettings}
          className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center min-w-[56px] min-h-[56px]"
          aria-label="Ajustes"
        >
          <SVGIcon name="Sliders" size={20} className="text-zinc-400" />
        </button>
      )}
    </div>
  </header>
);
