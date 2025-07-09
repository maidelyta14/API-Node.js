import express from 'express';
import fs from "fs";
import bodyParser from 'body-parser';


const app = express();
const PORT = 3000;

app.use(bodyParser.json());

const readData = () => {
    try {
        const data = fs.readFileSync("./db.json");
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading data:", error);
    }
};

const writeData = (data) => {
    try {
        fs.writeFileSync("./db.json", JSON.stringify(data));
    } catch (error) {
        console.error("Error writing data:", error);
    }
};

//Este es el primer endpoint GET que traerá todos los libros
app.get("/books", (req, res) => {
    const data = readData();
    res.json(data.books);
});

//Este es el segundo endpoint GET que traerá un libro en específico por el id, que se esta pasando como parámetro en la URL
app.get("/books/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const book = data.books.find((book) => book.id === id);
    res.json(book);
});

//Este es el tercer endpoint POST que creará un libro nuevo, el cual se recibe en el body de la petición

app.post("/books", (req, res) => {
    const data = readData();
    const body = req.body;
    const newBook = {
        id: data.books.length + 1,
        ...body,
    };
    data.books.push(newBook);
    writeData(data);
    res.json(newBook);
});

//Este es el cuarto endpoint PUT que actualizará un libro existente,
// el cual se recibe en el body de la petición y se identifica por el id en la URL

app.put("/books/:id", (req, res) => {
    const data = readData();
    const body = req.body;
    const id = parseInt(req.params.id);
    const bookIndex = data.books.findIndex((book) => book.id === id);
    data.books[bookIndex] = {
        ...data.books[bookIndex],
        ...body,
    };
    writeData(data);
    res.json({ message: "Book actualizado correctamente" });
});

//Este es el quinto endpoint DELETE que eliminará un libro existente,
//  el cual se identifica por el id en la URL

app.delete("/books/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const bookIndex = data.books.findIndex((book) => book.id === id);
    data.books.splice(bookIndex, 1);
    writeData(data);
    res.json({ message: "Book eliminado correctamente" });
});

app.get('/', (req, res) => {
  res.send('Hola Mundo, !');
});


//Esta funcion inicia el servidor en el puerto 3000 y muestra un mensaje en la consola
app.listen(PORT, () => {
    console.log(`El servidor esta corriendo en: http://localhost:3000/books`);
});
