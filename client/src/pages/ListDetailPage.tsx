import { useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'
import { SelectButton } from 'primereact/selectbutton'
import { Toast } from 'primereact/toast'
import { Message } from 'primereact/message'
import { Tag } from 'primereact/tag'
import { Skeleton } from 'primereact/skeleton'
import { listsApi, listKeys, type ItemResponse } from '../api/lists.api'
import { itemsApi, type CreateItemDto } from '../api/items.api'
import { useAuth } from '../context/AuthContext'

const PRIORITY_OPTIONS = [
  { label: 'Low', value: 1 },
  { label: 'Medium', value: 2 },
  { label: 'High', value: 3 },
]

const PRIORITY_SEVERITY = {
  1: 'secondary',
  2: 'warning',
  3: 'danger',
} as const

const PRIORITY_LABEL = { 1: 'Low', 2: 'Medium', 3: 'High' } as const

function ItemCard({
  item,
  isOwner,
  onDelete,
  isDeleting,
}: {
  item: ItemResponse
  isOwner: boolean
  onDelete: (item: ItemResponse) => void
  isDeleting: boolean
}) {
  return (
    <Card className="h-full">
      <div className="flex flex-column gap-3 h-full">
        {item.imageUrl && (
          <div style={{ height: '160px', overflow: 'hidden', borderRadius: '6px' }}>
            <img
              src={item.imageUrl}
              alt={item.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
          </div>
        )}

        <div className="flex flex-column gap-1 flex-1">
          <div className="flex align-items-start justify-content-between gap-2">
            <h3 className="text-base font-semibold m-0 flex-1" style={{ wordBreak: 'break-word' }}>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-color no-underline hover:underline"
              >
                {item.title}
              </a>
            </h3>
            {isOwner && (
              <Button
                icon="pi pi-trash"
                text
                rounded
                size="small"
                severity="danger"
                onClick={() => onDelete(item)}
                loading={isDeleting}
                tooltip="Remove"
                tooltipOptions={{ position: 'top' }}
              />
            )}
          </div>

          {item.description && (
            <p className="text-color-secondary text-sm m-0 line-clamp-2" style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>
              {item.description}
            </p>
          )}
        </div>

        <div className="flex align-items-center justify-content-between gap-2 mt-auto pt-2 border-top-1 surface-border">
          <div className="flex align-items-center gap-2">
            {item.price && (
              <span className="font-semibold text-primary">{item.price}</span>
            )}
            <Tag
              value={PRIORITY_LABEL[item.priority]}
              severity={PRIORITY_SEVERITY[item.priority]}
            />
          </div>
          {item.claim && (
            <Tag value={`Claimed by ${item.claim.claimedByName}`} severity="success" icon="pi pi-check" />
          )}
        </div>

        {item.note && (
          <p className="text-color-secondary text-sm m-0 font-italic">
            <i className="pi pi-comment mr-1" />
            {item.note}
          </p>
        )}
      </div>
    </Card>
  )
}

export default function ListDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const toast = useRef<Toast>(null)

  const [showAdd, setShowAdd] = useState(false)
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [priority, setPriority] = useState<1 | 2 | 3>(1)
  const [note, setNote] = useState('')
  const [urlError, setUrlError] = useState('')
  const [isScraping, setIsScraping] = useState(false)

  const { data: list, isLoading, error } = useQuery({
    queryKey: listKeys.detail(id!),
    queryFn: () => listsApi.getById(id!),
    enabled: !!id,
  })

  const addItemMutation = useMutation({
    mutationFn: (dto: CreateItemDto) => itemsApi.create(id!, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: listKeys.detail(id!) })
      toast.current?.show({ severity: 'success', summary: 'Item added' })
      closeAdd()
    },
    onError: (err: Error) => {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: err.message })
    },
  })

  const deleteItemMutation = useMutation({
    mutationFn: (itemId: string) => itemsApi.remove(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: listKeys.detail(id!) })
      toast.current?.show({ severity: 'success', summary: 'Item removed' })
    },
    onError: (err: Error) => {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: err.message })
    },
  })

  function openAdd() {
    setUrl('')
    setTitle('')
    setDescription('')
    setPrice('')
    setPriority(1)
    setNote('')
    setUrlError('')
    setShowAdd(true)
  }

  function closeAdd() {
    setShowAdd(false)
  }

  async function handleUrlBlur() {
    if (!url.trim() || title) return
    setIsScraping(true)
    try {
      const data = await itemsApi.scrapeOg(url.trim())
      if (data.title) setTitle(data.title)
      if (data.description && !description) setDescription(data.description)
      if (data.price && !price) setPrice(data.price)
    } catch {
      // scrape failure is non-fatal
    } finally {
      setIsScraping(false)
    }
  }

  function handleAddItem() {
    if (!url.trim()) {
      setUrlError('URL is required')
      return
    }
    setUrlError('')
    addItemMutation.mutate({
      url: url.trim(),
      title: title.trim() || undefined,
      description: description.trim() || undefined,
      price: price.trim() || undefined,
      priority,
      note: note.trim() || undefined,
    })
  }

  function handleDeleteItem(item: ItemResponse) {
    confirmDialog({
      message: `Remove "${item.title}"?`,
      header: 'Remove Item',
      icon: 'pi pi-trash',
      acceptClassName: 'p-button-danger',
      accept: () => deleteItemMutation.mutate(item.id),
    })
  }

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="flex align-items-center gap-3 mb-4">
          <Skeleton width="2rem" height="2rem" />
          <Skeleton width="200px" height="2rem" />
        </div>
        <div className="grid">
          {[1, 2, 3].map((n) => (
            <div key={n} className="col-12 md:col-6 lg:col-4">
              <Skeleton height="220px" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4">
        <Message severity="error" text={(error as Error).message} />
      </div>
    )
  }

  if (!list) return null

  const isOwner = user?.id === list.owner.id

  return (
    <div className="p-4">
      <Toast ref={toast} />
      <ConfirmDialog />

      {/* Header */}
      <div className="flex align-items-start justify-content-between gap-3 mb-4">
        <div className="flex align-items-center gap-2">
          <Button
            icon="pi pi-arrow-left"
            text
            rounded
            onClick={() => navigate('/lists')}
            tooltip="Back to lists"
          />
          <div>
            <h1 className="text-3xl font-bold m-0">{list.name}</h1>
            <div className="flex align-items-center gap-2 mt-1">
              <span className="text-color-secondary text-sm">
                by {list.owner.displayName}
              </span>
              <Tag
                value={list.visibility === 'FRIENDS' ? 'Friends' : 'Private'}
                icon={`pi ${list.visibility === 'FRIENDS' ? 'pi-users' : 'pi-lock'}`}
                severity="secondary"
              />
            </div>
            {list.description && (
              <p className="text-color-secondary text-sm m-0 mt-1">{list.description}</p>
            )}
          </div>
        </div>

        {isOwner && (
          <div className="flex gap-2 flex-shrink-0">
            <Button
              label="Edit"
              icon="pi pi-pencil"
              outlined
              size="small"
              onClick={() => navigate(`/lists/${id}/edit`)}
            />
            <Button
              label="Add Item"
              icon="pi pi-plus"
              size="small"
              onClick={openAdd}
            />
          </div>
        )}
      </div>

      {/* Items grid */}
      {list.items.length === 0 && (
        <div className="text-center py-8">
          <i className="pi pi-shopping-bag text-5xl text-color-secondary mb-3" style={{ display: 'block' }} />
          <p className="text-color-secondary text-xl m-0 mb-3">
            {isOwner ? 'No items yet — add your first gift idea!' : 'This list has no items yet.'}
          </p>
          {isOwner && (
            <Button label="Add Item" icon="pi pi-plus" onClick={openAdd} />
          )}
        </div>
      )}

      <div className="grid">
        {list.items.map((item) => (
          <div key={item.id} className="col-12 md:col-6 lg:col-4">
            <ItemCard
              item={item}
              isOwner={isOwner}
              onDelete={handleDeleteItem}
              isDeleting={deleteItemMutation.isPending && deleteItemMutation.variables === item.id}
            />
          </div>
        ))}
      </div>

      {/* Add item dialog */}
      <Dialog
        header="Add Item"
        visible={showAdd}
        onHide={closeAdd}
        style={{ width: '500px' }}
        modal
      >
        <div className="flex flex-column gap-4 pt-2">
          <div className="flex flex-column gap-1">
            <label htmlFor="item-url" className="font-medium">
              URL <span className="text-red-500">*</span>
            </label>
            <div className="p-inputgroup">
              <InputText
                id="item-url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onBlur={handleUrlBlur}
                className={urlError ? 'p-invalid' : ''}
                placeholder="https://example.com/product"
                autoFocus
              />
              {isScraping && (
                <span className="p-inputgroup-addon">
                  <i className="pi pi-spin pi-spinner" />
                </span>
              )}
            </div>
            {urlError && <small className="p-error">{urlError}</small>}
            {!urlError && (
              <small className="text-color-secondary">
                Paste a URL — title and image are scraped automatically
              </small>
            )}
          </div>

          <div className="flex flex-column gap-1">
            <label htmlFor="item-title" className="font-medium">Title</label>
            <InputText
              id="item-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Auto-filled from URL"
              maxLength={200}
            />
          </div>

          <div className="flex gap-3">
            <div className="flex flex-column gap-1 flex-1">
              <label htmlFor="item-price" className="font-medium">Price</label>
              <InputText
                id="item-price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. $29.99"
                maxLength={50}
              />
            </div>
            <div className="flex flex-column gap-1">
              <label className="font-medium">Priority</label>
              <SelectButton
                value={priority}
                onChange={(e) => setPriority(e.value)}
                options={PRIORITY_OPTIONS}
                optionLabel="label"
                optionValue="value"
              />
            </div>
          </div>

          <div className="flex flex-column gap-1">
            <label htmlFor="item-desc" className="font-medium">Description</label>
            <InputTextarea
              id="item-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              autoResize
              maxLength={500}
            />
          </div>

          <div className="flex flex-column gap-1">
            <label htmlFor="item-note" className="font-medium">Personal note</label>
            <InputText
              id="item-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Optional note for yourself"
              maxLength={200}
            />
          </div>

          <div className="flex justify-content-end gap-2 pt-2">
            <Button label="Cancel" outlined onClick={closeAdd} />
            <Button
              label="Add Item"
              icon="pi pi-plus"
              onClick={handleAddItem}
              loading={addItemMutation.isPending}
            />
          </div>
        </div>
      </Dialog>
    </div>
  )
}
