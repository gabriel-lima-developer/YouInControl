import { Navigate, Route, Routes, useParams } from 'react-router-dom';
import { ShoppingListDetailsPage } from '../features/shopping-lists/pages/ShoppingListDetailsPage';
import { ShoppingListsPage } from '../features/shopping-lists/pages/ShoppingListsPage';
import { AppLayout } from '../layouts/AppLayout';
import { NotFoundPage } from '../pages/NotFoundPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate replace to="/shopping-lists" />} />
        <Route path="lists" element={<Navigate replace to="/shopping-lists" />} />
        <Route path="shopping-lists" element={<ShoppingListsPage />} />
        <Route path="shopping-lists/:id" element={<ShoppingListDetailsPage />} />
        <Route path="lists/:id" element={<LegacyShoppingListRedirect />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

function LegacyShoppingListRedirect() {
  const { id = '' } = useParams();

  return <Navigate replace to={`/shopping-lists/${id}`} />;
}
