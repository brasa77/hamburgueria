// The catalog owns every word. Optional segmentation only groups existing phrases.
const phraseGroups = {
  jl: [['Last Sauce', 'o molho especial da casa']],
};

export function anatomyProducts(catalog) {
  return catalog.filter(p => p.category === 'burgers' ||
    (p.category === 'combos' && /^Hambúrguer[^:]+:/u.test(p.description)))
    .map(product => {
      const recipe = product.category === 'combos'
        ? product.description.split(':').slice(1).join(':').split('. Acompanha')[0].trim()
        : product.description;
      let parts = recipe.replace(/\.$/, '').split(/\s*[,•]\s*|\s+e\s+/u);
      for (const group of phraseGroups[product.id] || []) {
        const start = parts.indexOf(group[0]);
        if (start >= 0 && group.every((text, i) => parts[start + i] === text)) {
          parts.splice(start, group.length, group.join(', '));
        }
      }
      return {...product, ingredients: parts.filter(Boolean)};
    });
}
