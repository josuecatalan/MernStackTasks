import { gql } from 'apollo-server-express';

export default gql`
	type Date {
		_id: ID!
		title: String!
		start_date: String!
		end_date: String!
		classname: String
		pacient: ID!
		user: String!
		comments: [Comment]!
		images: [Image]
		description: String
		editable: Boolean
		createdAt: String!
		commentCount: Int!
		imageCount: Int!
	}

	type Query {
		dates: [Date]
		getDate(_id: ID!): Date
	}

	input DateInput {
		title: String!
		start_date: String!
		end_date: String!
		classname: String
		description: String
		pacient: ID!
	}

	type Mutation {
		createDate(input: DateInput): Date!
		updateDate(_id: ID, input: DateInput): Date!
		deleteDate(_id: ID): Date!
	}
`;
