const bcrypt = require('bcryptjs');

const users = [
  { id: 1, password: 'Ricardo123!' },
  { id: 2, password: 'Patricia123!' },
  { id: 3, password: 'Marcos123!' },
  { id: 4, password: 'Elena123!' },
  { id: 5, password: 'Carlos123!' },
  { id: 6, password: 'Laura123!' },
  { id: 7, password: 'Andres123!' },
  { id: 8, password: 'Sofia123!' },
  { id: 9, password: 'Diego123!' },
  { id: 10, password: 'Valentina123!' },
];

(async () => {
  for (const u of users) {
    const hash = await bcrypt.hash(u.password, 12);
    console.log(`UPDATE usuarios SET password = '${hash}' WHERE id = ${u.id};`);
  }
})();