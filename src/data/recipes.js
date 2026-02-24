const STORAGE_KEY = 'chefbot-custom-recipes';

const PRESET_RECIPES = {
  huevo: {
    id: 'huevo',
    name: 'Huevo frito',
    ingredient: 'Huevo',
    emoji: '🥚',
    preheatPanTime: 40,
    heatOilTime: 40,
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
    emoji: '🥔',
    preheatPanTime: 40,
    heatOilTime: 40,
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
    emoji: '🥩',
    preheatPanTime: 40,
    heatOilTime: 40,
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
    emoji: '🥞',
    preheatPanTime: 40,
    heatOilTime: 40,
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
  const normalized = normalizeRecipe(recipe);
  custom[normalized.id] = { ...normalized, isPreset: false };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(custom));
};

const normalizeRecipe = (r) => ({
  ...r,
  emoji: r.emoji || '👨‍🍳',
  preheatPanTime: r.preheatPanTime ?? 40,
  heatOilTime: r.heatOilTime ?? r.prepTime ?? 40,
});

export const deleteCustomRecipe = (id) => {
  const custom = getCustomRecipes();
  delete custom[id];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(custom));
};

export const getAllRecipes = () => {
  const presets = Object.values(PRESET_RECIPES).map(normalizeRecipe);
  const custom = Object.values(getCustomRecipes()).map(normalizeRecipe);
  return [...presets, ...custom].reduce((acc, r) => {
    acc[r.id] = r;
    return acc;
  }, {});
};

export const getRecipeConfig = (recipe) => {
  const r = normalizeRecipe(recipe);
  return {
    recipeId: r.id,
    ingredient: r.ingredient,
    preheatPanTime: r.preheatPanTime ?? 40,
    heatOilTime: r.heatOilTime ?? 40,
    cycles: r.cycles,
    transitionTime: r.transitionTime,
    steps: r.steps.map((s) => ({ ...s })),
  };
};

export const createRecipeId = () => `custom-${Date.now()}`;
