const VERCEL_API_TOKEN = process.env.VERCEL_API_TOKEN;
const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID;
const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID;

const getHeaders = () => {
    if (!VERCEL_API_TOKEN) {
        throw new Error("Missing VERCEL_API_TOKEN");
    }
    return {
        Authorization: `Bearer ${VERCEL_API_TOKEN}`,
        "Content-Type": "application/json",
    };
};

const getApiUrl = (endpoint: string) => {
    let url = `https://api.vercel.com${endpoint}`;
    if (VERCEL_TEAM_ID) {
        url += `?teamId=${VERCEL_TEAM_ID}`;
    }
    return url;
};

export async function addDomainToVercel(domain: string) {
    if (!VERCEL_PROJECT_ID) throw new Error("Missing VERCEL_PROJECT_ID");

    const response = await fetch(getApiUrl(`/v10/projects/${VERCEL_PROJECT_ID}/domains`), {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ name: domain }),
    });

    const data = await response.json();

    if (!response.ok) {
        if (response.status === 409) {
            return { error: "Domain is already in use by another Vercel account." };
        }
        if (response.status === 403) {
            return { error: "Invalid Vercel API Token or Project ID." };
        }
        console.error("Vercel Add Domain Error:", data);
        return { error: data.error?.message || "Failed to add domain to Vercel." };
    }

    return data;
}

export async function removeDomainFromVercel(domain: string) {
    if (!VERCEL_PROJECT_ID) throw new Error("Missing VERCEL_PROJECT_ID");

    const response = await fetch(getApiUrl(`/v9/projects/${VERCEL_PROJECT_ID}/domains/${domain}`), {
        method: "DELETE",
        headers: getHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
        console.error("Vercel Remove Domain Error:", data);
        return { error: data.error?.message || "Failed to remove domain from Vercel." };
    }

    return data;
}

export async function getDomainStatus(domain: string) {
    if (!VERCEL_PROJECT_ID) throw new Error("Missing VERCEL_PROJECT_ID");

    const response = await fetch(getApiUrl(`/v9/projects/${VERCEL_PROJECT_ID}/domains/${domain}`), {
        method: "GET",
        headers: getHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
        return { error: data.error?.message || "Failed to fetch domain status." };
    }

    return data;
}
