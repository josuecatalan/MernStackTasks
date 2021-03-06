import { gql } from 'apollo-server-express';

export default gql`
	type User {
		_id: ID
		firstname: String!
		lastname: String!
		username: String!
		password: String!
		status: Int!
		range: Int!
		token: String!
		bachtitle: String!
		usericon: String!
	}

	type Query {
		getUser(_id: ID): User!
		users: [User]!
	}

	input UserInput {
		firstname: String!
		lastname: String!
		username: String!
		password: String!
		status: Int
		range: Int
		bachtitle: String
		usericon: String
	}

	type Mutation {
		createUser(input: UserInput): User
		login(username: String!, password: String!): User!
		updateUser(_id: ID, input: UserInput): User
		deleteUser(_id: ID): User
	}
`;
