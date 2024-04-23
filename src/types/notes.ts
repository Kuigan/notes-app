export class Note {
  id: number;
  title: string;
  content: string;
  user: string;

  constructor(id: number, title: string, content: string, user: string) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.user = user;
  }
}

/**
 * Represents the raw structure of notes data, containing an array of notes.
 */

export type NotesRaw = {
  notes: Note[]
}