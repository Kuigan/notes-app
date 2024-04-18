import * as fs from 'node:fs'
import { Note } from '../types/notes'

type NotesRaw = {
  notes: Note[]
}

export function getNotes(): Note[] {
  const notesRaw = fs.readFileSync('data/notes.json', 'utf8')
  const notizen = JSON.parse(notesRaw) as NotesRaw
  const array = notizen.notes
  return array
}

export function getNoteById(id: number): Note | undefined {
  // Liste von Notizen
  const notes = getNotes() 
  // nur die Notiz finden, die die verlangte ID hat
  const note = notes.find(note => note.id === id)
  return note
}

export function writeNotesToFile(oldNotes: Note[]): void { 
  const newNotes: NotesRaw = { notes: oldNotes }
  fs.writeFileSync('data/notes.json', JSON.stringify(newNotes))
}

// Void, wenn kein Rückgabewert erwartet wird

export function addNote(title: string, content: string, user: string): void {
  // 2.1 alte Daten abfragen
  const oldNotes = getNotes()
  const id = oldNotes.length + 1 // keine saubere Lösung, aber reicht aus

  // 2.2 neue Notiz erstellen
  const newNote: Note = new Note(id, title, content, user)

  oldNotes.push(newNote)

  // 2.3 neue Notiz in Datei hinzufügen

  writeNotesToFile(oldNotes)
}