import { useState } from 'react';
import { createRecipeId, saveCustomRecipe } from '../data/recipes';
import { SVGIcon } from './SVGIcon';

const defaultRecipe = {
  name: '',
  ingredient: '',
  prepTime: 8,
  cycles: 3,
  transitionTime: 5,
  steps: [
    { id: 1, name: 'Lado A', duration: 45, hex: '#52c18d' },
    { id: 2, name: 'Lado B', duration: 40, hex: '#f97316' },
  ],
};

export const NewRecipeForm = ({ onClose, onSave }) => {
  const [recipe, setRecipe] = useState(defaultRecipe);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!recipe.name.trim()) {
      setError('Ponle un nombre a tu receta');
      return;
    }
    if (!recipe.ingredient.trim()) {
      setError('¿Qué ingrediente o plato es?');
      return;
    }
    const newRecipe = {
      ...recipe,
      id: createRecipeId(),
      isPreset: false,
      name: recipe.name.trim(),
      ingredient: recipe.ingredient.trim(),
    };
    saveCustomRecipe(newRecipe);
    onSave(newRecipe);
  };

  return (
    <div className="fixed inset-0 z-[110] bg-black/95 p-6 flex flex-col overflow-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-black italic uppercase">Nueva receta</h2>
        <button
          onClick={onClose}
          className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center border border-white/5"
        >
          <SVGIcon name="X" size={24} className="text-white" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 flex-1 pb-10">
        <div>
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2 block">
            Nombre de la receta
          </label>
          <input
            type="text"
            value={recipe.name}
            onChange={(e) => setRecipe({ ...recipe, name: e.target.value })}
            placeholder="Ej: Tostadas con queso"
            className="w-full bg-zinc-900/60 border border-white/10 rounded-2xl px-5 py-4 text-lg outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2 block">
            ¿Qué vamos a cocinar?
          </label>
          <input
            type="text"
            value={recipe.ingredient}
            onChange={(e) => setRecipe({ ...recipe, ingredient: e.target.value })}
            placeholder="Ej: Tostada, Huevo..."
            className="w-full bg-zinc-900/60 border border-white/10 rounded-2xl px-5 py-4 text-lg outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2 block">
            Porciones a cocinar
          </label>
          <div className="flex items-center gap-4 bg-zinc-900/60 rounded-2xl px-5 py-4 border border-white/10">
            <button
              type="button"
              onClick={() => setRecipe({ ...recipe, cycles: Math.max(1, recipe.cycles - 1) })}
              className="w-10 h-10 bg-white text-black rounded-full font-bold text-xl"
            >
              —
            </button>
            <span className="flex-1 text-center font-bold text-xl">{recipe.cycles}</span>
            <button
              type="button"
              onClick={() => setRecipe({ ...recipe, cycles: recipe.cycles + 1 })}
              className="w-10 h-10 bg-white text-black rounded-full font-bold text-xl"
            >
              +
            </button>
          </div>
        </div>

        <div>
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2 block">
            Tiempo de calentado (segundos)
          </label>
          <div className="flex items-center gap-4 bg-zinc-900/60 rounded-2xl px-5 py-4 border border-white/10">
            <button
              type="button"
              onClick={() => setRecipe({ ...recipe, prepTime: Math.max(1, recipe.prepTime - 1) })}
              className="w-10 h-10 bg-white text-black rounded-full font-bold text-xl"
            >
              —
            </button>
            <span className="flex-1 text-center font-bold text-xl">{recipe.prepTime}s</span>
            <button
              type="button"
              onClick={() => setRecipe({ ...recipe, prepTime: recipe.prepTime + 1 })}
              className="w-10 h-10 bg-white text-black rounded-full font-bold text-xl"
            >
              +
            </button>
          </div>
        </div>

        <div>
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2 block">
            Tiempo entre porciones (segundos)
          </label>
          <div className="flex items-center gap-4 bg-zinc-900/60 rounded-2xl px-5 py-4 border border-white/10">
            <button
              type="button"
              onClick={() => setRecipe({ ...recipe, transitionTime: Math.max(1, recipe.transitionTime - 1) })}
              className="w-10 h-10 bg-white text-black rounded-full font-bold text-xl"
            >
              —
            </button>
            <span className="flex-1 text-center font-bold text-xl">{recipe.transitionTime}s</span>
            <button
              type="button"
              onClick={() => setRecipe({ ...recipe, transitionTime: recipe.transitionTime + 1 })}
              className="w-10 h-10 bg-white text-black rounded-full font-bold text-xl"
            >
              +
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">
            Tiempos de cocción (cada lado)
          </label>
          {recipe.steps.map((step, i) => (
            <div key={step.id} className="flex items-center justify-between bg-zinc-900/60 rounded-2xl px-5 py-4 border border-white/10">
              <span className="font-bold">{step.name}</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const s = [...recipe.steps];
                    s[i].duration = Math.max(1, s[i].duration - 5);
                    setRecipe({ ...recipe, steps: s });
                  }}
                  className="w-9 h-9 bg-zinc-700 rounded-full font-bold"
                >
                  −
                </button>
                <span className="w-10 text-center font-bold">{step.duration}s</span>
                <button
                  type="button"
                  onClick={() => {
                    const s = [...recipe.steps];
                    s[i].duration += 5;
                    setRecipe({ ...recipe, steps: s });
                  }}
                  className="w-9 h-9 bg-zinc-700 rounded-full font-bold"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full py-6 bg-blue-600 rounded-3xl font-black uppercase tracking-widest text-lg shadow-xl shadow-blue-500/30 mt-4"
        >
          ¡Guardar receta!
        </button>
      </form>
    </div>
  );
};
