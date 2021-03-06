import { gql } from 'apollo-server-express';

export default gql`
	type Comment {
		_id: ID!
		createdAt: String!
		username: String!
		body: String!
	}

	type Mutation {
		createComment(dateID: ID!, body: String!): Date!
		editComment(dateID: ID!, commentID: ID!, body: String!): Date!
		deleteComment(dateID: ID!, commentID: ID!): Date!
	}
`;
