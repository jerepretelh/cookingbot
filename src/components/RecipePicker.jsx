import { useState } from 'react';
import { getAllRecipes, getRecipeConfig } from '../data/recipes';
import { SVGIcon } from './SVGIcon';
import { NewRecipeForm } from './NewRecipeForm';

export const RecipePicker = ({ onSelectRecipe, onStart }) => {
  const [selectedConfig, setSelectedConfig] = useState(null);
  const [showNewRecipe, setShowNewRecipe] = useState(false);

  const recipes = Object.values(getAllRecipes());

  const handleSelect = (recipe) => {
    const config = getRecipeConfig(recipe);
    setSelectedConfig(config);
    onSelectRecipe(config);
  };

  const handleRecipeAdded = (recipe) => {
    const config = getRecipeConfig(recipe);
    setSelectedConfig(config);
    onSelectRecipe(config);
    setShowNewRecipe(false);
  };

  return (
    <div className="flex flex-col h-full px-6 pt-6 pb-10 overflow-auto">
      <h1 className="text-2xl font-black italic uppercase text-center mb-2">
        ¿Qué vamos a cocinar hoy?
      </h1>
      <p className="text-zinc-500 text-sm text-center mb-8">
        Elige tu receta y cuando estés listo, ¡a cocinar!
      </p>

      <div className="flex flex-col gap-3 flex-1 overflow-y-auto pb-4">
        {recipes.map((recipe) => (
          <button
            key={recipe.id}
            onClick={() => handleSelect(recipe)}
            className={`flex items-center gap-4 p-5 rounded-3xl border-2 transition-all text-left ${
              selectedConfig?.recipeId === recipe.id
                ? 'bg-blue-600/20 border-blue-500 shadow-lg shadow-blue-500/20'
                : 'bg-zinc-900/60 border-white/10 hover:border-white/30 hover:bg-zinc-800/60'
            }`}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: recipe.steps?.[0]?.hex ?? '#3b82f6' }}
            >
              <SVGIcon name="ChefHat" size={28} className="text-white" fill="currentColor" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-lg uppercase truncate">{recipe.name}</p>
              <p className="text-zinc-500 text-sm">
                {recipe.cycles} porciones · {recipe.steps?.[0]?.duration}s + {recipe.steps?.[1]?.duration}s
              </p>
            </div>
          </button>
        ))}

        <button
          onClick={() => setShowNewRecipe(true)}
          className="flex items-center justify-center gap-3 p-5 rounded-3xl border-2 border-dashed border-white/30 hover:border-blue-500 hover:bg-blue-500/10 transition-all text-zinc-400 hover:text-blue-400"
        >
          <span className="text-2xl font-light">+</span>
          <span className="font-bold uppercase">Crear nueva receta</span>
        </button>
      </div>

      <button
        onClick={onStart}
        disabled={!selectedConfig}
        className={`w-full py-6 rounded-3xl font-black uppercase tracking-widest text-lg shadow-xl transition-all ${
          selectedConfig
            ? 'bg-white text-black hover:scale-[1.02] active:scale-[0.98] shadow-white/20'
            : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
        }`}
      >
        ¡Empezar!
      </button>

      {showNewRecipe && (
        <NewRecipeForm
          onClose={() => setShowNewRecipe(false)}
          onSave={handleRecipeAdded}
        />
      )}
    </div>
  );
};
