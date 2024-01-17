const { nanoid } = require("nanoid");
const notes = require("./notes");

const addNoteHandler = (request, h) => {
  const { title, tags, body } = request.payload; //request payload untuk mendapatkan body request di hapi, Client mengirim data catatan (title, tags, dan body) yang akan disimpan dalam bentuk JSON melalui body request.
  const id = nanoid(16); //nanoid === library untuk menghandler id yang bersifat unik
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  const newNote = {
    title,
    tags,
    body,
    id,
    createdAt,
    updatedAt,
  };

  notes.push(newNote);

  const isSuccess = notes.filter((note) => note.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      error: "false",
      status: "success",
      message: "Catatan berhasil ditambahkan",
      data: {
        noteId: id,
      },
    });

    response.code(201);
    return response;
  }

  const response = h.response({
    error: false,
    status: "fail",
    message: "Catatan gagal ditambahkan",
  });
  response.code(500);
  return response;
};

module.exports = { addNoteHandler }; //objek literals bertujuan untuk memudahkan ekspor lebih dari satu nilai pada satu berkas JavaScript.

//Handler Get Menyimpan catatan
const getAllNotesHandler = () => ({
  status: "success",
  data: {
    notes,
  },
});

//Handler Get berdasarkan ID
const getNoteByIdHandler = (request, h) => {
  const { id } = request.params;
  const note = notes.filter((n) => n.id === id)[0];

  if (note !== undefined) {
    return {
      status: "success",
      data: {
        note,
      },
    };
  }

  const response = h.response({
    status: "fail",
    message: "Catatan tidak ditemukan",
  });
  response.code(404);
  return response;
};

//Edit editNoteByIdHandler
const editNoteByIdHandler = (request, h) => {
  //dapatkan dulu nilai id yang dikirim melalui path parameters.
  const { id } = request.params;

  //dapatkan data notes terbaru yang dikirimkan oleh client melalui body request. kode dibawah
  const { title, tags, body } = request.payload;

  // perbarui juga nilai dari properti updatedAt
  const updatedAt = new Date().toISOString;

  //untuk edit sesuaikan dengan index menggunakan array
  const index = notes.findIndex((note) => note.id === id);

  //menentukan gagal atau tidaknya permintaan dari nilai index menggunakan if else
  if (index !== -1) {
    notes[index] = {
      ...notes[index],
      title,
      tags,
      body,
      updatedAt,
    };

    const response = h.response({
      status: "success",
      message: "Catatan berhasil diperbarui",
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: "fail",
    message: "Gagal memperbarui catatan, Id tidak ditemukan",
  });
  response.code(404);
  return response;
};

//DELETE menghapus isi catatan
const deleteNoteByIdHandler = (request, h) => {
  //dapatkan dulu nilai id yang dikirim melalui path parameters.
  const { id } = request.params;

  //untuk hapus sesuaikan dengan index menggunakan array
  const index = notes.findIndex((note) => note.id === id);

  if (index !== -1) {
    notes.splice(index, 1);
    const response = h.response({
      status: "success",
      message: "Catatan berhasil dihapus",
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: "fail",
    message: "Catatan gagal dihapus. Id tidak ditemukan",
  });
  response.code(404);
  return response;
};

module.exports = {
  addNoteHandler,
  getAllNotesHandler,
  getNoteByIdHandler,
  editNoteByIdHandler,
  deleteNoteByIdHandler,
};
