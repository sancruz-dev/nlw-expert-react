import * as Dialog from "@radix-ui/react-dialog";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { X } from "lucide-react";
import { ChangeEvent, useState } from "react";

interface NoteCardProps {
  note: {
    id: string;
    date: Date;
    content: string;
  };
  onNoteDeleted: (id: string) => void;
  onNoteUpdated: (id: string, content: string) => void;
}


export function NoteCard({ note, onNoteDeleted, onNoteUpdated }: NoteCardProps) {
  
  const [editableContent, setEditableContent] = useState(note.content)
  const [isEditing, setIsEditing] = useState(false)
  const [shouldShowDialog, setShouldShowDialog] = useState(false)

  function handleEditableContet(event: ChangeEvent<HTMLTextAreaElement>) {
    setEditableContent(event.target.value)

    note.content !== event.target.value ? setIsEditing(true) : setIsEditing(false)
  }

  function contentReset() {
    setEditableContent(note.content)
    setIsEditing(false)
    setShouldShowDialog(false)
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger onClick={() => setShouldShowDialog(true)} className="rounded-md text-left bg-slate-800 flex flex-col p-5 gap-3 overflow-hidden relative hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400 outline-none">
        <span className="text-sm font-medium text-slate-300">
          {formatDistanceToNow(note.date, {
            locale: ptBR,
            addSuffix: true,
          })}
        </span>

        <p className="text-sm leading-6 text-slate-400">{note.content}</p>

        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 to-black/0 pointer-events-none" />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className={`${shouldShowDialog ? '' : 'hidden'} inset-0 fixed bg-black/50`} />
        <Dialog.Content className={`${shouldShowDialog ? '' : 'hidden'} fixed overflow-hidden inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full md:h-[60vh] bg-slate-700 md:rounded-md flex flex-col outline-none`}>
          <Dialog.Close onClick={contentReset} className="absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100">
            <X className="size-5" />
          </Dialog.Close>

          <div className="flex flex-1 flex-col gap-3 p-5">
            <span className="text-sm font-medium text-slate-300">
              {formatDistanceToNow(note.date, {
                locale: ptBR,
                addSuffix: true,
              })}
            </span>

            <textarea 
              onChange={handleEditableContet}
              value={editableContent}
              className="text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none"
            />
          </div>
          
          <footer className="w-full">
            <button
              type="button"
              onClick={() => onNoteDeleted(note.id)}
              className={`${isEditing ? 'w-1/2' : 'w-full'} bg-slate-800 py-4 text-center text-sm text-slate-300 outline-none font-medium group`}
            >
              Deseja{" "}
              <span className="text-red-400 group-hover:underline">
                apagar essa nota
              </span>
              ?
            </button>
            <button
              type="button"
              onClick={() => {onNoteUpdated(note.id, editableContent), contentReset()}}
              className={`${isEditing ? 'w-1/2' : 'hidden'} bg-green-600 py-4 text-center text-sm text-slate-300 outline-none font-medium group`}
            >
              Atualizar nota
            </button>
          </footer>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
