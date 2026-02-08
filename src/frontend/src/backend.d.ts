import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface BestScores {
    car: bigint;
    farming: bigint;
    endlessRun: bigint;
    battle: bigint;
    cityBuilder: bigint;
    indoor: bigint;
}
export type Time = bigint;
export interface MinigameScores {
    puzzleGame: bigint;
    reactionGame: bigint;
}
export interface BattleStats {
    winsCount: bigint;
    bestStreak: bigint;
}
export interface GameState {
    mode: GameMode;
    score: bigint;
    state: GameRunState;
    coinsEarned: bigint;
}
export interface UserProfile {
    cityLayout?: Array<Array<StructureType>>;
    lastPlayed: Time;
    minigameScores?: MinigameScores;
    farmPlots?: Array<Array<CropType | null>>;
    displayName?: string;
    bestTime?: bigint;
    totalCoins: bigint;
    battleStats?: BattleStats;
    bestScores: BestScores;
}
export enum CropType {
    tomato = "tomato",
    carrot = "carrot",
    wheat = "wheat"
}
export enum GameMode {
    car = "car",
    farming = "farming",
    endlessRun = "endlessRun",
    battle = "battle",
    cityBuilder = "cityBuilder",
    indoor = "indoor"
}
export enum GameRunState {
    start = "start",
    gameOver = "gameOver",
    running = "running"
}
export enum StructureType {
    house = "house",
    park = "park",
    shop = "shop"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createOrUpdatePlayerData(displayName: string | null): Promise<void>;
    endGame(): Promise<GameRunState>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getGlobalGameState(): Promise<GameState | null>;
    getPlayerData(user: Principal): Promise<UserProfile>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    startGame(mode: GameMode): Promise<GameRunState>;
    updateGame(score: bigint): Promise<GameRunState>;
}
