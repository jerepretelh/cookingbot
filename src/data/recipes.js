const STORAGE_KEY = 'chefbot-custom-recipes';

const PRESET_RECIPES = {
  huevo: {
    id: 'huevo',
    name: 'Huevo frito',
    ingredient: 'Huevo',
    prepTime: 10,
    cycles: 3,
    transitionTime: 5,
    isPreset: true,
    steps: [
      { id: 1, name: 'Lado A', duration: 30, hex: '#52c18d' },
      { id: 2, name: 'Lado B', duration: 20, hex: '#f97316' },
    ],
  },
  papas: {
    id: 'papas',
    name: 'Papas fritas',
    ingredient: 'Papas',
    prepTime: 8,
    cycles: 4,
    transitionTime: 6,
    isPreset: true,
    steps: [
      { id: 1, name: 'Lado A', duration: 45, hex: '#52c18d' },
      { id: 2, name: 'Lado B', duration: 40, hex: '#f97316' },
    ],
  },
  carne: {
    id: 'carne',
    name: 'Bife / Carne',
    ingredient: 'Carne',
    prepTime: 12,
    cycles: 2,
    transitionTime: 8,
    isPreset: true,
    steps: [
      { id: 1, name: 'Lado A', duration: 90, hex: '#52c18d' },
      { id: 2, name: 'Lado B', duration: 75, hex: '#f97316' },
    ],
  },
  pancakes: {
    id: 'pancakes',
    name: 'Pancakes',
    ingredient: 'Pancake',
    prepTime: 5,
    cycles: 6,
    transitionTime: 4,
    isPreset: true,
    steps: [
      { id: 1, name: 'Lado A', duration: 60, hex: '#52c18d' },
      { id: 2, name: 'Lado B', duration: 45, hex: '#f97316' },
    ],
  },
};

export const RECIPES = PRESET_RECIPES;

export const getCustomRecipes = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

export const saveCustomRecipe = (recipe) => {
  const custom = getCustomRecipes();
  custom[recipe.id] = { ...recipe, isPreset: false };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(custom));
};

export const deleteCustomRecipe = (id) => {
  const custom = getCustomRecipes();
  delete custom[id];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(custom));
};

export const getAllRecipes = () => ({ ...PRESET_RECIPES, ...getCustomRecipes() });

export const getRecipeConfig = (recipe) => ({
  recipeId: recipe.id,
  ingredient: recipe.ingredient,
  prepTime: recipe.prepTime,
  cycles: recipe.cycles,
  transitionTime: recipe.transitionTime,
  steps: recipe.steps.map((s) => ({ ...s })),
});

export const createRecipeId = () => `custom-${Date.now()}`;
