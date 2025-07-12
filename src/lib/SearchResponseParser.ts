export interface OpenSearchUrl {
  type: string;
  template: string;
}

export interface QueryMetadata {
  title: string;
  totalResults: string;
  searchTerms: string;
  count: number;
  startIndex: number;
  startPage: number;
  language: string;
  inputEncoding: string;
  outputEncoding: string;
  safe: string;
  cx: string;
  sort: string;
  filter: string;
  gl: string;
  cr: string;
  googleHost: string;
  disableCnTwTranslation: string;
  hq: string;
  hl: string;
  siteSearch: string;
  siteSearchFilter: string;
  exactTerms: string;
  excludeTerms: string;
  linkSite: string;
  orTerms: string;
  relatedSite: string;
  dateRestrict: string;
  lowRange: string;
  highRange: string;
  fileType: string;
  rights: string;
  searchType: string;
  imgSize: string;
  imgType: string;
  imgColorType: string;
  imgDominantColor: string;
}

export interface Queries {
  previousPage?: QueryMetadata[];
  request: QueryMetadata[];
  nextPage?: QueryMetadata[];
}

export interface SearchInformation {
  searchTime: number;
  formattedSearchTime: string;
  totalResults: string;
  formattedTotalResults: string;
}

export interface Spelling {
  correctedQuery: string;
  htmlCorrectedQuery: string;
}

export interface Promotion {
  title: string;
  htmlTitle: string;
  link: string;
  displayLink: string;
  bodyLines: Array<{
    title: string;
    htmlTitle: string;
    url: string;
    link: string;
  }>;
  image?: {
    source: string;
    width: number;
    height: number;
  };
}

export interface Result {
  kind: string;
  title: string;
  htmlTitle: string;
  link: string;
  displayLink: string;
  snippet: string;
  htmlSnippet: string;
  cacheId?: string;
  formattedUrl: string;
  htmlFormattedUrl: string;
  pagemap?: any;
  mime?: string;
  fileFormat?: string;
  image?: {
    contextLink: string;
    height: number;
    width: number;
    byteSize: number;
    thumbnailLink: string;
    thumbnailHeight: number;
    thumbnailWidth: number;
  };
  labels?: Array<{
    name: string;
    displayName: string;
    label_with_op: string;
  }>;
}

export class SearchResponseParser {
  kind: string;
  url: OpenSearchUrl;
  queries: Queries;
  promotions: Promotion[];
  context: any;
  searchInformation: SearchInformation;
  spelling?: Spelling;
  items: Result[];

  constructor(data: any) {
    this.kind = data.kind;
    this.url = data.url;
    this.queries = data.queries;
    this.promotions = data.promotions || [];
    this.context = data.context;
    this.searchInformation = data.searchInformation;
    this.spelling = data.spelling;
    this.items = data.items;
  }

  getTotalResults(): number {
    return parseInt(this.searchInformation.totalResults, 10);
  }

  getSearchTime(): number {
    return this.searchInformation.searchTime;
  }
}