import { listItems, getItemById, createItem, updateItem, deleteItem } from './portfolio.service.js';
import { successResponse } from '../../utils/apiResponse.js';

export async function getPortfolioItems(req, res) {
  const { category, search } = req.query;
  const items = await listItems({ category, search });
  return successResponse(res, {
    statusCode: 200,
    message: 'Portfolio items retrieved successfully',
    data: items,
    meta: { count: items.length }
  });
}

export async function getPortfolioItem(req, res) {
  const item = await getItemById(req.params.id);
  return successResponse(res, {
    statusCode: 200,
    message: 'Portfolio item retrieved successfully',
    data: item
  });
}

export async function createPortfolioItem(req, res) {
  const newItem = await createItem(req.body);
  return successResponse(res, {
    statusCode: 201,
    message: 'Portfolio item created successfully',
    data: newItem
  });
}

export async function updatePortfolioItem(req, res) {
  const updated = await updateItem(req.params.id, req.body);
  return successResponse(res, {
    statusCode: 200,
    message: 'Portfolio item updated successfully',
    data: updated
  });
}

export async function removePortfolioItem(req, res) {
  const removed = await deleteItem(req.params.id);
  return successResponse(res, {
    statusCode: 200,
    message: 'Portfolio item deleted successfully',
    data: removed
  });
}

export default {
  getPortfolioItems,
  getPortfolioItem,
  createPortfolioItem,
  updatePortfolioItem,
  removePortfolioItem
};
