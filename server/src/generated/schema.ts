import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Directory = {
  __typename?: 'Directory';
  id: Scalars['String'];
  path: Scalars['String'];
  name: Scalars['String'];
};

export type Entry = File | Directory;

export type File = {
  __typename?: 'File';
  id: Scalars['String'];
  path: Scalars['String'];
  name: Scalars['String'];
  size: Scalars['Int'];
  lastModified: Scalars['String'];
};

export type ListEntriesResult = {
  __typename?: 'ListEntriesResult';
  pagination: Pagination;
  entries: Array<Maybe<Entry>>;
};

export type Pagination = {
  __typename?: 'Pagination';
  page: Scalars['Int'];
  pageCount: Scalars['Int'];
  prevPage?: Maybe<Scalars['Int']>;
  nextPage?: Maybe<Scalars['Int']>;
  totalRows?: Maybe<Scalars['Int']>;
};

export type Query = {
  __typename?: 'Query';
  listEntries?: Maybe<ListEntriesResult>;
};


export type QueryListEntriesArgs = {
  path: Scalars['String'];
  page?: Maybe<Scalars['Int']>;
  where?: Maybe<WhereInput>;
};

export type WhereInput = {
  size_gt?: Maybe<Scalars['Int']>;
  size_lt?: Maybe<Scalars['Int']>;
  name_contains?: Maybe<Scalars['String']>;
  type_eq?: Maybe<Scalars['String']>;
  modified_after?: Maybe<Scalars['String']>;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Directory: ResolverTypeWrapper<Directory>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Entry: ResolversTypes['File'] | ResolversTypes['Directory'];
  File: ResolverTypeWrapper<File>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  ListEntriesResult: ResolverTypeWrapper<Omit<ListEntriesResult, 'entries'> & { entries: Array<Maybe<ResolversTypes['Entry']>> }>;
  Pagination: ResolverTypeWrapper<Pagination>;
  Query: ResolverTypeWrapper<{}>;
  WhereInput: WhereInput;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Directory: Directory;
  String: Scalars['String'];
  Entry: ResolversParentTypes['File'] | ResolversParentTypes['Directory'];
  File: File;
  Int: Scalars['Int'];
  ListEntriesResult: Omit<ListEntriesResult, 'entries'> & { entries: Array<Maybe<ResolversParentTypes['Entry']>> };
  Pagination: Pagination;
  Query: {};
  WhereInput: WhereInput;
  Boolean: Scalars['Boolean'];
};

export type DirectoryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Directory'] = ResolversParentTypes['Directory']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  path?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EntryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Entry'] = ResolversParentTypes['Entry']> = {
  __resolveType: TypeResolveFn<'File' | 'Directory', ParentType, ContextType>;
};

export type FileResolvers<ContextType = any, ParentType extends ResolversParentTypes['File'] = ResolversParentTypes['File']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  path?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  size?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  lastModified?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ListEntriesResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['ListEntriesResult'] = ResolversParentTypes['ListEntriesResult']> = {
  pagination?: Resolver<ResolversTypes['Pagination'], ParentType, ContextType>;
  entries?: Resolver<Array<Maybe<ResolversTypes['Entry']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PaginationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Pagination'] = ResolversParentTypes['Pagination']> = {
  page?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  pageCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  prevPage?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  nextPage?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  totalRows?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  listEntries?: Resolver<Maybe<ResolversTypes['ListEntriesResult']>, ParentType, ContextType, RequireFields<QueryListEntriesArgs, 'path'>>;
};

export type Resolvers<ContextType = any> = {
  Directory?: DirectoryResolvers<ContextType>;
  Entry?: EntryResolvers<ContextType>;
  File?: FileResolvers<ContextType>;
  ListEntriesResult?: ListEntriesResultResolvers<ContextType>;
  Pagination?: PaginationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
