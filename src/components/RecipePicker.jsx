import { useState } from 'react';
import { getAllRecipes, getRecipeConfig } from '../data/recipes';
import { SVGIcon } from './SVGIcon';
import { NewRecipeForm } from './NewRecipeForm';
import { RecipeEditor } from './RecipeEditor';
import { PortionPicker } from './PortionPicker';

export const RecipePicker = ({ onSelectRecipe, onStart }) => {
  const [showNewRecipe, setShowNewRecipe] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [portionRecipe, setPortionRecipe] = useState(null);

  const recipes = Object.values(getAllRecipes());

  const handleRecipeTap = (recipe) => {
    setPortionRecipe(recipe);
  };

  const handlePortionConfirm = (config) => {
    onSelectRecipe(config);
    setPortionRecipe(null);
    onStart();
  };

  const handlePortionCancel = () => setPortionRecipe(null);

  const handleRecipeAdded = (recipe) => {
    setShowNewRecipe(false);
    setPortionRecipe(recipe);
  };

  const handleEdit = (e, recipe) => {
    e.stopPropagation();
    setEditingRecipe(recipe);
  };

  const handleEditorClose = () => setEditingRecipe(null);

  const handleEditorSave = (updatedRecipe) => {
    setEditingRecipe(null);
    onSelectRecipe(getRecipeConfig(updatedRecipe));
  };

  return (
    <div className="flex flex-col h-full bg-zinc-900">
      <div className="px-6 pt-12 pb-6 text-center">
        <h1 className="text-2xl font-bold text-white mb-1">¿Qué cocinamos?</h1>
        <p className="text-zinc-500 text-sm">Toca una receta para empezar</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-6">
        <div className="space-y-3">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              role="button"
              tabIndex={0}
              onClick={() => handleRecipeTap(recipe)}
              onKeyDown={(e) => e.key === 'Enter' && handleRecipeTap(recipe)}
              className="flex items-center gap-4 p-5 rounded-3xl bg-white/5 border border-white/5 active:bg-white/10 transition-colors"
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 text-3xl"
                style={{ backgroundColor: recipe.steps?.[0]?.hex ?? '#10b981' }}
              >
                {recipe.emoji || '👨‍🍳'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-lg text-white truncate">{recipe.name}</p>
                <p className="text-zinc-500 text-sm">
                  {recipe.cycles} porciones · {recipe.steps?.[0]?.duration}s + {recipe.steps?.[1]?.duration}s
                </p>
              </div>
              <button
                onClick={(e) => handleEdit(e, recipe)}
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0"
                aria-label="Editar"
              >
                <SVGIcon name="Sliders" size={18} className="text-zinc-400" />
              </button>
            </div>
          ))}

          <button
            onClick={() => setShowNewRecipe(true)}
            className="flex items-center justify-center gap-3 p-6 rounded-3xl border-2 border-dashed border-white/20 text-zinc-500 w-full hover:border-emerald-500/50 hover:text-emerald-400 transition-colors"
          >
            <span className="text-2xl">+</span>
            <span className="font-medium">Nueva receta</span>
          </button>
        </div>
      </div>

      {showNewRecipe && (
        <NewRecipeForm
          onClose={() => setShowNewRecipe(false)}
          onSave={handleRecipeAdded}
        />
      )}

      {editingRecipe && (
        <RecipeEditor
          recipe={editingRecipe}
          onClose={handleEditorClose}
          onSave={handleEditorSave}
        />
      )}

      {portionRecipe && (
        <PortionPicker
          recipe={portionRecipe}
          config={getRecipeConfig(portionRecipe)}
          onConfirm={handlePortionConfirm}
          onCancel={handlePortionCancel}
        />
      )}
    </div>
  );
};
