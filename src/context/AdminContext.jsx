import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import initialData from "../data/db.json";

const STORAGE_KEY = "admin-data";

const AdminContext = createContext();

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;
const GITHUB_USERNAME = import.meta.env.VITE_GITHUB_USERNAME;
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

const GITHUB_GRAPHQL = "https://api.github.com/graphql";

const REPOS_QUERY = `
  query($username: String!) {
    user(login: $username) {
      repositories(first: 100, orderBy: {field: UPDATED_AT, direction: DESC}, ownerAffiliations: [OWNER]) {
        nodes {
          name
          description
          url
          isPrivate
          stargazerCount
          forkCount
          defaultBranchRef {
            name
          }
        }
      }
    }
  }
`;

async function fetchUserRepos() {
  const headers = {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    "Content-Type": "application/json",
  };

  const response = await fetch(GITHUB_GRAPHQL, {
    method: "POST",
    headers,
    body: JSON.stringify({
      query: REPOS_QUERY,
      variables: { username: GITHUB_USERNAME },
    }),
  });

  const result = await response.json();

  if (result.errors) {
    throw new Error(result.errors[0].message);
  }

  return result.data.user.repositories.nodes.map((repo) => ({
    name: repo.name,
    description: repo.description || "",
    url: repo.url,
    isPrivate: repo.isPrivate,
    stars: repo.stargazerCount,
    forks: repo.forkCount,
    defaultBranch: repo.defaultBranchRef?.name || "main",
  }));
}

async function fetchRepoReadme(owner, name) {
  try {
    console.log("Fetching README from:", owner, name);
    const headers = {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
    };

    const url = `https://api.github.com/repos/${owner}/${name}/contents/README.md`;
    console.log("Fetching from URL:", url);

    const response = await fetch(url, {
      method: "GET",
      headers,
    });


    if (!response.ok) {
      const errorText = await response.text();
      console.log("Error response:", errorText);
      return null;
    }

    const data = await response.json();
    
    if (data.content) {
      const decoded = atob(data.content);
      const text = new TextDecoder("utf-8").decode(
        Uint8Array.from(decoded, (c) => c.charCodeAt(0)),
      );
      return text;
    }
    return null;
  } catch (err) {
    console.error("Error fetching README:", err);
    return null;
  }
}

function getStoredData() {
  if (typeof window === "undefined") return initialData;
  const stored = localStorage.getItem(STORAGE_KEY);
  const parsed = stored ? JSON.parse(stored) : {};
  const { admin, ...rest } = parsed;
  return { ...initialData, ...rest };
}

export function AdminProvider({ children }) {
  const [data, setData] = useState(getStoredData);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [githubRepos, setGithubRepos] = useState([]);
  const [selectedRepos, setSelectedRepos] = useState([]);
  const [loadingRepos, setLoadingRepos] = useState(false);

  useEffect(() => {
    const { admin, ...rest } = data;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
  }, [data]);

  const login = (password) => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => setIsAuthenticated(false);

  const updatePersonalInfo = (info) => {
    setData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, ...info },
    }));
  };

  const addProject = (project) => {
    const id = (data.projects.length + 1).toString().padStart(2, "0");
    const newProject = { ...project, id };
    setData((prev) => ({ ...prev, projects: [...prev.projects, newProject] }));
  };

  const updateProject = (id, project) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.map((p) =>
        p.id === id ? { ...p, ...project } : p,
      ),
    }));
  };

  const deleteProject = (id) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id),
    }));
  };

  const addSkill = (skill) => {
    if (!data.skills.includes(skill)) {
      setData((prev) => ({ ...prev, skills: [...prev.skills, skill] }));
    }
  };

  const deleteSkill = (skill) => {
    setData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const resetData = () => {
    setData(initialData);
  };

  const loadGithubRepos = useCallback(async () => {
    setLoadingRepos(true);
    try {
      const repos = await fetchUserRepos();
      setGithubRepos(repos);
    } catch (err) {
      console.error("Failed to load repos:", err);
    } finally {
      setLoadingRepos(false);
    }
  }, []);

  const toggleRepo = (repo) => {
    setSelectedRepos((prev) => {
      const exists = prev.find((r) => r.name === repo.name);
      if (exists) {
        return prev.filter((r) => r.name !== repo.name);
      }
      return [...prev, repo];
    });
  };

  const importSelectedRepos = () => {
    setData((prev) => {
      let maxId = 0;
      prev.projects.forEach((p) => {
        const idNum = parseInt(p.id, 10);
        if (idNum > maxId) maxId = idNum;
      });

      const newProjects = [];
      selectedRepos.forEach((repo, index) => {
        const existing = prev.projects.find((p) => p.repoUrl === repo.url);
        if (!existing) {
          const newId = (maxId + index + 1).toString().padStart(2, "0");
          const slug = repo.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
          newProjects.push({
            id: newId,
            title: repo.name,
            description: repo.description,
            slug,
            repoUrl: repo.url,
            liveDemoUrl: "",
            tags: [],
            techStack: [],
            tools: [],
            coverImage: null,
          });
        }
      });

      return { ...prev, projects: [...prev.projects, ...newProjects] };
    });
    setSelectedRepos([]);
  };

  return (
    <AdminContext.Provider
      value={{
        data,
        isAuthenticated,
        login,
        logout,
        updatePersonalInfo,
        addProject,
        updateProject,
        deleteProject,
        addSkill,
        deleteSkill,
        resetData,
        githubRepos,
        selectedRepos,
        loadingRepos,
        loadGithubRepos,
        toggleRepo,
        importSelectedRepos,
        fetchRepoReadme,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) throw new Error("useAdmin must be used within AdminProvider");
  return context;
}
