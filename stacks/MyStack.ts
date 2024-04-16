import { StackContext, Api, StaticSite, Bucket, Table } from "sst/constructs";

export function API({ stack }: StackContext) {
  const productsBucket = new Bucket(stack, "productsBucket");

  const tableCategories = new Table(stack, "Category", {
    fields: {
      name: "string",
    },
    primaryIndex: { partitionKey: "name" },
  });
  const tableProducts = new Table(stack, "Product3", {
    fields: {
      id: "string",
      category: "string",
      name: "string",
      imageUrl: "string",
      price: "number",
    },
    primaryIndex: { partitionKey: "id" },
    globalIndexes: {
      categoryIndex: {
        partitionKey: "category",
      },
    },
  });

  const api = new Api(stack, "api", {
    cors: true,
    authorizers: {
      myAuthorizer: {
        type: "jwt",
        jwt: {
          issuer: "https://productsapp.kinde.com",
          audience: ["https://productsapp.kinde.com/api"],
        },
      },
    },
    defaults: {
      authorizer: "myAuthorizer",
      function: {
        bind: [tableCategories, tableProducts],
      },
    },

    routes: {
      "GET /": "packages/functions/src/lambda.handler",

      "POST /category": {
        function: {
          handler: "packages/functions/src/category.create",
          permissions: ["dynamodb:PutItem"],
        },
      },
      "GET /category": {
        function: {
          handler: "packages/functions/src/csharp.categories",
          permissions: ["lambda:InvokeFunction"],
        },
      },
      "PUT /product": {
        function: {
          handler: "packages/functions/src/product.create",
          permissions: ["dynamodb:PutItem"],
        },
      },
      "POST /product": {
        function: {
          handler: "packages/functions/src/product.list",
          permissions: ["dynamodb:Scan"],
        },
      },
      "DELETE /product/{id}": {
        function: {
          handler: "packages/functions/src/product.del",
          permissions: ["dynamodb:DeleteItem"],
        },
      },

      "POST /upload": {
        function: {
          environment: {
            ASSETS_BUCKET_NAME: productsBucket.bucketName,
          },

          handler: "packages/functions/src/s3.handler",
        },
      },
      "GET /cs": {
        function: {
          handler: "packages/functions/src/csharp.categories",
          permissions: ["lambda:InvokeFunction"],
        },
      },
    },
  });


  api.attachPermissionsToRoute("POST /upload", [productsBucket, "grantPut"]);

  const web = new StaticSite(stack, "web", {
    path: "packages/web",
    buildOutput: "dist",
    buildCommand: "npm run build",
    environment: {
      VITE_APP_API_URL: api.url,
    },
    dev: {
      deploy: true,
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
    WebEndpoint: web.url,
    x: tableCategories.tableArn,
  });
}
