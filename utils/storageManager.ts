/**
 * Local Storage Manager for Salesforce environment variables
 */

const STORAGE_KEY = 'sfdc_environments';

export interface Environment {
    id: string;
    alias: string;
}

export const storageManager = {
    /**
     * Get all stored environments
     */
    getEnvironments(): Environment[] {
        if (process.client) {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        }
        return [];
    },

    /**
     * Get a specific environment by id
     */
    getEnvironment(id: string): Environment | null {
        const environments = this.getEnvironments();
        return environments.find(env => env.id === id) || null;
    },

    /**
     * Add a new environment
     */
    addEnvironment(alias: string): Environment {
        const environments = this.getEnvironments();
        const id = Date.now().toString();
        const newEnv: Environment = {
            id,
            alias
        };
        environments.push(newEnv);
        if (process.client) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(environments));
        }
        return newEnv;
    },

    /**
     * Update an environment
     */
    updateEnvironment(id: string, alias: string): Environment | null {
        const environments = this.getEnvironments();
        const index = environments.findIndex(env => env.id === id);
        if (index !== -1) {
            environments[index] = { id, alias };
            if (process.client) {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(environments));
            }
            return environments[index];
        }
        return null;
    },

    /**
     * Delete an environment
     */
    deleteEnvironment(id: string): boolean {
        const environments = this.getEnvironments();
        const filtered = environments.filter(env => env.id !== id);
        if (filtered.length < environments.length) {
            if (process.client) {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
            }
            return true;
        }
        return false;
    },

    /**
     * Clear all environments
     */
    clearAll(): void {
        if (process.client) {
            localStorage.removeItem(STORAGE_KEY);
        }
    }
};
