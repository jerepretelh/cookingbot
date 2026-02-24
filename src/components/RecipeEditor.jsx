import { useState, useEffect } from 'react';
import { saveCustomRecipe, createRecipeId } from '../data/recipes';
import { SVGIcon } from './SVGIcon';

export const RecipeEditor = ({ recipe, onClose, onSave }) => {
  const [form, setForm] = useState({
    name: recipe.name,
    ingredient: recipe.ingredient,
    preheatPanTime: recipe.preheatPanTime ?? recipe.prepTime ?? 40,
    heatOilTime: recipe.heatOilTime ?? recipe.prepTime ?? 40,
    cycles: recipe.cycles,
    transitionTime: recipe.transitionTime,
    steps: recipe.steps?.map((s) => ({ ...s })) ?? [
      { id: 1, name: 'Lado A', duration: 45, hex: '#52c18d' },
      { id: 2, name: 'Lado B', duration: 40, hex: '#f97316' },
    ],
  });

  useEffect(() => {
    setForm({
      name: recipe.name,
      ingredient: recipe.ingredient,
      preheatPanTime: recipe.preheatPanTime ?? 40,
      heatOilTime: recipe.heatOilTime ?? 40,
      cycles: recipe.cycles,
      transitionTime: recipe.transitionTime,
      steps: recipe.steps?.map((s) => ({ ...s })) ?? [
        { id: 1, name: 'Lado A', duration: 45, hex: '#52c18d' },
        { id: 2, name: 'Lado B', duration: 40, hex: '#f97316' },
      ],
    });
  }, [recipe.id]);

  const handleSave = () => {
    const updated = {
      ...recipe,
      ...form,
      id: recipe.isPreset ? createRecipeId() : recipe.id,
      isPreset: false,
    };
    saveCustomRecipe(updated);
    onSave(updated);
  };

  return (
    <div className="fixed inset-0 z-[110] bg-zinc-900 p-6 flex flex-col overflow-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Editar receta</h2>
        <button
          onClick={onClose}
          className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center"
        >
          <SVGIcon name="X" size={20} className="text-white" />
        </button>
      </div>

      <div className="flex flex-col gap-4 flex-1 pb-8">
        <div>
          <label className="text-xs text-zinc-400 mb-1 block">Nombre</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-base outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="text-xs text-zinc-400 mb-1 block">Ingrediente</label>
          <input
            type="text"
            value={form.ingredient}
            onChange={(e) => setForm({ ...form, ingredient: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-base outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="text-xs text-zinc-400 mb-1 block">Porciones</label>
          <div className="flex items-center gap-4 bg-white/5 rounded-2xl px-4 py-3 border border-white/10">
            <button
              type="button"
              onClick={() => setForm({ ...form, cycles: Math.max(1, form.cycles - 1) })}
              className="w-9 h-9 bg-white text-black rounded-full font-bold"
            >
              −
            </button>
            <span className="flex-1 text-center font-bold">{form.cycles}</span>
            <button
              type="button"
              onClick={() => setForm({ ...form, cycles: form.cycles + 1 })}
              className="w-9 h-9 bg-white text-black rounded-full font-bold"
            >
              +
            </button>
          </div>
        </div>

        <div>
          <label className="text-xs text-zinc-400 mb-1 block">Calentar sartén (s)</label>
          <div className="flex items-center gap-4 bg-white/5 rounded-2xl px-4 py-3 border border-white/10">
            <button
              type="button"
              onClick={() => setForm({ ...form, preheatPanTime: Math.max(5, form.preheatPanTime - 5) })}
              className="w-9 h-9 bg-white/20 rounded-full font-bold"
            >
              −
            </button>
            <span className="flex-1 text-center font-bold">{form.preheatPanTime}s</span>
            <button
              type="button"
              onClick={() => setForm({ ...form, preheatPanTime: form.preheatPanTime + 5 })}
              className="w-9 h-9 bg-white/20 rounded-full font-bold"
            >
              +
            </button>
          </div>
        </div>

        <div>
          <label className="text-xs text-zinc-400 mb-1 block">Calentar aceite (s)</label>
          <div className="flex items-center gap-4 bg-white/5 rounded-2xl px-4 py-3 border border-white/10">
            <button
              type="button"
              onClick={() => setForm({ ...form, heatOilTime: Math.max(5, form.heatOilTime - 5) })}
              className="w-9 h-9 bg-white/20 rounded-full font-bold"
            >
              −
            </button>
            <span className="flex-1 text-center font-bold">{form.heatOilTime}s</span>
            <button
              type="button"
              onClick={() => setForm({ ...form, heatOilTime: form.heatOilTime + 5 })}
              className="w-9 h-9 bg-white/20 rounded-full font-bold"
            >
              +
            </button>
          </div>
        </div>

        <div>
          <label className="text-xs text-zinc-400 mb-1 block">Entre porciones (s)</label>
          <div className="flex items-center gap-4 bg-white/5 rounded-2xl px-4 py-3 border border-white/10">
            <button
              type="button"
              onClick={() => setForm({ ...form, transitionTime: Math.max(1, form.transitionTime - 1) })}
              className="w-9 h-9 bg-white/20 rounded-full font-bold"
            >
              −
            </button>
            <span className="flex-1 text-center font-bold">{form.transitionTime}s</span>
            <button
              type="button"
              onClick={() => setForm({ ...form, transitionTime: form.transitionTime + 1 })}
              className="w-9 h-9 bg-white/20 rounded-full font-bold"
            >
              +
            </button>
          </div>
        </div>

        <div>
          <label className="text-xs text-zinc-400 mb-1 block">Tiempo por lado</label>
          {form.steps.map((step, i) => (
            <div key={step.id} className="flex items-center justify-between py-2">
              <span>{step.name}</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const s = [...form.steps];
                    s[i].duration = Math.max(5, s[i].duration - 5);
                    setForm({ ...form, steps: s });
                  }}
                  className="w-8 h-8 bg-white/10 rounded-full font-bold text-sm"
                >
                  −
                </button>
                <span className="w-8 text-center font-bold">{step.duration}s</span>
                <button
                  type="button"
                  onClick={() => {
                    const s = [...form.steps];
                    s[i].duration += 5;
                    setForm({ ...form, steps: s });
                  }}
                  className="w-8 h-8 bg-white/10 rounded-full font-bold text-sm"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleSave}
          className="w-full py-4 bg-emerald-600 rounded-2xl font-bold text-lg mt-2"
        >
          Guardar
        </button>
      </div>
    </div>
  );
};
