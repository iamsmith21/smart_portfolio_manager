import { graphql } from "@octokit/graphql";

export async function fetchRepos(username: string) {
  const query = `
    query($login: String!) {
      user(login: $login) {
        repositories(first: 10, orderBy: {field: UPDATED_AT, direction: DESC}) {
          nodes {
            name
            description
            stargazerCount
            url
            primaryLanguage { name }
          }
        }
      }
    }
  `;
  const result = await graphql(query, { login: username });
  return result.user.repositories.nodes;
}