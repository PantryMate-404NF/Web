import type { Recipe } from './types';

export const recipeMocks: Recipe[] = [
  {
    id: 'kimchi-stew',
    name: '대파 듬뿍 김치찌개',
    category: '한식',
    cookTime: '20분',
    description: '남아 있는 대파와 김치를 먼저 활용하는 따뜻한 한 끼예요.',
    cookingSteps: [
      '냄비에 김치와 돼지고기를 넣고 볶아 주세요.',
      '물과 양념을 넣고 끓인 뒤 두부와 대파를 넣어 마무리해요.',
      '한소끔 더 끓인 뒤 간을 맞춰 주세요.',
      '그릇에 담아 따뜻할 때 맛있게 즐겨요.',
    ],
    missingCount: 2,
    ingredients: [
      { id: 'green-onion', name: '대파', amount: '1/2대', isOwned: true, isImminent: true },
      { id: 'kimchi', name: '김치', amount: '200g', isOwned: true },
      { id: 'pork', name: '돼지고기', amount: '150g', isOwned: false },
      { id: 'tofu', name: '두부', amount: '1/2모', isOwned: false },
    ],
    linkedProducts: [
      {
        id: 'pork',
        ingredient: '돼지고기',
        name: '국내산 돼지고기 앞다리살',
        price: 7980,
        isShortage: true,
      },
      { id: 'tofu', ingredient: '두부', name: '국산 콩두부', price: 2480, isShortage: true },
    ],
  },
  {
    id: 'egg-potato-soup',
    name: '감자 계란국',
    category: '국·탕',
    cookTime: '15분',
    description: '감자와 계란으로 빠르게 만들 수 있는 담백한 국이에요.',
    cookingSteps: [
      '감자와 대파를 먹기 좋은 크기로 썰어 준비해요.',
      '끓는 물에 감자를 넣고 익힌 뒤 계란을 풀어 넣어 주세요.',
      '계란이 몽글몽글 익을 때까지 가볍게 저어 주세요.',
      '소금으로 간을 맞춘 뒤 대파를 올려 마무리해요.',
    ],
    missingCount: 0,
    ingredients: [
      { id: 'potato', name: '감자', amount: '2개', isOwned: true },
      { id: 'egg', name: '계란', amount: '2개', isOwned: true },
      { id: 'green-onion', name: '대파', amount: '1/3대', isOwned: true, isImminent: true },
    ],
    linkedProducts: [],
  },
  {
    id: 'pork-vegetable-stir-fry',
    name: '돼지고기 채소볶음',
    category: '메인',
    cookTime: '25분',
    description: '소비기한이 가까운 돼지고기를 우선 활용하는 볶음 요리예요.',
    cookingSteps: [
      '돼지고기와 채소를 먹기 좋은 크기로 손질해요.',
      '팬에 돼지고기를 볶다가 채소와 양념을 넣고 센 불에 볶아 주세요.',
      '재료가 고르게 익도록 뒤집어 가며 볶아 주세요.',
      '불을 끄고 접시에 담아 완성해요.',
    ],
    missingCount: 1,
    ingredients: [
      { id: 'pork', name: '돼지고기', amount: '200g', isOwned: true, isImminent: true },
      { id: 'carrot', name: '당근', amount: '1/2개', isOwned: true },
      { id: 'mushroom', name: '버섯', amount: '100g', isOwned: false },
    ],
    linkedProducts: [
      {
        id: 'mushroom',
        ingredient: '버섯',
        name: '국내산 새송이버섯',
        price: 2980,
        isShortage: true,
      },
    ],
  },
];

export function getRecipeById(recipeId: string) {
  return recipeMocks.find((recipe) => recipe.id === recipeId) ?? recipeMocks[0];
}
