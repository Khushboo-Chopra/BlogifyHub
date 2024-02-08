//for hashing the password
const { createHmac, randomBytes } = require("node:crypto");
const { Schema, model } = require("mongoose");
const { createTokenForUser } = require("../services/authentication");
const userSchema = new Schema(
  {
    fullName: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    salt: {
      type: String,
    },
    password: {
      type: String,
      require: true,
    },
    profileImageURL: {
      type: String,
      default: "/images/default.png",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  { timestamps: true }
);

//before saving the user
userSchema.pre("save", function (next) {
  const user = this;

  if (!user.isModified("password")) return;
  //it's a secret key for user
  const salt = randomBytes(16).toString();
  //const salt = 'someRandomSalt'
  const hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

    this.salt = salt;
    this.password = hashedPassword;

    next();
});

//will create a virtual function for matching the  hash of password
userSchema.static("matchPasswordAndGenerateToken",async function(email,password){
  //firstly we will find the user with this email id
const user =await this.findOne({email});
//if(!user) return false;
if(!user) throw new Error('User not found!');

//user ka salt and password check krege
const salt = user.salt;
const hashedPassword = user.password;

//ab jo new password diya h in the arguments, uski hashing karege
const userProvidedHash = createHmac("sha256",salt).update(password).digest("hex");

//return hashedPassword === userProvidedHash;

if(hashedPassword !== userProvidedHash) throw new Error("Incorrect Password!");

const token = createTokenForUser(user);
return token;
//return user;
});
const User = model("user", userSchema);

module.exports = User;
