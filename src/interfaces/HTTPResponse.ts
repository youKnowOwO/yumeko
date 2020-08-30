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
    watch: {[key: string]: PlatformWatch[]};
}

interface PlatformWatch {
    platform: string;
    url: string;
}