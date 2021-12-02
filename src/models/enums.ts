export enum Portion {
    small,
    medium,
    big,
}

export enum ScheduleType {
    once,
    daily,
}

export enum DeviceStatus {
    online,
    offline,
    feeding,
    watering,
    error,
}

export enum DeviceCommand {
    feed,
    water,
    terminate,
    setOff,
}

export enum DeviceCommandState {
    new,
    inProgress,
    completed,
    error,
}

export enum FeedStatus {
    completed,
    error,
}

export enum LogType {
    info,
    warning,
    error,
}

export enum UserRole {
    superAdmin = 'superAdmin',
    user = 'user',
    device = 'device',
}
