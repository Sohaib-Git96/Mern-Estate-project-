import User from '../models/user.model.js'

export const updateUser = async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          avator: req.body.avator,
        },
      },
      { new: true }
    )

    const { password, ...rest } = updatedUser._doc
    res.status(200).json(rest)
  } catch (error) {
    next(error)
  }
}