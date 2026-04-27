'use client';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  AdminProduct,
  FirestoreCatalog,
  getAllProducts,
  getProductsByCatalog,
  addProduct,
  updateProduct,
  deleteProduct,
  getCatalogs,
  addCatalog,
  updateCatalog,
  deleteCatalog,
} from '@/lib/firestore';
import {
  Flower2,
  LogOut,
  Plus,
  Minus,
  Trash2,
  Pencil,
  Check,
  X,
  Upload,
  ToggleLeft,
  ToggleRight,
  ExternalLink,
  ArrowLeft,
  Search,
  ChevronRight,
} from 'lucide-react';

// ─── Shared helpers ─────────────────────────────────────────────────────────

function Spinner({ sm }: { sm?: boolean }) {
  const s = sm ? 'w-3.5 h-3.5' : 'w-6 h-6';
  return <div className={`${s} rounded-full border-2 border-rose-300 border-t-transparent animate-spin`} />;
}

function EditableCell({
  value,
  onSave,
  type = 'text',
  multiline = false,
}: {
  value: string | number;
  onSave: (v: string | number) => void;
  type?: 'text' | 'number';
  multiline?: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value));

  function commit() {
    onSave(type === 'number' ? Number(draft) : draft);
    setEditing(false);
  }
  function cancel() {
    setDraft(String(value));
    setEditing(false);
  }

  if (!editing) {
    return (
      <button
        onClick={() => setEditing(true)}
        className="group flex items-start gap-1 text-left hover:text-[#b5606a] transition-colors w-full"
      >
        <span className="flex-1 whitespace-pre-wrap break-words">{value}</span>
        <Pencil className="w-3 h-3 opacity-0 group-hover:opacity-40 mt-0.5 flex-shrink-0 transition-opacity" />
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      {multiline ? (
        <textarea
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          className="w-full text-sm border border-rose-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-rose-300 resize-none"
          rows={4}
        />
      ) : (
        <input
          autoFocus
          type={type}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') cancel(); }}
          className="w-full text-sm border border-rose-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-rose-300"
        />
      )}
      <div className="flex gap-1">
        <button onClick={commit} className="p-1 rounded text-green-600 hover:bg-green-50"><Check className="w-3.5 h-3.5" /></button>
        <button onClick={cancel} className="p-1 rounded text-gray-400 hover:bg-gray-100"><X className="w-3.5 h-3.5" /></button>
      </div>
    </div>
  );
}

