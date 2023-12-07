// Duplicate of server/types.ts

export type PlayerRoomAction =
    | "toggle-ready"
    | "change-name"
    | "change-room-name"
    | "change-room-seed"
    | "add-ai-player"

export enum RoomStatus {
    Setup,
    Starting,
    Closed,
}

export enum GameStatus {
    Starting,
    Playing,
    Finished,
    Paused,
    Closed,
}
