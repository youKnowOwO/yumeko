export interface RandomAnimeResponse {
    name: string;
    alternate_name: string;
    image: string;
    description: string;
    genres: string[];
    avg_score: string;
    episodes: string;
    eps_duration: string;
    release_date: string;
    season: string;
    rating: string;
    source: string;
    watch: {
        [key: string]: {
            platform: string;
            url: string;
        }[];
    };
}

export interface NPMResponse {
    name: string;
    description?: string;
    license?: string;
    maintainers: NPMResponse["author"][];
    "dist-tags": {
        latest: string;
        [key: string]: string;
    };
    versions: {
        [key: string]: {
            dependencies?: {[key: string]: string};
            dist: {
                intergrity: string;
                shashum: string;
                tarball: string;
                [key: string]: unknown;
            };
        };
    };
    author?: {
        name: string;
        email?: string;
        url?: string;
    };
    time?: {
        modified: Date;
        [key: string]: Date;
    };
}