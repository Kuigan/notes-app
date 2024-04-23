import { Request, Response, Router } from 'express'
import { getNotes, getNoteById, addNote, updateNote, deleteNoteById } from '../services/data'
import { Note } from '../types/notes'
import { hasAuthentication } from '../middleware/auth'


export const notesRouter = Router()


/**
 * @route POST /notes - Endpoint to add a new note.
 * @middleware hasAuthentication - The method reqires autherntification.
 * @description Creates neu note with the given title, content, and user from the requested body.
 * @param {Request} req - The request object containing title, content, and user.
 * @param {Responce} res - The responce object.
 * @returns {void} - Responds with a HTTP 204 No Content status upon successful addition of the note.
 */

notesRouter.post('/', hasAuthentication, (req: Request, res: Response) => {

  const title: string = req.body.title
  const content: string = req.body.content
  const user: string = req.body.user

  addNote(title, content, user)

  res.status(204).send()
})


/**
 * @route GET /notes - Endpoint to retrieve notes associated with the authenticated user.
 * @middleware hasAuthentication - Requires authentication for access.
 * @description Retrieves notes belonging to the authenticated user based on the provided authorization token.
 * @param {Request} req - The request object containing the authorization header.
 * @param {Responce} res - The responce object.
 * @returns {void} - Responds with a HTTP 200 OK status and an array of notes belonging to the user.
 */


notesRouter.get('/', hasAuthentication, (req: Request, res: Response) => {
  const user = req.headers.authorization!

  const notes: Note[] = getNotes().filter(note => note.user === user)

  res.status(200).send(notes)
})


/**
 * @route GET /notes/:id - Endpoint to retrieve a note by ID.
 * @middleware hasAuthentication - Requires authentication for access.
 * @description Retrieves a note with the specified ID from the list of notes.
 * @param {Request} req - The request object containing the note ID in the route parameters.
 * @param {Responce} res - The responce object.
 * @returns {void} - Responds with an HTTP 200 OK status and the requested note if found,
 * or an HTTP 404 Not Found status with an error message if the note is not found.
 */

notesRouter.get('/:id', hasAuthentication, (req: Request, res: Response) => {

  const id: number = parseInt(req.params.id)
  const note: Note | undefined = getNoteById(id)

  if (note === undefined) {
    res.status(404).send(`Die Notiz mit ID ${id} wurde nicht gefunden.`)
  } else {
    res.status(200).send(note)
  }
})

/**
 * @route PUT /notes/:id - Endpoint to update a note by ID.
 * @middleware hasAuthentication - Requires authentication for access.
 * @description Updates a note with the specified ID, replacing its title, content, and user.
 * @param {Request} req - The request object containing the updated note details in the request body 
 * and the note ID in the route parameters.
 * @param {Response} res - The response object.
 * @returns {void} Responds with an HTTP 204 No Content status upon successful update of the note,
 * or an HTTP 404 Not Found status with an error message if the note is not found.
 */

notesRouter.put('/:id', hasAuthentication, (req: Request, res: Response) => { 

  const title: string = req.body.title
  const content: string = req.body.content
  const user: string = req.body.user
  const id: number = parseInt(req.params.id)
  const oldNote: Note | undefined = getNoteById(id)

  if (oldNote === undefined) {
    res.status(404).send(`Die Notiz mit ID ${id} wurde nicht gefunden.`)
    return
  }

  updateNote(id, title, content, user)

  res.status(204).send()
})

/**
 * @route PATCH /notes/:id - Endpoint to partially update a note by ID.
 * @middleware hasAuthentication - Requires authentication for access.
 * @description Partially updates a note with the specified ID, allowing modifications to its title, content, or user.
 * @param {Request} req - The request object containing the updated note details in the request body 
 * and the note ID in the route parameters.
 * @param {Response} res - The response object.
 * @returns {void} Responds with an HTTP 204 No Content status upon successful partial update of the note,
 * or an HTTP 404 Not Found status with an error message if the note is not found.
 */


notesRouter.patch('/:id', hasAuthentication, (req: Request, res: Response) => {

  const id: number = parseInt(req.params.id)
  const oldNote: Note | undefined = getNoteById(id)

  if (oldNote === undefined) {
    res.status(404).send(`Die Notiz mit ID ${id} wurde nicht gefunden.`)
    return
  }

  const title: string = req.body.title ?? oldNote.title
  const content: string = req.body.content ?? oldNote.content
  const user: string = req.body.user ?? oldNote.user

  updateNote(id, title, content, user)

  res.status(204).send()
 })

/**
 * @route DELETE /notes/:id - Endpoint to delete a note by ID.
 * @middleware hasAuthentication - Requires authentication for access.
 * @description Deletes a note with the specified ID from the list of notes.
 * @param {Request} req - The request object containing the note ID in the route parameters.
 * @param {Response} res - The response object.
 * @returns {void} Responds with an HTTP 204 No Content status upon successful deletion of the note,
 * or an HTTP 404 Not Found status with an error message if the note is not found.
 */


notesRouter.delete('/:id', hasAuthentication, (req: Request, res: Response) => { 

  const id: number = parseInt(req.params.id)
  const oldNote: Note | undefined = getNoteById(id)

  if (oldNote === undefined) {
    res.status(404).send(`Die Notiz mit ID ${id} wurde nicht gefunden.`)
    return
  }

  deleteNoteById(id)

  res.status(204).send()
})