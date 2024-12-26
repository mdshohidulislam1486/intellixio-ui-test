'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Product } from '@/types';
import { ProductModal } from '@/views/products/productModal/productModal';
import { BackToHome } from '@/components/backToHome/backToHome';
import { ProductList } from '@/views/products/productList/productList';
import { PaginationControls } from '@/views/products/paginationControls/paginationControls';
import { usePagination } from '@/hooks/usePagination';
import { PRODUCTS_DATA } from '@/data/productsData';
import { useRouter } from 'next/navigation';
import _ from 'lodash';

export const Products: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const {
    currentPage,
    totalPages,
    paginatedItems: paginatedProducts,
    handlePageChange,
  } = usePagination({ items: PRODUCTS_DATA, itemsPerPage: 5 });
  const router = useRouter();
  useEffect(() => {
    const handlePopState = () => {
      const url = new URL(window.location.href);
      const productId = url.searchParams.get('product-id');
      if (productId) {
        const product = PRODUCTS_DATA.find((p) => p.id === productId);
        if (product) {
          setSelectedProduct(product);
        }
      } else {
        handleCloseModal();
      }
    };

    window.addEventListener('popstate', handlePopState);

    // on reload setting product and push history
    const url = new URL(window.location.href);
    const productId = url.searchParams.get('product-id');
    if (productId) {
      const product = PRODUCTS_DATA.find((p) => p.id === productId);
      if (product) {
        setSelectedProduct(product);
        router.replace(`/products?product-id=${productId}`);
      }
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const handleOpenModal = useCallback((product: Product) => {
    const productId = _.get(product, ['id'], '');
    const newUrl = `/products?product-id=${productId}`;
    router.push(newUrl);
    setSelectedProduct(product);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedProduct(null);
    router.push('/products');
  }, []);

  return (
    <div>
      <BackToHome />
      <ProductList products={paginatedProducts} onOpenModal={handleOpenModal} />
      <div className="h-4" />
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={handleCloseModal} />
      )}
    </div>
  );
};
