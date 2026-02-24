import { useState, useEffect } from 'react';
import { getRecipeConfig } from '../data/recipes';

export const PortionPicker = ({ recipe, config: initialConfig, onConfirm, onCancel }) => {
  const config = initialConfig ?? getRecipeConfig(recipe);
  const [cycles, setCycles] = useState(config?.cycles ?? 1);
  const ing = config?.ingredient ?? recipe?.ingredient ?? 'porciones';

  useEffect(() => {
    setCycles(config?.cycles ?? 1);
  }, [config?.recipeId, config?.cycles]);

  const handleConfirm = () => {
    onConfirm?.({ ...config, cycles });
  };

  return (
    <div
      className="fixed inset-0 z-[105] bg-zinc-900/95 flex flex-col items-center justify-center p-6"
      onClick={(e) => e.target === e.currentTarget && onCancel?.()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Escape' && onCancel?.()}
    >
      <div className="flex flex-col items-center w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold text-white text-center mb-2">
          ¿Cuántos {ing} vamos a cocinar?
        </h2>
        <p className="text-zinc-500 text-sm mb-8">Ajusta la cantidad y pulsa Empezar</p>

        <div className="flex items-center gap-8 mb-12">
          <button
            onClick={() => setCycles((c) => Math.max(1, c - 1))}
            className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center text-3xl font-bold text-white active:scale-95"
          >
            −
          </button>
          <span className="text-6xl font-bold text-white w-24 text-center tabular-nums">
            {cycles}
          </span>
          <button
            onClick={() => setCycles((c) => c + 1)}
            className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center text-3xl font-bold text-white active:scale-95"
          >
            +
          </button>
        </div>

        <button
          onClick={handleConfirm}
          className="w-full py-6 rounded-3xl bg-emerald-600 text-white text-xl font-bold active:scale-[0.98]"
        >
          Empezar
        </button>
      </div>
    </div>
  );
};
