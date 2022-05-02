import pool from "../db.js";
import bcrypt from "bcrypt";
import { jwtTokens } from "../utils/jwt-helpers.js";
import { RegisterValidation } from "../utils/joiSchemas.js";
import { success, error } from "../utils/responseFormat.js";
import { cloudinary } from "../utils/upload.js";

export default {
  async allUsers(req, res) {
    try {
      const users = await pool.query(
        "SELECT userid,profile_img, firstName, lastName, email,address,bio,occupation,expertise, role FROM users"
      );
      res.status(200).json(success("", users.rows, res.statusCode));
    } catch (err) {
      res.status(500).json(error(err.message, res.statusCode));
    }
  },

  async createUser(req, res) {
    try {
      const { error: err, value } = RegisterValidation(req.body);

      if (err) {
        return res.status(400).json(error(err.details[0].message, 400));
      } else {
        const hashedPassword = await bcrypt.hash(value.password, 10);
        console.log(req.file)
        // const imageResult = await cloudinary.uploader.upload(req.file.path, {
        //   public_id: req.file.originalname,
        //   width: 500,
        //   height: 500,
        //   crop: "limit",
        // });

        const profileImage = req.file.path;
        // console.log(imageResult)

        const lowerCaseEmail = value.email.toLowerCase();
        const { firstname, lastname, address, bio, occupation, expertise } =
          value;

        const newUser = await pool.query(
          "INSERT INTO users (profile_img, firstname, lastname, email,password,address,bio,occupation,expertise) VALUES ($1, $2,$3,$4,$5,$6,$7,$8, $9) RETURNING *",
          [
            profileImage,
            firstname,
            lastname,
            lowerCaseEmail,
            hashedPassword,
            address,
            bio,
            occupation,
            expertise,
          ]
        );

        let tokens = jwtTokens(newUser.rows[0]);
        res.cookie("refresh_token", tokens.refreshToken, { httpOnly: true });
        res
          .status(201)
          .json(success("User Created Successfully", tokens, res.statusCode));
      }
    } catch (e) {
      res.status(500).json(error(e.message, 500));
    }
  },

  async getUserById(req, res) {
    try {
      const id = req.params.userid;
      const user = await pool.query(
        "Select userid, profile_img, firstname, lastname, email,address,bio,occupation,expertise,role From users WHERE userid = $1",
        [id]
      );
      if (user.rows[0] == null) {
        res.status(404).json(error("user not found", res.statusCode));
      }
      res.status(200).json(success("", user.rows[0], res.statusCode));
    } catch (err) {
      res.status(500).json(error(err.message, res.statusCode));
    }
  },

  async upgradeUserById(req, res) {
    try {
      const id = req.params.userid;
      const user = await pool.query("Select * From users WHERE userid = $1", [
        id,
      ]);
      if (!user.rows[0]) {
        res.status(404).json(error("user does not exist", res.statusCode));
      } else {
        const currentUser = user.rows[0];

        const {
          profileImage,
          firstname,
          lastname,
          email,
          password,
          address,
          bio,
          occupation,
          expertise,
        } = currentUser;
        const newRole = "mentor";
        const newMentor = await pool.query(
          "INSERT INTO mentors ( profile_img, firstname, lastname, email,password,address,bio,occupation,expertise,role) VALUES ($1, $2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *",
          [
            profileImage,
            firstname,
            lastname,
            email,
            password,
            address,
            bio,
            occupation,
            expertise,
            newRole,
          ]
        );

        await pool.query("DELETE FROM users WHERE userid = $1", [id]);

        res
          .status(200)
          .json(
            success(
              "User account changed to mentor",
              newMentor.rows,
              res.statusCode
            )
          );
      }
    } catch (err) {
      res.status(500).json(error(err.message, res.statusCode));
    }
  },

  async editProfile(req, res) {
    try {
      const id = req.params.userid;
      
      const user = await pool.query("Select * From users WHERE userid = $1", [
        id,
      ]);
      if (!user.rows[0]) {
        res.status(404).json(error("user does not exist", res.statusCode));
      } else {
        const { error: err, value } = RegisterValidation(req.body);

      if (err) {
        return res.status(400).json(error(err.details[0].message, 400));
      } else {}
        const currentUser = user.rows[0];

        const {
          profileImage,
          firstname,
          lastname,
          email,
          password,
          address,
          bio,
          occupation,
          expertise,
        } = currentUser;
      }
    } catch (err) {
      res.status(500).json(error(err.message, res.statusCode));
    }
  },
};
