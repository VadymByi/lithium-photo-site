import PortfolioManager from './PortfolioManager';
import {
  getAllPhotos,
  getPortfolioItems,
  createPortfolioItem,
  deletePortfolioItem,
} from './actions';

// PORTFOLIO ADMIN PAGE
export default async function Page() {
  // FETCH DATA IN PARALLEL
  const [allPhotos, initialItems] = await Promise.all([
    getAllPhotos(),
    getPortfolioItems(),
  ]);

  // RENDER MANAGER
  return (
    <PortfolioManager
      allPhotos={allPhotos}
      initialItems={initialItems}
      createAction={createPortfolioItem}
      deleteAction={deletePortfolioItem}
    />
  );
}
