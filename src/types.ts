
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export enum GageReadingMetric {
    CFS = "CFS",
    CMS = "CMS",
    FT = "FT",
    TEMP = "TEMP"
}

export enum CacheControlScope {
    PUBLIC = "PUBLIC",
    PRIVATE = "PRIVATE"
}

export enum FlowRangeRanges {
    BELOW_RECOMMENDED = "BELOW_RECOMMENDED",
    RECOMMENDED = "RECOMMENDED",
    ABOVE_RECOMMENDED = "ABOVE_RECOMMENDED",
    HIGH_LOW = "HIGH_LOW",
    MEDIUM_LOW = "MEDIUM_LOW",
    LOW = "LOW",
    LOW_MEDIUM = "LOW_MEDIUM",
    MEDIUM = "MEDIUM",
    HIGH_MEDIUM = "HIGH_MEDIUM",
    LOW_HIGH = "LOW_HIGH",
    HIGH = "HIGH",
    HIGH_HIGH = "HIGH_HIGH",
    BIBLICAL = "BIBLICAL"
}

export enum GageSource {
    USGS = "USGS",
    CANADA = "CANADA",
    VANCOUVER_METRO = "VANCOUVER_METRO",
    VISUAL = "VISUAL"
}

export enum GageMetric {
    CFS = "CFS",
    FT = "FT",
    TEMP = "TEMP"
}

export enum MediaType {
    YOUTUBE = "YOUTUBE",
    PHOTO = "PHOTO",
    VIMEO = "VIMEO"
}

export enum NotificationInterval {
    IMMEDIATE = "IMMEDIATE",
    DAILY = "DAILY",
    WEEKLY = "WEEKLY",
    MONTHLY = "MONTHLY",
    YEARLY = "YEARLY"
}

export enum NotificationCriteria {
    ABOVE = "ABOVE",
    BELOW = "BELOW",
    BETWEEN = "BETWEEN",
    DISABLED = "DISABLED"
}

export enum NotificationChannel {
    EMAIL = "EMAIL",
    SMS = "SMS",
    SLACK = "SLACK",
    TEAMS = "TEAMS"
}

export enum PostType {
    ALERT = "ALERT",
    INFO = "INFO",
    NEWS = "NEWS",
    COMMENT = "COMMENT"
}

export enum GradeRating {
    none = "none",
    I = "I",
    II = "II",
    III = "III",
    IV = "IV",
    V = "V"
}

export enum SubscriptionLevel {
    FREE = "FREE",
    PREMIUM = "PREMIUM",
    DELUXE = "DELUXE"
}

export enum UserRole {
    USER = "USER",
    EDITOR = "EDITOR",
    ADMIN = "ADMIN",
    SUPERADMIN = "SUPERADMIN"
}

export interface AuthLoginInput {
    email: string;
    password: string;
}

export interface CreateCountryInput {
    name: string;
    code: string;
}

export interface UpdateCountryInput {
    id: number;
    name?: Nullable<string>;
    code?: Nullable<string>;
}

export interface CreateFeatureInput {
    exampleField?: Nullable<number>;
}

export interface UpdateFeatureInput {
    id: number;
}

export interface CreateGageReadingInput {
    exampleField?: Nullable<number>;
}

export interface UpdateGageReadingInput {
    id: number;
}

export interface CreateGageInput {
    siteId?: Nullable<string>;
    name: string;
    source: GageSource;
}

export interface UpdateGageInput {
    id: number;
    metric: string;
}

export interface GageSearchInput {
    state?: Nullable<string>;
    country?: Nullable<string>;
    limit: number;
    offset: number;
    name?: Nullable<string>;
}

export interface CreateMediaInput {
    reachId: number;
    type: MediaType;
    title: string;
    description?: Nullable<string>;
    contentWarning: boolean;
    fileName?: Nullable<string>;
}

export interface UpdateMediaInput {
    id: number;
}

export interface CreateNotificationInput {
    name?: Nullable<string>;
    minimum?: Nullable<number>;
    maximum?: Nullable<number>;
    value?: Nullable<number>;
    criteria: NotificationCriteria;
    channel: NotificationChannel;
    metric: GageMetric;
    interval: NotificationInterval;
    gageDisabled: boolean;
    active: boolean;
    primary: boolean;
    alertTime?: Nullable<Date>;
    gageId?: Nullable<number>;
    userId: number;
}

export interface UpdateNotificationInput {
    id: number;
    name?: Nullable<string>;
    minimum?: Nullable<number>;
    maximum?: Nullable<number>;
    count: number;
    criteria: NotificationCriteria;
    channel: NotificationChannel;
    metric: GageMetric;
    interval: NotificationInterval;
    gageDisabled: boolean;
    active: boolean;
    primary: boolean;
    alertTime?: Nullable<Date>;
    userId: number;
}

