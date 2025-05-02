import { Request, Response } from 'express'
import { User } from '../models/User'
import { hashPassword } from '../utils/passwordUtils'
import { redactUser, redactUserForSharing } from '../utils/redactionUtils'
import { v4 as uuidv4 } from 'uuid'

class UserController {
  /**
   * Create a new user.
   */
  static async createUser(req: Request, res: Response): Promise<void> {
    const { login, email, givenName, familyName, password } = req.body

    try {
      // Hash password using the secure hashing function
      const passwordHash = password ? hashPassword(password) : null

      const user = await User.query().insert({
        id: uuidv4(),
        login,
        email,
        givenName,
        familyName,
        passwordHash, // Store the salted + peppered hash
      })

      res.status(201).json(user)
    } catch (error) {
      console.error('Error creating user:', error)
      res.status(500).json({ error: 'Failed to create user' })
    }
  }
  /**
   * Get a user by ID.
   */
  static async getUser(req: Request, res: Response): Promise<void> {
    const { userId } = req.params

    try {
      const user = (await User.query().findById(userId)) as User
      if (!user) {
        res.status(404).json({ error: 'User not found' })
        return
      }
      res.json(redactUser(user))
    } catch (error) {
      console.error('Error retrieving user:', error)
      res.status(500).json({ error: 'Failed to retrieve user' })
    }
  }

  /**
   * Get all users.
   */
  static async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = (await User.query()) as User[]
      // const redactedUsers = users.map(user => redactUser(user));
      res.json(users)
    } catch (error) {
      console.error('Error retrieving users:', error)
      res.status(500).json({ error: 'Failed to retrieve users' })
    }
  }

  /**
   * Get a user by login.
   */
  static async getUserByLogin(req: Request, res: Response): Promise<void> {
    const { login } = req.params
    try {
      const user = (await User.query().findOne({ login })) as User
      if (!user) {
        res.status(404).json({ error: 'User not found' })
        return
      }
      res.json({ ...redactUserForSharing(user), id: user.id })
    } catch (error) {
      console.error('Error retrieving user by login:', error)
      res.status(500).json({ error: 'Failed to retrieve user' })
    }
  }

  /**
   * Update a user.
   */
  static async updateUser(req: Request, res: Response): Promise<void> {
    const { userId } = req.params
    const { password, ...updateData } = req.body

    try {
      if (password) {
        updateData.passwordHash = hashPassword(password)
      }

      const updatedUser = await User.query().patchAndFetchById(
        userId,
        updateData,
      )
      if (!updatedUser) {
        res.status(404).json({ error: 'User not found' })
        return
      }
      res.json(updatedUser)
    } catch (error) {
      console.error('Error updating user:', error)
      res.status(500).json({ error: 'Failed to update user' })
    }
  }

  /**
   * Delete a user.
   */
  static async deleteUser(req: Request, res: Response): Promise<void> {
    const { userId } = req.params

    try {
      const deletedRows = await User.query().deleteById(userId)
      if (!deletedRows) {
        res.status(404).json({ error: 'User not found' })
        return
      }
      res.json({ message: 'User deleted' })
    } catch (error) {
      console.error('Error deleting user:', error)
      res.status(500).json({ error: 'Failed to delete user' })
    }
  }

  static async checkLogin(req: Request, res: Response): Promise<void> {
    const { login } = req.body
    if (!login) {
      res.status(400).json({ error: 'Login is required' })
      return
    }

    const existing = await User.query().findOne({ login })
    if (!existing) {
      res.status(200).json({ available: true })
      return
    }

    const base = login.toLowerCase()
    const results = (await User.query()
      .select(
        User.raw(
          `COALESCE(NULLIF(SUBSTRING(login FROM ?), '')::int, 0) as suffix`,
          [`^${base}(\\d+)$`],
        ),
      )
      .where('login', 'like', `${base}%`)
      .whereRaw(`login ~ ?`, [`^${base}(\\d+)?$`])
      .whereNull('deleted_at')) as unknown as Array<{ suffix: number }>

    // Find lowest available suffix
    const suffixes = new Set(results.map((r) => r.suffix))
    let i = 1
    while (suffixes.has(i)) i++
    const suggestion = `${base}${i}`

    res.status(409).json({ available: false, suggestion })
  }
}

export default UserController
