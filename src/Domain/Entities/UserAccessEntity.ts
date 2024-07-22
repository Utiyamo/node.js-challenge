export class UserAccessEntity {
    userId: bigint;
    requestUrl: string;
    permitGet: boolean;
    permitPost: boolean;
    permitPut: boolean;
    permitPatch: boolean;
    permitDelete: boolean;
  
    constructor(userId: bigint, requestUrl: string, permitGet: boolean, permitPost: boolean, permitPut: boolean, permitPatch: boolean, permitDelete: boolean) {
      this.userId = userId;
      this.requestUrl = requestUrl;
      this.permitGet = permitGet;
      this.permitPost = permitPost;
      this.permitPut = permitPut;
      this.permitPatch = permitPatch;
      this.permitDelete = permitDelete;
    }
  }
  