export interface CreatePostInput {
    title: string;
    subtitle?: Nullable<string>;
    content: string;
    userId: number;
    private: boolean;
    pending: boolean;
    published: boolean;
    type: PostType;
    reaches?: Nullable<number[]>;
}

export interface UpdatePostInput {
    id: number;
}

export interface CreateReachInput {
    name: string;
    section?: Nullable<string>;
    class?: Nullable<GradeRating>;
}

export interface UpdateReachInput {
    id: number;
    name: string;
    description?: Nullable<string>;
    directions?: Nullable<string>;
    permit?: Nullable<string>;
    latitude?: Nullable<number>;
    longitude?: Nullable<number>;
    minimumGradient?: Nullable<number>;
    maximumGradient?: Nullable<number>;
    averageGradient?: Nullable<number>;
    section?: Nullable<string>;
    class?: Nullable<GradeRating>;
    state?: Nullable<string>;
    country?: Nullable<string>;
}

export interface CreateUserInput {
    firstName: string;
    lastName: string;
    isActive: boolean;
    email: string;
    timezone: string;
}

export interface UpdateUserInput {
    id: number;
    firstName?: Nullable<string>;
    lastName?: Nullable<string>;
    isActive?: Nullable<boolean>;
    email?: Nullable<string>;
    timezone?: Nullable<string>;
    role?: Nullable<UserRole>;
    gages?: Nullable<number[]>;
    reaches?: Nullable<number[]>;
    notifications?: Nullable<number[]>;
}

export interface AuthLoginResponse {
    id: number;
    email: string;
    role?: Nullable<UserRole>;
    token: string;
}

export interface IMutation {
    login(authLoginInput: AuthLoginInput): Nullable<AuthLoginResponse> | Promise<Nullable<AuthLoginResponse>>;
    refresh(email: string): Nullable<User> | Promise<Nullable<User>>;
    createCountry(createCountryInput: CreateCountryInput): Country | Promise<Country>;
    updateCountry(updateCountryInput: UpdateCountryInput): Country | Promise<Country>;
    removeCountry(id: number): Nullable<Country> | Promise<Nullable<Country>>;
    exportReachPDF(reachId: number): string | Promise<string>;
    createFeature(createFeatureInput: CreateFeatureInput): Feature | Promise<Feature>;
    updateFeature(updateFeatureInput: UpdateFeatureInput): Feature | Promise<Feature>;
    removeFeature(id: number): Nullable<Feature> | Promise<Nullable<Feature>>;
    createGage(createGageInput: CreateGageInput): Gage | Promise<Gage>;
    updateGage(updateGageInput: UpdateGageInput): Gage | Promise<Gage>;
    removeGage(id: number): Nullable<Gage> | Promise<Nullable<Gage>>;
    singleUpload(file: Upload): Nullable<File> | Promise<Nullable<File>>;
    createMedia(createMediaInput: CreateMediaInput): Media | Promise<Media>;
    updateMedia(updateMediaInput: UpdateMediaInput): Media | Promise<Media>;
    removeMedia(id: number): Nullable<Media> | Promise<Nullable<Media>>;
    createNotification(createNotificationInput: CreateNotificationInput): Notification | Promise<Notification>;
    updateNotification(updateNotificationInput: UpdateNotificationInput): Notification | Promise<Notification>;
    removeNotification(id: number): Nullable<Notification> | Promise<Nullable<Notification>>;
    createPost(createPostInput: CreatePostInput): Post | Promise<Post>;
    updatePost(updatePostInput: UpdatePostInput): Post | Promise<Post>;
    removePost(id: number): Nullable<Post> | Promise<Nullable<Post>>;
    createReach(createReachInput: CreateReachInput): Reach | Promise<Reach>;
    updateReach(updateReachInput: UpdateReachInput): Reach | Promise<Reach>;
    removeReach(id: number): Nullable<Reach> | Promise<Nullable<Reach>>;
    createUser(createUserInput: CreateUserInput): User | Promise<User>;
    updateUser(updateUserInput: UpdateUserInput): User | Promise<User>;
    removeUser(id: number): Nullable<User> | Promise<Nullable<User>>;
}

export interface Country {
    id: number;
    name: string;
    code: string;
}

