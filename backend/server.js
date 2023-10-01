const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const express = require("express");
const path = require("path");
const configPath = path.join(__dirname, "..", "config", ".env");
require("dotenv").config({ path: configPath });
const errorHandler = require("./middlewares/errorHandler");
const notFound = require("./middlewares/notFound");
const asyncHandler = require("express-async-handler");
const UserModel = require("./models/userModel");
const authMiddelware = require("./middlewares/authMiddelware");

const connectDb = require("../config/connectDb");
const RoleModel = require("./models/roleModel");
require("colors");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// РЕГИСТРАЦИЯ - сохранение нового пользователя в базе
// АУТЕНТИФИКАЦИЯ - проверка, что данные которые ввел пользователь - есть в базе данных
// АВТОРИЗАЦИЯ - проверка прав доступа
// ЛОГАУТ - выход пользователя из системы (пользователь перестает быть аутентификованым)

//REGISTER
app.post(
  "/register",
  asyncHandler(async (req, res) => {
    // получаем и валидуем данные от фронтенда
    // ищем пользователя в базе
    // если нашли - выкидываем ошибку
    // если все ок - хешируем пароль
    // сохраняем с хешированным паролем
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400);
      throw new Error("Provide all fields");
    }

    const candidate = await UserModel.findOne({ email });
    if (candidate) {
      res.status(400);
      throw new Error("User already exists");
    }
    const hashPassword = bcrypt.hashSync(password, 5);
    const roles = await RoleModel.findOne({ value: "USER" });
    const user = await UserModel.create({
      ...req.body,
      password: hashPassword,
      roles: [roles.value],
    });
    res.status(201).json({ code: 201, data: { email: user.email } });
  })
);

//LOGIN
app.post(
  "/login",
  asyncHandler(async (req, res) => {
    // получаем и валидуем данные от фронтенда
    // ищем пользователя в базе и рашифровуем пароль
    // если не нашли или не расшифровали - выкидываем ошибку invalid login or password
    // если все ок - генерируем токен
    // сохраняем с токеном в базу

    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400);
      throw new Error("Provide all fields");
    }
    const user = await UserModel.findOne({ email });
    if (!user) {
      res.status(400);
      throw new Error("Invalid login or password");
    }
    const isValidPassword = bcrypt.compareSync(password, user.password);
    if (!isValidPassword) {
      res.status(400);
      throw new Error("Invalid login or password");
    }

    const token = generateToken({
      friens: ["Alex", "Dima", "Andrey"],
      id: user._id,
      roles: user.roles,
    });
    user.token = token;
    await user.save();
    res
      .status(200)
      .json({ code: 200, data: { email: user.email, token: user.token } });
  })
);

//LOGOUT
app.patch(
  "/logout",
  authMiddelware,
  asyncHandler(async (req, res) => {
    // получаем пользователя и удаляем токен
    const { id } = req.user;
    const user = await UserModel.findById(id);
    user.token = null;
    await user.save();
    res.status(200).json({ code: 200, message: "Logout success" });
  })
);

function generateToken(data) {
  const payload = { ...data };
  return jwt.sign(payload, "cat", { expiresIn: "8h" });
}

app.use("/api/v1", require("./routes/toysRoutes"));
app.use("*", notFound);
app.use(errorHandler);

const { PORT } = process.env;

connectDb();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`.green.italic.bold);
});
