import { Note } from '../models/note.js';
import createHttpError from 'http-errors';

export const getAllNotes = async (req, res) => {
  const { page, perPage, tag, search } = req.query;

  const limit = Math.max(1, parseInt(perPage));
  const skip = (Math.max(1, parseInt(page)) - 1) * limit;

  const notesQuery = Note.find().skip(skip).limit(limit);
  const countQuery = Note.countDocuments();

  if (tag) {
    notesQuery.where('tag').equals(tag);
    countQuery.where('tag').equals(tag);
  }

  if (search) {
    notesQuery.where('$text').equals({ $search: search });
    countQuery.where('$text').equals({ $search: search });
  }

  const [totalNotes, notes] = await Promise.all([
    countQuery.exec(),
    notesQuery.exec(),
  ]);

  const totalPages = Math.ceil(totalNotes / limit) || 1;

  res.status(200).json({
    page: Number(page),
    perPage: Number(perPage),
    totalNotes,
    totalPages,
    notes,
  });
};

export const getNoteById = async (req, res, next) => {
  const { noteId } = req.params;
  const note = await Note.findById(noteId);

  if (!note) {
    next(createHttpError(404, 'Note not found'));
    return;
  }

  res.status(200).json(note);
};

export const createNote = async (req, res) => {
  const note = await Note.create(req.body);
  res.status(201).json(note);
};

export const deleteNote = async (req, res, next) => {
  const { noteId } = req.params;
  const note = await Note.findOneAndDelete({ _id: noteId });

  if (!note) {
    next(createHttpError(404, 'Note not found'));
    return;
  }

  res.status(200).json(note);
};

export const updateNote = async (req, res, next) => {
  const { noteId } = req.params;
  const note = await Note.findOneAndUpdate({ _id: noteId }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!note) {
    next(createHttpError(404, 'Note not found'));
    return;
  }

  res.status(200).json(note);
};