export interface IQuery {
    countries(): Nullable<Country>[] | Promise<Nullable<Country>[]>;
    country(id: number): Nullable<Country> | Promise<Nullable<Country>>;
    features(): Nullable<Feature>[] | Promise<Nullable<Feature>[]>;
    feature(id: number): Nullable<Feature> | Promise<Nullable<Feature>>;
    gageReadings(): Nullable<GageReading>[] | Promise<Nullable<GageReading>[]>;
    gageReading(id: number): Nullable<GageReading> | Promise<Nullable<GageReading>>;
    gages(): Nullable<Gage>[] | Promise<Nullable<Gage>[]>;
    gage(id: number): Nullable<Gage> | Promise<Nullable<Gage>>;
    gagesSearch(gageSearchInput: GageSearchInput): GageSearchResponse | Promise<GageSearchResponse>;
    mediaAll(): Nullable<Media>[] | Promise<Nullable<Media>[]>;
    media(id: number): Nullable<Media> | Promise<Nullable<Media>>;
    notifications(userId: number): Nullable<Notification>[] | Promise<Nullable<Notification>[]>;
    notification(id: number): Nullable<Notification> | Promise<Nullable<Notification>>;
    posts(): Nullable<Post>[] | Promise<Nullable<Post>[]>;
    post(id: number): Nullable<Post> | Promise<Nullable<Post>>;
    reaches(): Nullable<Reach>[] | Promise<Nullable<Reach>[]>;
    reach(id: number): Nullable<Reach> | Promise<Nullable<Reach>>;
    users(): Nullable<User>[] | Promise<Nullable<User>[]>;
    user(email: string): Nullable<User> | Promise<Nullable<User>>;
    whoAmI(): Nullable<User> | Promise<Nullable<User>>;
}

export interface Feature {
    id: number;
    name: string;
}

export interface GageReading {
    id?: Nullable<number>;
    value: number;
    metric: GageMetric;
    gageId: number;
    latitude?: Nullable<number>;
    longitude?: Nullable<number>;
    createdAt?: Nullable<Date>;
}

export interface Gage {
    id: number;
    name: string;
    source: GageSource;
    siteId: string;
    state?: Nullable<string>;
    metric: GageMetric;
    latestReading?: Nullable<string>;
    readings: GageReading[];
    notifications?: Nullable<Notification[]>;
    delta?: Nullable<number>;
    lastFetch?: Nullable<Date>;
    createdAt: Date;
    updatedAt?: Nullable<Date>;
    deletedAt?: Nullable<Date>;
}

export interface GageSearchResponse {
    gages?: Nullable<Gage[]>;
    limit: number;
    offset: number;
    total: number;
}

export interface ISubscription {
    gagesUpdated(): Date | Promise<Date>;
}

export interface File {
    id: string;
    path: string;
    filename: string;
    mimetype: string;
}

export interface Media {
    id: number;
    type: MediaType;
    title: string;
    description?: Nullable<string>;
    contentWarning: boolean;
    reported: boolean;
    fileName?: Nullable<string>;
    url: string;
    user: User;
}

export interface Notification {
    id: number;
    name?: Nullable<string>;
    minimum?: Nullable<number>;
    maximum?: Nullable<number>;
    value?: Nullable<number>;
    count: number;
    criteria: NotificationCriteria;
    channel: NotificationChannel;
    metric: GageMetric;
    interval: NotificationInterval;
    gageDisabled: boolean;
    active: boolean;
    primary: boolean;
    lastSent?: Nullable<Date>;
    alertTime?: Nullable<Date>;
    gage?: Nullable<Gage>;
    user?: Nullable<User>;
    createdAt: Date;
    updatedAt: Date;
}

export interface Post {
    id: number;
    title: string;
    subtitle?: Nullable<string>;
    content: string;
    userId: number;
    private: boolean;
    pending: boolean;
    published: boolean;
    type: PostType;
    reaches: Reach[];
}

export interface Reach {
    id: number;
    name: string;
    description?: Nullable<string>;
    directions?: Nullable<string>;
    permit?: Nullable<string>;
    latitude?: Nullable<number>;
    longitude?: Nullable<number>;
    minimumGradient?: Nullable<number>;
    maximumGradient?: Nullable<number>;
    averageGradient?: Nullable<number>;
    section?: Nullable<string>;
    geom?: Nullable<string>;
    gageInfo?: Nullable<string>;
    altname?: Nullable<string>;
    class?: Nullable<GradeRating>;
    state?: Nullable<string>;
    country?: Nullable<string>;
    gages?: Nullable<Nullable<Gage>[]>;
    features: Feature[];
    posts: Post[];
    users: User[];
    media: Media[];
    createdAt: Date;
    updatedAt?: Nullable<Date>;
    deletedAt?: Nullable<Date>;
}

export interface User {
    id: number;
    firstName?: Nullable<string>;
    lastName?: Nullable<string>;
    password: string;
    gages: Gage[];
    notifications: Notification[];
    reaches: Reach[];
    posts: Post[];
    email: string;
    timezone: string;
    role: UserRole;
    deletedAt?: Nullable<Date>;
    createdAt: Date;
    updatedAt: Date;
}

export type Upload = any;
type Nullable<T> = T | null;
