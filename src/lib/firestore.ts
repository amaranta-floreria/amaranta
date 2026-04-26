import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  writeBatch,
} from 'firebase/firestore';
import { db } from './firebase';
import { Product } from '@/types/product';

// ----- Catalogs -----

export interface FirestoreCatalog {
  id: string;
  name: string;
  slug: string;
  description: string;
  coverImageUrl: string;
  active: boolean;
  order: number;
}

const CATALOGS_COLLECTION = 'catalogs';

export async function getCatalogs(): Promise<FirestoreCatalog[]> {
  const snapshot = await getDocs(
    query(collection(db, CATALOGS_COLLECTION), orderBy('order', 'asc'))
  );
  return snapshot.docs.map((d) => ({ ...d.data(), id: d.id } as FirestoreCatalog));
}

export async function getActiveCatalogs(): Promise<FirestoreCatalog[]> {
  const snapshot = await getDocs(
    query(collection(db, CATALOGS_COLLECTION), where('active', '==', true))
  );
  const catalogs = snapshot.docs.map((d) => ({ ...d.data(), id: d.id } as FirestoreCatalog));
  return catalogs.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export async function getCatalogBySlug(slug: string): Promise<FirestoreCatalog | null> {
  const snapshot = await getDocs(
    query(collection(db, CATALOGS_COLLECTION), where('slug', '==', slug))
  );
  if (snapshot.empty) return null;
  const d = snapshot.docs[0];
  return { ...d.data(), id: d.id } as FirestoreCatalog;
}

export async function addCatalog(catalog: Omit<FirestoreCatalog, 'id'>): Promise<string> {
  const ref = await addDoc(collection(db, CATALOGS_COLLECTION), catalog);
  return ref.id;
}

export async function updateCatalog(
  id: string,
  updates: Partial<Omit<FirestoreCatalog, 'id'>>
): Promise<void> {
  await updateDoc(doc(db, CATALOGS_COLLECTION, id), updates);
}

export async function deleteCatalog(id: string): Promise<void> {
  await deleteDoc(doc(db, CATALOGS_COLLECTION, id));
}

// ----- Products -----

export interface AdminProduct extends Product {
  catalogIds: string[]; // many-to-many: one product can belong to multiple catalogs
  active: boolean;
  order: number;
}

const PRODUCTS_COLLECTION = 'products';

/** All products, regardless of catalog. */
export async function getAllProducts(): Promise<AdminProduct[]> {
  const snapshot = await getDocs(
    query(collection(db, PRODUCTS_COLLECTION), orderBy('order', 'asc'))
  );
  return snapshot.docs.map((d) => ({ ...d.data(), id: d.id } as AdminProduct));
}

/** Products belonging to a specific catalog slug. */
export async function getProductsByCatalog(catalogSlug: string): Promise<AdminProduct[]> {
  const snapshot = await getDocs(
    query(
      collection(db, PRODUCTS_COLLECTION),
      where('catalogIds', 'array-contains', catalogSlug)
    )
  );
  const products = snapshot.docs.map((d) => ({ ...d.data(), id: d.id } as AdminProduct));
  return products.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export async function addProduct(product: Omit<AdminProduct, 'id'>): Promise<string> {
  const ref = await addDoc(collection(db, PRODUCTS_COLLECTION), product);
  return ref.id;
}

export async function updateProduct(
  id: string,
  updates: Partial<Omit<AdminProduct, 'id'>>
): Promise<void> {
  await updateDoc(doc(db, PRODUCTS_COLLECTION, id), updates);
}

export async function deleteProduct(id: string): Promise<void> {
  await deleteDoc(doc(db, PRODUCTS_COLLECTION, id));
}

/** Bulk-import static product array into Firestore, assigning them to a catalog. */
export async function seedCatalog(products: Product[], catalogSlug: string): Promise<void> {
  const batch = writeBatch(db);
  products.forEach((p, index) => {
    const ref = doc(collection(db, PRODUCTS_COLLECTION));
    batch.set(ref, {
      name: p.name,
      price: p.price,
      imageUrl: p.imageUrl,
      description: p.description,
      longDescription: p.longDescription,
      catalogIds: [catalogSlug],
      active: true,
      order: index,
    });
  });
  await batch.commit();
}
