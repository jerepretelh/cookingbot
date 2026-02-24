import { getAllRecipes, getRecipeConfig } from '../data/recipes';
import { SVGIcon } from './SVGIcon';

export const Settings = ({ config, setConfig, onClose, onApply }) => {
  const recipes = getAllRecipes();
  const handleSelectRecipe = (recipeId) => {
    const recipe = recipes[recipeId];
    if (recipe) {
      setConfig(getRecipeConfig(recipe));
    }
  };

  const settingsItems = [
    { label: 'Porciones a cocinar', key: 'cycles', value: config.cycles },
    { label: 'Tiempo de calentado (s)', key: 'prepTime', value: config.prepTime },
    ...config.steps.map((s, i) => ({
      label: s.name,
      key: `step-${i}`,
      value: s.duration,
      isStep: true,
      index: i,
    })),
  ];

  const handleDecrement = (item) => {
    if (item.isStep) {
      const s = [...config.steps];
      s[item.index].duration = Math.max(1, s[item.index].duration - 1);
      setConfig({ ...config, steps: s });
    } else {
      setConfig({ ...config, [item.key]: Math.max(1, item.value - 1) });
    }
  };

  const handleIncrement = (item) => {
    if (item.isStep) {
      const s = [...config.steps];
      s[item.index].duration++;
      setConfig({ ...config, steps: s });
    } else {
      setConfig({ ...config, [item.key]: item.value + 1 });
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black p-8 flex flex-col">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-3xl font-black italic uppercase">Ajustes</h2>
        <button
          onClick={onClose}
          className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center border border-white/5"
        >
          <SVGIcon name="X" size={24} className="text-white" />
        </button>
      </div>

      <div className="space-y-6 overflow-y-auto flex-1 pb-10">
        {/* Selector de recetas */}
        <div className="bg-zinc-900/40 p-6 rounded-[32px] border border-white/5">
          <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-3 block">
            Receta
          </label>
          <div className="flex flex-wrap gap-2">
            {Object.values(recipes).map((recipe) => (
              <button
                key={recipe.id}
                onClick={() => handleSelectRecipe(recipe.id)}
                className={`px-5 py-3 rounded-2xl font-bold text-sm uppercase transition-all ${
                  config.recipeId === recipe.id
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                    : 'bg-zinc-800/60 text-zinc-400 hover:bg-zinc-700/60 hover:text-white'
                }`}
              >
                {recipe.name}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-zinc-900/40 p-6 rounded-[32px] border border-white/5">
          <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-3 block">
            Nombre del plato
          </label>
          <input
            type="text"
            value={config.ingredient}
            onChange={(e) => setConfig({ ...config, ingredient: e.target.value })}
            className="bg-transparent text-2xl font-black w-full outline-none uppercase text-blue-500"
            placeholder="Ej: Huevo, Pancake..."
          />
        </div>

        <div className="space-y-3">
          {settingsItems.map((item, idx) => (
            <div
              key={idx}
              className="bg-zinc-900/40 px-6 py-5 rounded-[32px] border border-white/5 flex items-center justify-between"
            >
              <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400">{item.label}</span>
              <div className="flex items-center gap-4 bg-zinc-800/30 p-2 rounded-full border border-white/5">
                <button
                  onClick={() => handleDecrement(item)}
                  className="w-8 h-8 bg-white text-black rounded-full flex items-center justify-center font-bold text-xl active:scale-90"
                >
                  —
                </button>
                <span className="w-6 text-center font-black text-lg">{item.value}</span>
                <button
                  onClick={() => handleIncrement(item)}
                  className="w-8 h-8 bg-white text-black rounded-full flex items-center justify-center font-bold text-xl active:scale-90"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onApply}
        className="w-full mt-4 py-6 bg-blue-600 rounded-[32px] font-black uppercase tracking-widest text-sm shadow-xl shadow-blue-500/20"
      >
        ¡Listo!
      </button>
    </div>
  );
};
