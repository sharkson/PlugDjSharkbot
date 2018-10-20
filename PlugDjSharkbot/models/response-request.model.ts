export class ResponseRequest {
  constructor(public type: string, public conversationName: string, public exclusiveTypes: Array<string> = [], public requiredProperyMatches: Array<string> = [], public excludedTypes: Array<string> = []) { }
}
