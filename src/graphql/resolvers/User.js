import { UserInputError } from 'apollo-server-express';
import Users from '../../models/User';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validateUserRegisterInput, validateLoginInput } from '../../util/validators';

function generateToken(user) {
	return jwt.sign(
		{
			_id: user._id,
			username: user.username
		},
		process.env.SECRET_KEY,
		{ expiresIn: '1h' }
	);
}

export default {
	Query: {
		async users() {
			return await Users.find();
		},
		async getUser(_, { _id }) {
			return await Users.findById(_id);
		}
	},
	Mutation: {
		async login(_, { username, password }) {
			const { errors, valid } = validateLoginInput(username, password);

			if (!valid) {
				throw new UserInputError('Errors', { errors });
			}

			const user = await Users.findOne({ username });
			if (!user) {
				errors.general = 'User not found';
				throw new UserInputError('User not found', { errors });
			}

			const match = await bcryptjs.compare(password, user.password);
			if (!match) {
				errors.general = 'Wrong credentials';
				throw new UserInputError('Wrong credentials', { errors });
			}

			const token = generateToken(user);

			return {
				...user._doc,
				_id: user._id,
				username: user.username,
				userlvl: user.range,
				token
			};
		},
		async createUser(
			_,
			{
				input: { firstname, lastname, username, password, status, range, bachtitle, usericon }
			},
			context,
			info
		) {
			// TODO: validate user data
			const { valid, errors } = validateUserRegisterInput(firstname, lastname, username, password);
			if (!valid) {
				throw new UserInputError('Errors', { errors });
			}
			// TODO: make sure the user doesnt already exist
			const user = await Users.findOne({ username });
			if (user) {
				throw new UserInputError('Username is taken', {
					errors: {
						username: 'This username is taken'
					}
				});
			}
			/// TODO: hash password and create an auth token
			password = await bcryptjs.hash(password, 12);

			const newUser = new Users({
				firstname,
				lastname,
				username,
				password,
				status,
				range,
				bachtitle,
				usericon
			}); ///para crear una fecha se usa 'new Date().toISOString()'
			const res = await newUser.save();

			const token = generateToken(res);

			return {
				...res._doc,
				_id: res._id,
				token
			};
		},
		async updateUser(_, { _id, input }) {
			return await Users.findByIdAndUpdate(_id, input, { new: true });
		},
		async deleteUser(_, { _id }) {
			return await Users.findByIdAndDelete(_id);
		}
	}
};
