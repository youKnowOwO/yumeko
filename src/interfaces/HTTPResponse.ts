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

export interface BrainlyEdge {
    node: {
        databaseId: number;
        content: string;
        points: number;
        created: string;
        lastActivity: string;
        attachments: {
            url: string;
        }[];
        author?: {
            databaseId: number;
            nick: string;
            points: number;
            gender: string;
            description: string;
            isDeleted: boolean;
            avatar?: {
                url: string;
            };
            category: number;
            clientType: string;
            rank: {
                databaseId: number;
                name: string;
            };
            receivedThanks: number;
            bestAnswersCount: number;
            helpedUsersCount: number;
        };
        isAuthorsFirstQuestion: boolean;
        canBeAnswered: boolean;
        pointsForAnswer: number;
        pointsForBestAnswer: number;
        answers: {
            nodes: {
                databaseId: number;
                content: string;
                points: number;
                isBest: boolean;
                created: string;
                rating: number;
                ratesCount: number;
                thanksCount: number;
                attachments: {
                    url: string;
                }[];
                author?: {
                    databaseId: number;
                    nick: string;
                    points: number;
                    gender: string;
                    description: string;
                    isDeleted: boolean;
                    avatar?: {
                        url: string;
                    };
                    category: number;
                    clientType: string;
                    rank: {
                        databaseId: number;
                        name: string;
                    };
                    receivedThanks: number;
                    bestAnswersCount: number;
                    helpedUsersCount: number;
                };
            }[];
        };
    };
}

export interface MDNChildrenExpand {
    title?: string;
    label: string;
    url?: string;
    id: number;
    uuid: string;
    slug: string;
    tags: string[];
    review_tags: string[];
    localization_tags: string[];
    sections: {
        title?: string;
        id: string;
    }[];
    locale: string;
    summary?: string;
    translations: {
        last_edit: string;
        locale: string;
        localization_tags: string[];
        review_tags: string[];
        summary: string;
        tags: string[];
        title: string;
        url: string;
        uuid: string;
    }[];
    modified: string;
    json_modified: string;
    last_edit: string;
    subpages: MDNChildrenExpand[];
}