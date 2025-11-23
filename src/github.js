// src/github.js

const fetch = require("node-fetch");

const GITHUB_API = "https://api.github.com";

async function fetchGithubUser(username) {
  if (!username) throw new Error("Username is required");

  const headers = {
    "User-Agent": "github-profile-panels",
    "Accept": "application/vnd.github+json"
  };

  // Optional: token via env var (for higher rate limits)
  const token = process.env.GITHUB_TOKEN ? process.env.GITHUB_TOKEN.trim() : null;
  if (token) {
    headers.Authorization = `token ${token}`;
  }

  // Fetch user data
  const userRes = await fetch(
    `${GITHUB_API}/users/${encodeURIComponent(username)}`,
    { headers }
  );

  if (!userRes.ok) {
    const text = await userRes.text();
    throw new Error(
      `GitHub API error (${userRes.status}): ${text || userRes.statusText}`
    );
  }

  const userData = await userRes.json();

  // Fetch repositories to calculate total stars
  let totalStars = 0;
  let totalForks = 0;
  
  try {
    const reposRes = await fetch(
      `${GITHUB_API}/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`,
      { headers }
    );
    
    if (reposRes.ok) {
      const reposData = await reposRes.json();
      totalStars = reposData.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
      totalForks = reposData.reduce((sum, repo) => sum + (repo.forks_count || 0), 0);
    }
  } catch (err) {
    console.warn("Could not fetch repos:", err.message);
  }

  // Fetch commits, PRs, and issues using GitHub Search API
  let commits = 0;
  let pullRequests = 0;
  let issues = 0;

  try {
    // Fetch all lifetime commits using GitHub Search API
    // This searches across all repositories for commits by this author
    // Note: Search API might require authentication for some queries
    const commitsSearchRes = await fetch(
      `${GITHUB_API}/search/commits?q=author:${encodeURIComponent(username)}&per_page=1`,
      { headers }
    );
    
    if (commitsSearchRes.ok) {
      const commitsData = await commitsSearchRes.json();
      commits = commitsData.total_count || 0;
      console.log(`Found ${commits} commits via Search API for ${username}`);
    } else {
      const errorText = await commitsSearchRes.text();
      console.warn(`Search API failed (${commitsSearchRes.status}): ${errorText.substring(0, 100)}`);
      // If Search API fails (e.g., requires auth or rate limited), 
      // fall back to counting commits from user's repositories
      console.warn("Search API failed, falling back to repository-based counting");
      
      try {
        // Get all repositories
        let allRepos = [];
        let repoPage = 1;
        
        while (true) {
          const reposRes = await fetch(
            `${GITHUB_API}/users/${encodeURIComponent(username)}/repos?per_page=100&page=${repoPage}&sort=updated`,
            { headers }
          );
          
          if (!reposRes.ok) break;
          
          const reposData = await reposRes.json();
          if (!reposData || reposData.length === 0) break;
          
          allRepos = allRepos.concat(reposData);
          
          // Check if there are more pages
          const linkHeader = reposRes.headers.get('link');
          if (!linkHeader || !linkHeader.includes('rel="next"')) break;
          
          repoPage++;
          if (repoPage > 10) break; // Safety limit
        }
        
        // Count commits in each repository using the commits API
        // We use per_page=100 and check the Link header to get total pages
        for (const repo of allRepos) {
          try {
            const repoCommitsRes = await fetch(
              `${GITHUB_API}/repos/${repo.full_name}/commits?author=${encodeURIComponent(username)}&per_page=100`,
              { headers }
            );
            
            if (repoCommitsRes.ok) {
              const linkHeader = repoCommitsRes.headers.get('link');
              if (linkHeader) {
                // Extract last page number from Link header
                // Format: <url>; rel="last", <url>; rel="first"
                const lastPageMatch = linkHeader.match(/page=(\d+)>; rel="last"/);
                if (lastPageMatch) {
                  const lastPage = parseInt(lastPageMatch[1], 10);
                  // Get the actual commits from the last page to count accurately
                  if (lastPage > 1) {
                    const lastPageRes = await fetch(
                      `${GITHUB_API}/repos/${repo.full_name}/commits?author=${encodeURIComponent(username)}&per_page=100&page=${lastPage}`,
                      { headers }
                    );
                    if (lastPageRes.ok) {
                      const lastPageData = await lastPageRes.json();
                      // Total = (pages - 1) * 100 + commits on last page
                      commits += (lastPage - 1) * 100 + (lastPageData ? lastPageData.length : 0);
                    } else {
                      // Fallback: estimate based on page number
                      commits += (lastPage - 1) * 100 + 100; // Estimate
                    }
                  } else {
                    // Only one page, count commits directly
                    const commitsData = await repoCommitsRes.json();
                    commits += commitsData ? commitsData.length : 0;
                  }
                } else {
                  // No last page in header, count commits in response
                  const commitsData = await repoCommitsRes.json();
                  commits += commitsData ? commitsData.length : 0;
                }
              } else {
                // No pagination header, count commits in response directly
                const commitsData = await repoCommitsRes.json();
                commits += commitsData ? commitsData.length : 0;
              }
            }
            
            // Small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 50));
          } catch (repoErr) {
            // Skip this repo if there's an error (might be private, deleted, or empty)
            continue;
          }
        }
      } catch (fallbackErr) {
        console.warn("Could not fetch commits from repositories:", fallbackErr.message);
      }
    }
  } catch (err) {
    console.warn("Could not fetch commits:", err.message);
  }

  try {
    // Fetch pull requests using Search API
    const prSearchRes = await fetch(
      `${GITHUB_API}/search/issues?q=type:pr+author:${encodeURIComponent(username)}&per_page=1`,
      { headers }
    );
    
    if (prSearchRes.ok) {
      const prData = await prSearchRes.json();
      pullRequests = prData.total_count || 0;
    }
  } catch (err) {
    console.warn("Could not fetch pull requests:", err.message);
  }

  try {
    // Fetch issues using Search API
    const issueSearchRes = await fetch(
      `${GITHUB_API}/search/issues?q=type:issue+author:${encodeURIComponent(username)}&per_page=1`,
      { headers }
    );
    
    if (issueSearchRes.ok) {
      const issueData = await issueSearchRes.json();
      issues = issueData.total_count || 0;
    }
  } catch (err) {
    console.warn("Could not fetch issues:", err.message);
  }

  return {
    username: userData.login,
    avatarUrl: userData.avatar_url,
    name: userData.name || userData.login,
    followers: userData.followers,
    following: userData.following,
    publicRepos: userData.public_repos,
    publicGists: userData.public_gists,
    totalStars: totalStars,
    totalForks: totalForks,
    commits: commits,
    pullRequests: pullRequests,
    issues: issues,
    location: userData.location || "",
    bio: userData.bio || ""
  };
}

module.exports = { fetchGithubUser };
