import type { Ingredient } from '../types';

export const INGREDIENTS: Ingredient[] = [
  // Verduras
  { id: 'alface', name: 'Alface', category: 'verdura', emoji: '🥬' },
  { id: 'espinafre', name: 'Espinafre', category: 'verdura', emoji: '🌿' },
  { id: 'couve', name: 'Couve', category: 'verdura', emoji: '🥬' },
  { id: 'rucula', name: 'Rúcula', category: 'verdura', emoji: '🌿' },
  { id: 'agriao', name: 'Agrião', category: 'verdura', emoji: '🌿' },
  { id: 'manjericao', name: 'Manjericão', category: 'verdura', emoji: '🌿' },
  { id: 'salsinha', name: 'Salsinha', category: 'verdura', emoji: '🌿' },
  { id: 'cebolinha', name: 'Cebolinha', category: 'verdura', emoji: '🌿' },
  { id: 'coentro', name: 'Coentro', category: 'verdura', emoji: '🌿' },

  // Legumes
  { id: 'tomate', name: 'Tomate', category: 'legume', emoji: '🍅' },
  { id: 'cenoura', name: 'Cenoura', category: 'legume', emoji: '🥕' },
  { id: 'beterraba', name: 'Beterraba', category: 'legume', emoji: '🫚' },
  { id: 'abobrinha', name: 'Abobrinha', category: 'legume', emoji: '🥗' },
  { id: 'berinjela', name: 'Berinjela', category: 'legume', emoji: '🍆' },
  { id: 'pimentao', name: 'Pimentão', category: 'legume', emoji: '🫑' },
  { id: 'cebola', name: 'Cebola', category: 'legume', emoji: '🧅' },
  { id: 'alho', name: 'Alho', category: 'legume', emoji: '🧄' },
  { id: 'brocolis', name: 'Brócolis', category: 'legume', emoji: '🥦' },
  { id: 'couve-flor', name: 'Couve-flor', category: 'legume', emoji: '🥦' },
  { id: 'pepino', name: 'Pepino', category: 'legume', emoji: '🥒' },
  { id: 'milho', name: 'Milho', category: 'legume', emoji: '🌽' },
  { id: 'ervilha', name: 'Ervilha', category: 'legume', emoji: '🫛' },
  { id: 'azeitona', name: 'Azeitona', category: 'legume', emoji: '🫒' },
  { id: 'palmito', name: 'Palmito', category: 'legume', emoji: '🌿' },
  { id: 'cogumelo', name: 'Cogumelo', category: 'legume', emoji: '🍄' },
  { id: 'chuchu', name: 'Chuchu', category: 'legume', emoji: '🥗' },
  { id: 'batata-doce', name: 'Batata-doce', category: 'legume', emoji: '🍠' },

  // Frutas
  { id: 'morango', name: 'Morango', category: 'fruta', emoji: '🍓' },
  { id: 'manga', name: 'Manga', category: 'fruta', emoji: '🥭' },
  { id: 'abacaxi', name: 'Abacaxi', category: 'fruta', emoji: '🍍' },
  { id: 'banana', name: 'Banana', category: 'fruta', emoji: '🍌' },
  { id: 'maca', name: 'Maçã', category: 'fruta', emoji: '🍎' },
  { id: 'uva', name: 'Uva', category: 'fruta', emoji: '🍇' },
  { id: 'limao', name: 'Limão', category: 'fruta', emoji: '🍋' },
  { id: 'laranja', name: 'Laranja', category: 'fruta', emoji: '🍊' },
  { id: 'coco', name: 'Coco', category: 'fruta', emoji: '🥥' },
  { id: 'amendoim', name: 'Amendoim', category: 'fruta', emoji: '🥜' },
  { id: 'acai', name: 'Açaí', category: 'fruta', emoji: '🫐' },

  // Carnes
  { id: 'frango', name: 'Frango', category: 'carne', emoji: '🐔' },
  { id: 'carne-bovina', name: 'Carne Bovina', category: 'carne', emoji: '🥩' },
  { id: 'porco', name: 'Porco', category: 'carne', emoji: '🐷' },
  { id: 'peixe', name: 'Peixe', category: 'carne', emoji: '🐟' },
  { id: 'salmao', name: 'Salmão', category: 'carne', emoji: '🍣' },
  { id: 'atum', name: 'Atum', category: 'carne', emoji: '🐟' },
  { id: 'camarao', name: 'Camarão', category: 'carne', emoji: '🦐' },
  { id: 'bacon', name: 'Bacon', category: 'carne', emoji: '🥓' },
  { id: 'linguica', name: 'Linguiça', category: 'carne', emoji: '🌭' },
  { id: 'calabresa', name: 'Calabresa', category: 'carne', emoji: '🌶️' },
  { id: 'presunto', name: 'Presunto', category: 'carne', emoji: '🍖' },
  { id: 'pepperoni', name: 'Pepperoni', category: 'carne', emoji: '🍕' },
  { id: 'costela', name: 'Costela', category: 'carne', emoji: '🍖' },
  { id: 'picanha', name: 'Picanha', category: 'carne', emoji: '🥩' },

  // Derivados
  { id: 'mussarela', name: 'Mussarela', category: 'derivado', emoji: '🧀' },
  { id: 'parmesao', name: 'Parmesão', category: 'derivado', emoji: '🧀' },
  { id: 'catupiry', name: 'Catupiry', category: 'derivado', emoji: '🧀' },
  { id: 'cream-cheese', name: 'Cream Cheese', category: 'derivado', emoji: '🧀' },
  { id: 'gorgonzola', name: 'Gorgonzola', category: 'derivado', emoji: '🧀' },
  { id: 'requeijao', name: 'Requeijão', category: 'derivado', emoji: '🧀' },
  { id: 'ovo', name: 'Ovo', category: 'derivado', emoji: '🥚' },
  { id: 'manteiga', name: 'Manteiga', category: 'derivado', emoji: '🧈' },
  { id: 'creme-de-leite', name: 'Creme de Leite', category: 'derivado', emoji: '🥛' },

  // Carboidratos / Outros
  { id: 'arroz', name: 'Arroz', category: 'carboidrato', emoji: '🍚' },
  { id: 'macarrao', name: 'Macarrão', category: 'carboidrato', emoji: '🍝' },
  { id: 'pao', name: 'Pão', category: 'carboidrato', emoji: '🍞' },
  { id: 'batata', name: 'Batata', category: 'carboidrato', emoji: '🥔' },
  { id: 'mandioca', name: 'Mandioca', category: 'carboidrato', emoji: '🥔' },
  { id: 'feijao', name: 'Feijão', category: 'carboidrato', emoji: '🫘' },
  { id: 'grao-de-bico', name: 'Grão-de-bico', category: 'carboidrato', emoji: '🫘' },
  { id: 'lentilha', name: 'Lentilha', category: 'carboidrato', emoji: '🫘' },

  // Outros
  { id: 'molho-pesto', name: 'Pesto', category: 'outro', emoji: '🌿' },
  { id: 'shoyu', name: 'Shoyu', category: 'outro', emoji: '🍱' },
  { id: 'gengibre', name: 'Gengibre', category: 'outro', emoji: '🌿' },
  { id: 'curry', name: 'Curry', category: 'outro', emoji: '🫙' },
  { id: 'mostarda', name: 'Mostarda', category: 'outro', emoji: '🫙' },
  { id: 'mel', name: 'Mel', category: 'outro', emoji: '🍯' },
];

export const INGREDIENT_CATEGORY_LABELS: Record<string, string> = {
  verdura: '🥬 Verduras',
  legume: '🥦 Legumes',
  fruta: '🍓 Frutas',
  carne: '🥩 Carnes',
  derivado: '🧀 Derivados',
  carboidrato: '🌾 Carboidratos',
  outro: '🫙 Outros',
};
