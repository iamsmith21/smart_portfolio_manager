import {graphql} from "@octokit/graphql";

const client = graphql.defaults({
    headers: {
        authorization: `token ${process.env.GITHUB_TOKEN}`,

    },
});

export async function fetchRepos(username: string){
    const query = `
    {
    user(login: "${username}"){
    repositories(first: 10, orderBy: {field: UPDATED_AT, direction: DESC}) {
          nodes {
            name
            description
            stargazerCount
            forkCount
            url
            updatedAt
          }
        }
      }
    }
    `;
    const result = await client<FetchReposResponse>(query);
    return result.user.repositories.nodes;
}

type Repo = {
  name: string;
  description: string | null;
  stargazerCount: number;
  forkCount: number;
  url: string;
  updatedAt: string;
};

type FetchReposResponse = {
  user: {
    repositories: {
      nodes: Repo[];
    };
  };
};