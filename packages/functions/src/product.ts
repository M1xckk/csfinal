import { ApiHandler } from "sst/node/api";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";
import { Table } from "sst/node/table";
import { randomUUID } from "crypto";

export const create = ApiHandler(async (_evt) => {
  const data = JSON.parse(_evt.body);
  console.log(data);

  const { name, price, category, imageUrl } = data;

  const client = new DynamoDBClient();
  const params = {
    TableName: Table.Product3.tableName,
    Item: {
      id: randomUUID(),
      name,
      price,
      category,
      imageUrl,
    },
  };

  const command = new PutCommand(params);

  await client
    .send(command)
    .then((data) => console.log(data))
    .catch((error) => console.error(error));
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Product created" }),
  };
});

export const list = ApiHandler(async (_evt) => {
  const data = JSON.parse(_evt.body);
  console.log(data);
  const { category } = data;
  const client = new DynamoDBClient({});
  const dynamodb: DynamoDBDocumentClient = DynamoDBDocumentClient.from(client);

  let command = new ScanCommand({
    TableName: Table.Product3.tableName,
  });

  if (category !== "all") {
    command = new ScanCommand({
      TableName: Table.Product3.tableName,
      IndexName: "categoryIndex",
      FilterExpression: "category = :category",
      ExpressionAttributeValues: {
        ":category": category,
      },
    });
  }

  const list = await dynamodb
    .send(command)
    .then((data) => {
      // console.log(data);
      return data.Items;
    })
    .catch((error) => console.error(error));

  return {
    statusCode: 200,
    body: JSON.stringify(list),
  };
});

export const del = ApiHandler(async (_evt) => {
  const id = _evt.pathParameters.id;
  console.log("id", id);

  const client = new DynamoDBClient({});
  const dynamodb: DynamoDBDocumentClient = DynamoDBDocumentClient.from(client);
  const command = new DeleteCommand({
    TableName: Table.Product3.tableName,
    Key: { id: id + "" },
  });

  await dynamodb
    .send(command)
    .then((data) => console.log(data))
    .catch((error) => console.error(error));
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Product deleted" }),
  };
});
