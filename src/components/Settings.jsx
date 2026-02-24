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
    { label: 'Porciones', key: 'cycles', value: config.cycles },
    { label: 'Calentar sartén (s)', key: 'preheatPanTime', value: config.preheatPanTime ?? 40 },
    { label: 'Calentar aceite (s)', key: 'heatOilTime', value: config.heatOilTime ?? 40 },
    { label: 'Entre porciones (s)', key: 'transitionTime', value: config.transitionTime },
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
    <div className="fixed inset-0 z-[100] bg-zinc-900 p-6 flex flex-col">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-xl font-bold">Ajustes</h2>
        <button
          onClick={onClose}
          className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center border border-white/5"
        >
          <SVGIcon name="X" size={24} className="text-white" />
        </button>
      </div>

      <div className="space-y-6 overflow-y-auto flex-1 pb-10">
        {/* Selector de recetas */}
        <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
          <label className="text-xs font-medium text-zinc-500 mb-2 block">
            Receta
          </label>
          <div className="flex flex-wrap gap-2">
            {Object.values(recipes).map((recipe) => (
              <button
                key={recipe.id}
                onClick={() => handleSelectRecipe(recipe.id)}
                className={`px-5 py-3 rounded-2xl font-bold text-sm uppercase transition-all ${
                  config.recipeId === recipe.id
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white/5 text-zinc-400 hover:text-white'
                }`}
              >
                {recipe.name}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
          <label className="text-xs font-medium text-zinc-500 mb-2 block">
            Nombre del plato
          </label>
          <input
            type="text"
            value={config.ingredient}
            onChange={(e) => setConfig({ ...config, ingredient: e.target.value })}
            className="bg-transparent text-xl font-semibold w-full outline-none text-emerald-400"
            placeholder="Ej: Huevo, Pancake..."
          />
        </div>

        <div className="space-y-3">
          {settingsItems.map((item, idx) => (
            <div
              key={idx}
              className="bg-white/5 px-4 py-4 rounded-2xl border border-white/5 flex items-center justify-between"
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
        className="w-full mt-4 py-4 bg-emerald-600 rounded-2xl font-semibold"
      >
        ¡Listo!
      </button>
    </div>
  );
};