/** Inline image cell in a table row — hover to replace via upload or URL. */
function ImageCell({
  imageUrl,
  onUpdate,
}: {
  imageUrl: string;
  onUpdate: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [editingUrl, setEditingUrl] = useState(false);
  const [urlDraft, setUrlDraft] = useState(imageUrl);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      if (data.url) onUpdate(data.url);
    } catch (err) {
      console.error('Upload error:', err);
      alert(err instanceof Error ? err.message : 'Error al subir la imagen.');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  if (editingUrl) {
    return (
      <div className="flex flex-col gap-1 w-20">
        <input
          autoFocus
          value={urlDraft}
          onChange={(e) => setUrlDraft(e.target.value)}
          placeholder="https://…"
          className="text-xs border border-rose-200 rounded px-1 py-0.5 focus:outline-none w-full"
        />
        <div className="flex gap-1">
          <button onClick={() => { onUpdate(urlDraft); setEditingUrl(false); }} className="p-0.5 text-green-600"><Check className="w-3 h-3" /></button>
          <button onClick={() => { setUrlDraft(imageUrl); setEditingUrl(false); }} className="p-0.5 text-gray-400"><X className="w-3 h-3" /></button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-16 h-16 flex-shrink-0 group">
      {imageUrl ? (
        <img src={imageUrl} alt="" className="w-full h-full object-cover rounded-lg" />
      ) : (
        <div className="w-full h-full bg-rose-50 rounded-lg flex items-center justify-center">
          <Flower2 className="w-5 h-5 text-rose-200" />
        </div>
      )}
      {/* Hover overlay */}
      {!uploading && (
        <div className="absolute inset-0 rounded-lg bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
          <label className="cursor-pointer p-1 rounded bg-white/20 hover:bg-white/40 transition-colors" title="Subir imagen">
            <Upload className="w-3.5 h-3.5 text-white" />
            <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
          </label>
          <button onClick={() => setEditingUrl(true)} className="p-1 rounded bg-white/20 hover:bg-white/40 transition-colors" title="URL">
            <Pencil className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
      )}
      {uploading && (
        <div className="absolute inset-0 rounded-lg bg-white/80 flex items-center justify-center">
          <Spinner sm />
        </div>
      )}
    </div>
  );
}

/** Inline catalog assignment cell — shows pills, click to open checkbox list. */
function CatalogChipsCell({
  catalogIds,
  allCatalogs,
  onSave,
}: {
  catalogIds: string[];
  allCatalogs: FirestoreCatalog[];
  onSave: (ids: string[]) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(catalogIds);

  function toggle(slug: string, checked: boolean) {
    setDraft((prev) => checked ? [...prev, slug] : prev.filter((s) => s !== slug));
  }

  if (!editing) {
    return (
      <button
        onClick={() => { setDraft(catalogIds); setEditing(true); }}
        className="group flex flex-wrap gap-1 items-start text-left w-full"
      >
        {draft.length === 0 ? (
          <span className="text-gray-300 text-xs italic">Sin catálogo</span>
        ) : (
          draft.map((slug) => {
            const cat = allCatalogs.find((c) => c.slug === slug);
            return (
              <span key={slug} className="inline-block px-2 py-0.5 bg-rose-50 text-[#b5606a] text-xs rounded-full border border-[#e8c4bc]">
                {cat?.name ?? slug}
              </span>
            );
          })
        )}
        <Pencil className="w-3 h-3 opacity-0 group-hover:opacity-30 mt-0.5 flex-shrink-0 transition-opacity" />
      </button>
    );
  }

  return (
    <div className="space-y-1.5">
      {allCatalogs.map((cat) => (
        <label key={cat.id} className="flex items-center gap-2 text-xs cursor-pointer">
          <input
            type="checkbox"
            checked={draft.includes(cat.slug)}
            onChange={(e) => toggle(cat.slug, e.target.checked)}
            className="accent-[#b5606a]"
          />
          <span>{cat.name}</span>
        </label>
      ))}
      {allCatalogs.length === 0 && (
        <span className="text-xs text-gray-400">Crea catálogos primero.</span>
      )}
      <div className="flex gap-1 pt-1">
        <button onClick={() => { onSave(draft); setEditing(false); }} className="p-1 rounded text-green-600 hover:bg-green-50"><Check className="w-3.5 h-3.5" /></button>
        <button onClick={() => { setDraft(catalogIds); setEditing(false); }} className="p-1 rounded text-gray-400 hover:bg-gray-100"><X className="w-3.5 h-3.5" /></button>
      </div>
    </div>
  );
}

// ─── Image upload area (for create product form) ─────────────────────────────
// Does NOT upload immediately — just shows a local preview.
// The actual upload is deferred to form submit.

function ImageUploadArea({
  preview,    // local object URL (from selected file) or remote URL
  urlValue,   // value for the manual URL input
  hasPendingFile, // true when a local file is staged but not yet uploaded
  onFile,     // called when a file is selected: (file, localObjectURL)
  onUrl,      // called when the URL input changes
}: {
  preview: string;
  urlValue: string;
  hasPendingFile: boolean;
  onFile: (file: File, localPreview: string) => void;
  onUrl: (url: string) => void;
}) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    onFile(file, URL.createObjectURL(file));
    // Reset so the same file can be re-selected after clearing
    e.target.value = '';
  }

  return (
    <div className="space-y-2">
      <label className="block cursor-pointer">
        <input type="file" accept="image/*" className="hidden" onChange={handleChange} />
        {preview ? (
          <div className="relative rounded-xl overflow-hidden aspect-square w-full">
            <img src={preview} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center">
              <Upload className="w-6 h-6 text-white opacity-0 hover:opacity-100 transition-opacity" />
            </div>
            {/* Badge shown when a file is staged but not yet uploaded */}
            {hasPendingFile && (
              <div className="absolute bottom-2 left-0 right-0 flex justify-center">
                <span className="text-[10px] bg-black/60 text-white px-2 py-0.5 rounded-full backdrop-blur-sm">
                  Se subirá al guardar
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="border-2 border-dashed border-rose-200 rounded-xl aspect-square w-full flex flex-col items-center justify-center text-gray-400 hover:border-rose-400 hover:text-[#b5606a] transition-colors">
            <Upload className="w-8 h-8 mb-2" />
            <span className="text-sm font-medium">Subir imagen</span>
            <span className="text-xs mt-1">JPG, PNG, WebP</span>
          </div>
        )}
      </label>
      <input
        type="url"
        placeholder="O pega una URL de imagen"
        value={urlValue}
        onChange={(e) => onUrl(e.target.value)}
        className="w-full text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-rose-300"
      />
    </div>
  );
}

// ─── Create product form ─────────────────────────────────────────────────────

function CreateProductForm({
  allCatalogs,
  initialCatalogIds = [],
  onAdd,
  onCancel,
}: {
  allCatalogs: FirestoreCatalog[];
  initialCatalogIds?: string[];
  onAdd: (p: AdminProduct) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [longDescription, setLongDescription] = useState('');
  // Image: either a pending local file (not yet uploaded) OR a remote URL typed manually.
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(''); // local object URL while file is pending
  const [imageUrl, setImageUrl] = useState('');         // manual URL input / final URL after upload
  const [catalogIds, setCatalogIds] = useState<string[]>(initialCatalogIds);
  const [savingStatus, setSavingStatus] = useState<'idle' | 'uploading' | 'saving'>('idle');

  const inp = 'w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-rose-300';
  const isSaving = savingStatus !== 'idle';

  function handleFileSelect(file: File, localPreview: string) {
    setImageFile(file);
    setImagePreview(localPreview);
    setImageUrl(''); // clear manual URL — file takes precedence
  }

  function handleUrlChange(url: string) {
    setImageUrl(url);
    setImageFile(null);
    setImagePreview(''); // clear local preview
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !price) return;

    let finalImageUrl = imageUrl;

    // Upload the staged file now, at submit time.
    if (imageFile) {
      setSavingStatus('uploading');
      const fd = new FormData();
      fd.append('file', imageFile);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      if (!data.url) throw new Error('No se recibió URL de la imagen.');
      finalImageUrl = data.url;
    }

    setSavingStatus('saving');
    const newProduct: Omit<AdminProduct, 'id'> = {
      name,
      price: Number(price),
      description,
      longDescription,
      imageUrl: finalImageUrl,
      catalogIds,
      active: true,
      order: Date.now(),
    };
    const id = await addProduct(newProduct);
    onAdd({ ...newProduct, id });
    setSavingStatus('idle');
  }

  const buttonLabel =
    savingStatus === 'uploading' ? 'Subiendo imagen…' :
    savingStatus === 'saving'    ? 'Guardando…' :
                                   'Guardar producto';

  return (
    <form onSubmit={handleSubmit} className="bg-rose-50 border border-rose-100 rounded-2xl p-6 mb-6">
      <p className="text-xs font-medium text-[#b5606a] uppercase tracking-widest mb-4">Nuevo producto</p>

      <div className="grid grid-cols-[200px_1fr] gap-6">
        {/* Left: image upload (deferred — actual upload happens on submit) */}
        <div>
          <p className="text-xs text-gray-500 mb-2">Imagen</p>
          <ImageUploadArea
            preview={imagePreview || imageUrl}
            urlValue={imageUrl}
            hasPendingFile={!!imageFile}
            onFile={handleFileSelect}
            onUrl={handleUrlChange}
          />
        </div>

        {/* Right: fields */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Nombre *</label>
              <input required className={inp} value={name} onChange={(e) => setName(e.target.value)} placeholder="Cariño" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Precio (MXN) *</label>
              <input required type="number" className={inp} value={price} onChange={(e) => setPrice(e.target.value)} placeholder="600" />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">Descripción corta</label>
            <input className={inp} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="🌸 Ramo de tulipanes · 6 piezas" />
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">Descripción larga</label>
            <textarea className={inp} rows={4} value={longDescription} onChange={(e) => setLongDescription(e.target.value)} placeholder="Composición floral que reúne…" />
          </div>

          {/* Catalog assignment */}
          <div>
            <label className="text-xs text-gray-500 mb-2 block">Agregar a catálogos (opcional)</label>
            {allCatalogs.length === 0 ? (
              <p className="text-xs text-gray-400 italic">No hay catálogos disponibles aún.</p>
            ) : (
              <div className="flex flex-wrap gap-3">
                {allCatalogs.map((cat) => (
                  <label key={cat.id} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={catalogIds.includes(cat.slug)}
                      onChange={(e) =>
                        setCatalogIds((prev) =>
                          e.target.checked ? [...prev, cat.slug] : prev.filter((s) => s !== cat.slug)
                        )
                      }
                      className="accent-[#b5606a]"
                    />
                    <span>{cat.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#b5606a] text-white text-sm rounded-lg hover:bg-[#9a4f59] transition-colors disabled:opacity-50"
            >
              {isSaving ? <Spinner sm /> : <Check className="w-3.5 h-3.5" />}
              {buttonLabel}
            </button>
            <button
              type="button"
              onClick={onCancel}
              disabled={isSaving}
              className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-40"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

// ─── Product library view ────────────────────────────────────────────────────

function ProductLibraryView({ allCatalogs }: { allCatalogs: FirestoreCatalog[] }) {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    getAllProducts().then(setProducts).finally(() => setLoading(false));
  }, []);

  async function handleUpdate(id: string, field: string, value: string | number | string[]) {
    await updateProduct(id, { [field]: value });
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar este producto?')) return;
    setDeletingId(id);
    const product = products.find((p) => p.id === id);
    // Remove image from Vercel Blob before deleting the Firestore document.
    if (product?.imageUrl?.includes('.blob.vercel-storage.com')) {
      await fetch('/api/upload', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: product.imageUrl }),
      });
    }
    await deleteProduct(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setDeletingId(null);
  }

  return (
    <div>
      {/* Actions bar */}
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-gray-400">
          {products.length} {products.length === 1 ? 'producto' : 'productos'}
        </p>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-1.5 px-3 py-2 text-sm bg-[#b5606a] text-white rounded-lg hover:bg-[#9a4f59] transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Crear producto
        </button>
      </div>

      {showForm && (
        <CreateProductForm
          allCatalogs={allCatalogs}
          onAdd={(p) => { setProducts((prev) => [p, ...prev]); setShowForm(false); }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {loading ? (
        <div className="flex items-center justify-center py-24"><Spinner /></div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-gray-400 text-sm">
          <p>No hay productos registrados.</p>
          <p className="text-xs mt-1">Usa &quot;Crear producto&quot; para agregar el primero.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-rose-100 overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[72px_1fr_88px_2fr_2fr_180px_44px] gap-4 px-4 py-3 bg-rose-50 border-b border-rose-100 text-xs font-medium text-[#b5606a] uppercase tracking-wide">
            <span>Imagen</span>
            <span>Nombre</span>
            <span>Precio</span>
            <span>Descripción</span>
            <span>Descripción larga</span>
            <span>Catálogos</span>
            <span />
          </div>

          {products.map((product, i) => (
            <div
              key={product.id}
              className={`grid grid-cols-[72px_1fr_88px_2fr_2fr_180px_44px] gap-4 px-4 py-4 items-start text-sm ${i < products.length - 1 ? 'border-b border-rose-50' : ''}`}
            >
              {/* Image */}
              <ImageCell
                imageUrl={product.imageUrl}
                onUpdate={(url) => handleUpdate(product.id, 'imageUrl', url)}
              />

              {/* Name */}
              <div className="font-medium text-gray-800 min-w-0">
                <EditableCell
                  value={product.name}
                  onSave={(v) => handleUpdate(product.id, 'name', v)}
                />
              </div>

              {/* Price */}
              <div className="text-[#b5606a] font-medium">
                <EditableCell
                  value={product.price}
                  type="number"
                  onSave={(v) => handleUpdate(product.id, 'price', v)}
                />
              </div>

              {/* Short description */}
              <div className="text-gray-500 text-xs">
                <EditableCell
                  value={product.description}
                  onSave={(v) => handleUpdate(product.id, 'description', v)}
                />
              </div>

              {/* Long description */}
              <div className="text-gray-500 text-xs">
                <EditableCell
                  value={product.longDescription}
                  multiline
                  onSave={(v) => handleUpdate(product.id, 'longDescription', v)}
                />
              </div>

              {/* Catalog assignment */}
              <CatalogChipsCell
                catalogIds={product.catalogIds ?? []}
                allCatalogs={allCatalogs}
                onSave={(ids) => handleUpdate(product.id, 'catalogIds', ids)}
              />

              {/* Delete */}
              <div className="flex justify-center">
                <button
                  onClick={() => handleDelete(product.id)}
                  disabled={deletingId === product.id}
                  className="p-1.5 text-gray-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Catalogs view ────────────────────────────────────────────────────────────

// ─── Catalog detail view ─────────────────────────────────────────────────────

function CatalogDetailView({
  catalog,
  allCatalogs,
  onBack,
  onCatalogUpdate,
}: {
  catalog: FirestoreCatalog;
  allCatalogs: FirestoreCatalog[];
  onBack: () => void;
  onCatalogUpdate: (c: FirestoreCatalog) => void;
}) {
  const [info, setInfo] = useState(catalog);
  const [catalogProducts, setCatalogProducts] = useState<AdminProduct[]>([]);
  const [allProducts, setAllProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddExisting, setShowAddExisting] = useState(false);
  const [showCreateNew, setShowCreateNew] = useState(false);
  const [search, setSearch] = useState('');
  const [addingId, setAddingId] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      getProductsByCatalog(catalog.slug),
      getAllProducts(),
    ]).then(([catProds, all]) => {
      setCatalogProducts(catProds);
      setAllProducts(all);
      setLoading(false);
    });
  }, [catalog.slug]);

  // Products not yet in this catalog, filtered by search query.
  const inCatalogIds = new Set(catalogProducts.map((p) => p.id));
  const availableProducts = allProducts
    .filter((p) => !inCatalogIds.has(p.id))
    .filter((p) => !search || p.name.toLowerCase().includes(search.toLowerCase()));

  async function handleUpdateInfo(field: string, value: string | boolean) {
    const updated = { ...info, [field]: value };
    setInfo(updated);
    await updateCatalog(catalog.id, { [field]: value });
    onCatalogUpdate(updated);
  }

  async function handleRemove(product: AdminProduct) {
    setRemovingId(product.id);
    const newIds = (product.catalogIds ?? []).filter((s) => s !== catalog.slug);
    await updateProduct(product.id, { catalogIds: newIds });
    const updated = { ...product, catalogIds: newIds };
    setCatalogProducts((prev) => prev.filter((p) => p.id !== product.id));
    setAllProducts((prev) => prev.map((p) => (p.id === product.id ? updated : p)));
    setRemovingId(null);
  }

  async function handleAdd(product: AdminProduct) {
    setAddingId(product.id);
    const newIds = [...(product.catalogIds ?? []), catalog.slug];
    await updateProduct(product.id, { catalogIds: newIds });
    const updated = { ...product, catalogIds: newIds };
    setCatalogProducts((prev) => [...prev, updated]);
    setAllProducts((prev) => prev.map((p) => (p.id === product.id ? updated : p)));
    setAddingId(null);
    setSearch('');
  }

  function handleNewProductAdded(product: AdminProduct) {
    setCatalogProducts((prev) => [product, ...prev]);
    setShowCreateNew(false);
  }

  return (
    <div>
      {/* Back nav */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Catálogos
        </button>
        <span className="text-gray-200">/</span>
        <span className="text-sm font-medium text-gray-700">{info.name}</span>
        <a
          href={`/catalogo/${info.slug}`}
          target="_blank"
          rel="noreferrer"
          className="ml-auto text-gray-300 hover:text-rose-400 transition-colors"
          title="Ver catálogo en el sitio"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* ── Info section ── */}
      <section className="bg-white rounded-2xl border border-rose-100 p-5 mb-6">
        <p className="text-xs font-medium text-[#b5606a] uppercase tracking-widest mb-4">Información</p>
        <div className="grid grid-cols-[120px_1fr] gap-6">
          {/* Cover image — immediate upload on pick */}
          <ImageCell
            imageUrl={info.coverImageUrl}
            onUpdate={(url) => handleUpdateInfo('coverImageUrl', url)}
          />
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-400 mb-1">Nombre</p>
                <EditableCell value={info.name} onSave={(v) => handleUpdateInfo('name', String(v))} />
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Slug</p>
                <div className="flex items-center gap-1">
                  <EditableCell value={info.slug} onSave={(v) => handleUpdateInfo('slug', String(v))} />
                  <a href={`/catalogo/${info.slug}`} target="_blank" rel="noreferrer" className="text-gray-300 hover:text-rose-400 flex-shrink-0">
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Descripción</p>
              <EditableCell value={info.description} onSave={(v) => handleUpdateInfo('description', String(v))} />
            </div>
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => handleUpdateInfo('active', !info.active)}
                className={`transition-colors ${info.active ? 'text-[#b5606a]' : 'text-gray-300'}`}
              >
                {info.active ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
              </button>
              <span className="text-xs text-gray-400">{info.active ? 'Activo — visible en el sitio' : 'Inactivo — no visible'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Products section ── */}
      <section className="bg-white rounded-2xl border border-rose-100 overflow-hidden mb-6">
        <div className="flex items-center justify-between px-5 py-4 border-b border-rose-50">
          <p className="text-xs font-medium text-[#b5606a] uppercase tracking-widest">
            Productos <span className="text-gray-400 font-normal normal-case">({catalogProducts.length})</span>
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => { setShowAddExisting((v) => !v); setShowCreateNew(false); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border transition-colors ${showAddExisting ? 'border-[#b5606a] text-[#b5606a] bg-rose-50' : 'border-gray-200 text-gray-500 hover:border-rose-200 hover:text-[#b5606a]'}`}
            >
              <Plus className="w-3 h-3" />
              Agregar existente
            </button>
            <button
              onClick={() => { setShowCreateNew((v) => !v); setShowAddExisting(false); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border transition-colors ${showCreateNew ? 'border-[#b5606a] text-[#b5606a] bg-rose-50' : 'border-gray-200 text-gray-500 hover:border-rose-200 hover:text-[#b5606a]'}`}
            >
              <Plus className="w-3 h-3" />
              Crear nuevo
            </button>
          </div>
        </div>

        {/* Products list */}
        {loading ? (
          <div className="flex justify-center py-12"><Spinner /></div>
        ) : catalogProducts.length === 0 && !showAddExisting && !showCreateNew ? (
          <div className="text-center py-12 text-gray-400 text-sm">
            <p>Este catálogo no tiene productos.</p>
            <p className="text-xs mt-1">Usa los botones de arriba para agregar o crear productos.</p>
          </div>
        ) : (
          <div>
            {catalogProducts.map((product, i) => (
              <div
                key={product.id}
                className={`flex items-center gap-4 px-5 py-3 text-sm ${i < catalogProducts.length - 1 ? 'border-b border-rose-50' : ''}`}
              >
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-rose-50 flex-shrink-0">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-rose-200">
                      <Flower2 className="w-4 h-4" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 truncate">{product.name}</p>
                  {product.description && (
                    <p className="text-xs text-gray-400 truncate">{product.description}</p>
                  )}
                </div>
                <p className="text-[#b5606a] font-medium flex-shrink-0">
                  ${product.price.toLocaleString('es-MX')}
                </p>
                <button
                  onClick={() => handleRemove(product)}
                  disabled={removingId === product.id}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-40 flex-shrink-0"
                  title="Quitar del catálogo"
                >
                  {removingId === product.id ? <Spinner sm /> : <Minus className="w-3 h-3" />}
                  <span>Quitar</span>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add existing — expandable */}
        {showAddExisting && (
          <div className="border-t border-rose-100 p-5">
            <p className="text-xs font-medium text-gray-500 mb-3 uppercase tracking-wider">Agregar producto existente</p>
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nombre…"
                className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-300"
              />
            </div>
            {availableProducts.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">
                {search ? 'Sin resultados.' : 'Todos los productos ya están en este catálogo.'}
              </p>
            ) : (
              <div className="space-y-1 max-h-72 overflow-y-auto">
                {availableProducts.map((product) => (
                  <div key={product.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-rose-50 transition-colors">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-rose-50 flex-shrink-0">
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-rose-200">
                          <Flower2 className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-700 truncate">{product.name}</p>
                    </div>
                    <p className="text-xs text-[#b5606a] flex-shrink-0">${product.price.toLocaleString('es-MX')}</p>
                    <button
                      onClick={() => handleAdd(product)}
                      disabled={addingId === product.id}
                      className="flex items-center gap-1 px-2.5 py-1.5 text-xs bg-[#b5606a] text-white rounded-lg hover:bg-[#9a4f59] transition-colors disabled:opacity-50 flex-shrink-0"
                    >
                      {addingId === product.id ? <Spinner sm /> : <Plus className="w-3 h-3" />}
                      Agregar
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Create new — expandable */}
        {showCreateNew && (
          <div className="border-t border-rose-100 p-5">
            <p className="text-xs font-medium text-gray-500 mb-4 uppercase tracking-wider">Crear nuevo producto</p>
            <CreateProductForm
              allCatalogs={allCatalogs}
              initialCatalogIds={[catalog.slug]}
              onAdd={handleNewProductAdded}
              onCancel={() => setShowCreateNew(false)}
            />
          </div>
        )}
      </section>
    </div>
  );
}

function toSlug(name: string) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

function AddCatalogForm({
  onAdd,
  onCancel,
}: {
  onAdd: (c: FirestoreCatalog) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [slugEdited, setSlugEdited] = useState(false);
  const [savingStatus, setSavingStatus] = useState<'idle' | 'uploading' | 'saving'>('idle');

  const isSaving = savingStatus !== 'idle';
  const inp = 'w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-rose-300';

  function handleNameChange(v: string) {
    setName(v);
    if (!slugEdited) setSlug(toSlug(v));
  }

  function handleFileSelect(file: File, localPreview: string) {
    setCoverImageFile(file);
    setCoverImagePreview(localPreview);
    setCoverImageUrl('');
  }

  function handleUrlChange(url: string) {
    setCoverImageUrl(url);
    setCoverImageFile(null);
    setCoverImagePreview('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !slug) return;

    let finalCoverUrl = coverImageUrl;

    try {
      if (coverImageFile) {
        setSavingStatus('uploading');
        const fd = new FormData();
        fd.append('file', coverImageFile);
        const res = await fetch('/api/upload', { method: 'POST', body: fd });
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        if (!data.url) throw new Error('No se recibió URL de la imagen.');
        finalCoverUrl = data.url;
      }

      setSavingStatus('saving');
      const newCat: Omit<FirestoreCatalog, 'id'> = {
        name, slug, description, coverImageUrl: finalCoverUrl, active: true, order: Date.now(),
      };
      const id = await addCatalog(newCat);
      onAdd({ ...newCat, id });
      setSavingStatus('idle');
    } catch (err) {
      console.error('Error al guardar catálogo:', err);
      alert(err instanceof Error ? err.message : 'Error inesperado al guardar.');
      setSavingStatus('idle');
    }
  }

  const buttonLabel =
    savingStatus === 'uploading' ? 'Subiendo imagen…' :
    savingStatus === 'saving'    ? 'Guardando…' :
                                   'Guardar';

  return (
    <form onSubmit={handleSubmit} className="bg-rose-50 rounded-xl p-4 border border-rose-100 mb-6">
      <p className="text-xs font-medium text-[#b5606a] uppercase tracking-widest mb-4">Nuevo catálogo</p>
      <div className="grid grid-cols-[160px_1fr] gap-5">
        {/* Cover image upload */}
        <div>
          <p className="text-xs text-gray-500 mb-2">Imagen de portada</p>
          <ImageUploadArea
            preview={coverImagePreview || coverImageUrl}
            urlValue={coverImageUrl}
            hasPendingFile={!!coverImageFile}
            onFile={handleFileSelect}
            onUrl={handleUrlChange}
          />
        </div>

        {/* Fields */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Nombre *</label>
              <input required className={inp} value={name} onChange={(e) => handleNameChange(e.target.value)} placeholder="Día de las Madres 2026" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Slug (URL) *</label>
              <input required className={`${inp} font-mono`} value={slug} onChange={(e) => { setSlug(e.target.value); setSlugEdited(true); }} placeholder="dia-de-las-madres-2026" />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Descripción</label>
            <input className={inp} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Arreglos florales para el día más especial" />
          </div>
          <div className="flex gap-2 pt-1">
            <button type="submit" disabled={isSaving} className="flex items-center gap-1.5 px-4 py-2 bg-[#b5606a] text-white text-sm rounded-lg hover:bg-[#9a4f59] transition-colors disabled:opacity-50">
              {isSaving ? <Spinner sm /> : <Check className="w-3.5 h-3.5" />}
              {buttonLabel}
            </button>
            <button type="button" onClick={onCancel} disabled={isSaving} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-40">
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

function CatalogsView({ onCatalogsChange }: { onCatalogsChange: (cats: FirestoreCatalog[]) => void }) {
  const [catalogs, setCatalogs] = useState<FirestoreCatalog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedCatalog, setSelectedCatalog] = useState<FirestoreCatalog | null>(null);

  function sync(cats: FirestoreCatalog[]) {
    setCatalogs(cats);
    onCatalogsChange(cats);
  }

  useEffect(() => {
    getCatalogs().then(sync).finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleUpdate(id: string, field: string, value: string | number | boolean) {
    await updateCatalog(id, { [field]: value });
    sync(catalogs.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar este catálogo? Los productos asociados no se eliminarán.')) return;
    setDeletingId(id);
    await deleteCatalog(id);
    sync(catalogs.filter((c) => c.id !== id));
    setDeletingId(null);
  }

  // ── Detail view ──
  if (selectedCatalog) {
    return (
      <CatalogDetailView
        catalog={selectedCatalog}
        allCatalogs={catalogs}
        onBack={() => setSelectedCatalog(null)}
        onCatalogUpdate={(updated) => {
          sync(catalogs.map((c) => (c.id === updated.id ? updated : c)));
          setSelectedCatalog(updated);
        }}
      />
    );
  }

  // ── List view ──
  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-gray-400">{catalogs.length} {catalogs.length === 1 ? 'catálogo' : 'catálogos'}</p>
        <button
          onClick={() => setShowAddForm((v) => !v)}
          className="flex items-center gap-1.5 px-3 py-2 text-sm bg-[#b5606a] text-white rounded-lg hover:bg-[#9a4f59] transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Agregar
        </button>
      </div>

      {showAddForm && (
        <AddCatalogForm
          onAdd={(c) => { sync([...catalogs, c]); setShowAddForm(false); }}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {loading ? (
        <div className="flex items-center justify-center py-24"><Spinner /></div>
      ) : catalogs.length === 0 ? (
        <div className="text-center py-20 text-gray-400 text-sm">
          <p>No hay catálogos registrados.</p>
          <p className="mt-1 text-xs">Crea uno para comenzar.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-rose-100 overflow-hidden">
          <div className="grid grid-cols-[1fr_1fr_2fr_64px_40px_40px] gap-4 px-4 py-3 bg-rose-50 border-b border-rose-100 text-xs font-medium text-[#b5606a] uppercase tracking-wide">
            <span>Nombre</span><span>Slug</span><span>Descripción</span><span>Activo</span><span /><span />
          </div>

          {catalogs.map((cat, i) => (
            <div
              key={cat.id}
              className={`grid grid-cols-[1fr_1fr_2fr_64px_40px_40px] gap-4 px-4 py-4 items-center text-sm ${i < catalogs.length - 1 ? 'border-b border-rose-50' : ''}`}
            >
              {/* Name — clickable to open detail */}
              <button
                onClick={() => setSelectedCatalog(cat)}
                className="font-medium text-gray-800 text-left hover:text-[#b5606a] transition-colors truncate"
              >
                {cat.name}
              </button>
              <div className="text-gray-500 font-mono text-xs flex items-center gap-1 min-w-0">
                <span className="truncate">{cat.slug}</span>
                <a href={`/catalogo/${cat.slug}`} target="_blank" rel="noreferrer" className="flex-shrink-0 text-gray-300 hover:text-rose-400 transition-colors">
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="text-gray-500 text-xs truncate">{cat.description || <span className="italic text-gray-300">Sin descripción</span>}</div>
              <div>
                <button
                  onClick={() => handleUpdate(cat.id, 'active', !cat.active)}
                  className={`transition-colors ${cat.active ? 'text-[#b5606a]' : 'text-gray-300'}`}
                >
                  {cat.active ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                </button>
              </div>
              {/* Ver detalle */}
              <div className="flex justify-center">
                <button
                  onClick={() => setSelectedCatalog(cat)}
                  className="p-1.5 text-gray-300 hover:text-[#b5606a] hover:bg-rose-50 rounded-lg transition-colors"
                  title="Ver detalle"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              {/* Delete */}
              <div className="flex justify-center">
                <button
                  onClick={() => handleDelete(cat.id)}
                  disabled={deletingId === cat.id}
                  className="p-1.5 text-gray-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Root admin page ──────────────────────────────────────────────────────────

type AdminTab = 'catalogos' | 'productos';

export default function AdminPage() {
  const { user, isAdmin, logout } = useAuth();
  const [tab, setTab] = useState<AdminTab>('catalogos');
  const [allCatalogs, setAllCatalogs] = useState<FirestoreCatalog[]>([]);

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-[#fdfaf8]">
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-rose-100 px-4 sm:px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flower2 className="w-5 h-5 text-rose-400" strokeWidth={1.5} />
          <span className="text-base tracking-wide text-gray-800">Amaranta</span>
          <span className="text-gray-300 mx-1">·</span>
          <span className="text-sm text-gray-400">Admin</span>
        </div>
        <div className="flex items-center gap-3">
          {user?.photoURL && <img src={user.photoURL} alt="" className="w-7 h-7 rounded-full" />}
          <span className="text-sm text-gray-500 hidden sm:block">{user?.displayName}</span>
          <button
            onClick={logout}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            title="Cerrar sesión"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto px-4 sm:px-8 py-8">
        {/* Primary tabs */}
        <div className="flex gap-1 mb-8 bg-white border border-rose-100 rounded-xl p-1 w-fit">
          {([['catalogos', 'Catálogos'], ['productos', 'Productos']] as const).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`px-5 py-2 text-sm rounded-lg transition-colors font-medium ${tab === id ? 'bg-[#b5606a] text-white shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === 'catalogos' ? (
          <CatalogsView onCatalogsChange={setAllCatalogs} />
        ) : (
          <ProductLibraryView allCatalogs={allCatalogs} />
        )}
      </main>
    </div>
  );
}
