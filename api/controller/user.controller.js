import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { errorhandler } from '../utils/error.js';

export const updateUser = async (req, res, next) => {
    if(req.user.id!==req.params.id)
        return next(errorhandler(401,"You can only Update your account")) 
  try {
    if(req.body.passowrd){ 
        req.body.password=bcrypt.hashSync(req.body.password,10)
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username:req.body.username,
          email:req.body.email,
          password:req.body.password,
          avator: req.body.avator
        },
      },
      {returnDocument : "after" }
    )

    const { password, ...rest } = updatedUser._doc
    res.status(200).json(rest)
  } catch (error) {
    next(error)
  }
}