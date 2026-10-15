// Mock data storage for portfolio items / projects
let portfolioItems = [
  {
    id: '1',
    title: 'Modern E-Commerce Platform',
    description: 'Full-stack multi-vendor marketplace with real-time checkout and payment gateway.',
    category: 'Full Stack',
    tags: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
    demoUrl: 'https://demo.example.com/ecommerce',
    githubUrl: 'https://github.com/example/ecommerce-app',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'AI Analytics Dashboard',
    description: 'High-performance interactive analytics dashboard visualizing real-time metrics.',
    category: 'Data & AI',
    tags: ['Next.js', 'Python', 'FastAPI', 'Chart.js'],
    demoUrl: 'https://demo.example.com/ai-dash',
    githubUrl: 'https://github.com/example/ai-dash',
    createdAt: new Date().toISOString()
  }
];

export async function listItems({ category, search } = {}) {
  let results = [...portfolioItems];

  if (category) {
    results = results.filter(item => item.category.toLowerCase() === category.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    results = results.filter(item =>
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.tags.some(tag => tag.toLowerCase().includes(q))
    );
  }

  return results;
}

export async function getItemById(id) {
  const item = portfolioItems.find(p => p.id === id);
  if (!item) {
    const error = new Error(`Portfolio item with ID ${id} not found`);
    error.statusCode = 404;
    error.isOperational = true;
    throw error;
  }
  return item;
}

export async function createItem(data) {
  const newItem = {
    id: String(portfolioItems.length + 1),
    title: data.title,
    description: data.description,
    category: data.category || 'General',
    tags: data.tags || [],
    demoUrl: data.demoUrl || null,
    githubUrl: data.githubUrl || null,
    createdAt: new Date().toISOString()
  };

  portfolioItems.push(newItem);
  return newItem;
}

export async function updateItem(id, updates) {
  const index = portfolioItems.findIndex(p => p.id === id);
  if (index === -1) {
    const error = new Error(`Portfolio item with ID ${id} not found`);
    error.statusCode = 404;
    error.isOperational = true;
    throw error;
  }

  const { id: _, createdAt: __, ...validUpdates } = updates;
  portfolioItems[index] = {
    ...portfolioItems[index],
    ...validUpdates,
    updatedAt: new Date().toISOString()
  };

  return portfolioItems[index];
}

export async function deleteItem(id) {
  const index = portfolioItems.findIndex(p => p.id === id);
  if (index === -1) {
    const error = new Error(`Portfolio item with ID ${id} not found`);
    error.statusCode = 404;
    error.isOperational = true;
    throw error;
  }

  const [removed] = portfolioItems.splice(index, 1);
  return removed;
}

export default {
  listItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem
};
