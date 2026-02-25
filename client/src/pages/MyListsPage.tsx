import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'
import { SelectButton } from 'primereact/selectbutton'
import { Toast } from 'primereact/toast'
import { ProgressSpinner } from 'primereact/progressspinner'
import { Message } from 'primereact/message'
import { listsApi, listKeys, type CreateListDto, type ListResponse } from '../api/lists.api'

const VISIBILITY_OPTIONS = [
  { label: 'Private', value: 'PRIVATE' },
  { label: 'Friends', value: 'FRIENDS' },
]

export default function MyListsPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const toast = useRef<Toast>(null)

  const [showCreate, setShowCreate] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [visibility, setVisibility] = useState<'PRIVATE' | 'FRIENDS'>('PRIVATE')
  const [nameError, setNameError] = useState('')

  const { data: lists, isLoading, error } = useQuery({
    queryKey: listKeys.all(),
    queryFn: listsApi.getAll,
  })

  const createMutation = useMutation({
    mutationFn: (dto: CreateListDto) => listsApi.create(dto),
    onSuccess: (list: ListResponse) => {
      queryClient.invalidateQueries({ queryKey: listKeys.all() })
      toast.current?.show({ severity: 'success', summary: 'List created', detail: list.name })
      closeDialog()
    },
    onError: (err: Error) => {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: err.message })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: listsApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: listKeys.all() })
      toast.current?.show({ severity: 'success', summary: 'List deleted' })
    },
    onError: (err: Error) => {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: err.message })
    },
  })

  function openCreate() {
    setName('')
    setDescription('')
    setVisibility('PRIVATE')
    setNameError('')
    setShowCreate(true)
  }

  function closeDialog() {
    setShowCreate(false)
  }

  function handleCreate() {
    if (!name.trim()) {
      setNameError('List name is required')
      return
    }
    setNameError('')
    createMutation.mutate({
      name: name.trim(),
      description: description.trim() || undefined,
      visibility,
    })
  }

  function handleDelete(list: ListResponse) {
    confirmDialog({
      message: `Delete "${list.name}"? This cannot be undone.`,
      header: 'Delete List',
      icon: 'pi pi-trash',
      acceptClassName: 'p-button-danger',
      accept: () => deleteMutation.mutate(list.id),
    })
  }

  if (isLoading) {
    return (
      <div className="flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <ProgressSpinner />
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

  return (
    <div className="p-4">
      <Toast ref={toast} />
      <ConfirmDialog />

      <div className="flex align-items-center justify-content-between mb-4">
        <h1 className="text-3xl font-bold m-0">My Lists</h1>
        <Button label="New List" icon="pi pi-plus" onClick={openCreate} />
      </div>

      {lists && lists.length === 0 && (
        <div className="text-center py-8">
          <i className="pi pi-gift text-5xl text-color-secondary mb-3" style={{ display: 'block' }} />
          <p className="text-color-secondary text-xl m-0 mb-3">No lists yet</p>
          <Button label="Create your first list" icon="pi pi-plus" onClick={openCreate} />
        </div>
      )}

      <div className="grid">
        {lists?.map((list) => (
          <div key={list.id} className="col-12 md:col-6 lg:col-4">
            <Card
              className="h-full cursor-pointer"
              onClick={() => navigate(`/lists/${list.id}`)}
            >
              <div className="flex flex-column h-full gap-2">
                <div className="flex align-items-start justify-content-between gap-2">
                  <h2 className="text-xl font-semibold m-0 flex-1" style={{ wordBreak: 'break-word' }}>
                    {list.name}
                  </h2>
                  <div className="flex gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                    <Button
                      icon="pi pi-pencil"
                      text
                      rounded
                      size="small"
                      onClick={() => navigate(`/lists/${list.id}/edit`)}
                      tooltip="Edit"
                      tooltipOptions={{ position: 'top' }}
                    />
                    <Button
                      icon="pi pi-trash"
                      text
                      rounded
                      size="small"
                      severity="danger"
                      onClick={() => handleDelete(list)}
                      tooltip="Delete"
                      tooltipOptions={{ position: 'top' }}
                      loading={deleteMutation.isPending && deleteMutation.variables === list.id}
                    />
                  </div>
                </div>

                {list.description && (
                  <p className="text-color-secondary text-sm m-0" style={{ wordBreak: 'break-word' }}>
                    {list.description}
                  </p>
                )}

                <div className="flex align-items-center gap-3 mt-auto pt-3 border-top-1 surface-border">
                  <span className="text-sm text-color-secondary">
                    <i className="pi pi-gift mr-1" />
                    {list.itemCount} {list.itemCount === 1 ? 'item' : 'items'}
                  </span>
                  <span className="text-sm text-color-secondary ml-auto">
                    <i className={`pi ${list.visibility === 'FRIENDS' ? 'pi-users' : 'pi-lock'} mr-1`} />
                    {list.visibility === 'FRIENDS' ? 'Friends' : 'Private'}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>

      <Dialog
        header="New List"
        visible={showCreate}
        onHide={closeDialog}
        style={{ width: '440px' }}
        modal
      >
        <div className="flex flex-column gap-4 pt-2">
          <div className="flex flex-column gap-1">
            <label htmlFor="list-name" className="font-medium">
              Name <span className="text-red-500">*</span>
            </label>
            <InputText
              id="list-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={nameError ? 'p-invalid' : ''}
              autoFocus
              maxLength={100}
            />
            {nameError && <small className="p-error">{nameError}</small>}
          </div>

          <div className="flex flex-column gap-1">
            <label htmlFor="list-desc" className="font-medium">Description</label>
            <InputTextarea
              id="list-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              autoResize
              maxLength={500}
            />
          </div>

          <div className="flex flex-column gap-1">
            <label className="font-medium">Visibility</label>
            <SelectButton
              value={visibility}
              onChange={(e) => setVisibility(e.value)}
              options={VISIBILITY_OPTIONS}
              optionLabel="label"
              optionValue="value"
            />
          </div>

          <div className="flex justify-content-end gap-2 pt-2">
            <Button label="Cancel" outlined onClick={closeDialog} />
            <Button
              label="Create"
              icon="pi pi-plus"
              onClick={handleCreate}
              loading={createMutation.isPending}
            />
          </div>
        </div>
      </Dialog>
    </div>
  )
}
