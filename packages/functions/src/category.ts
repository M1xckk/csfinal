import { ApiHandler } from "sst/node/api";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, QueryCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { Table } from "sst/node/table";

const getCetogories = async () => {
  const client = new DynamoDBClient();
  const command = new ScanCommand({
    TableName: Table.Category.tableName,
  });

  return await client
    .send(command)
    .then((data) => {
      // console.log(data);
      return data.Items;
    })
    .catch((error) => console.error(error));
};

export const create = ApiHandler(async (_evt) => {
  const data = JSON.parse(_evt.body);
  console.log(data);

  const client = new DynamoDBClient();
  const params = {
    TableName: Table.Category.tableName, // 替换为你的表名
    Item: {
      name: data.name,
    },
  };

  const command = new PutCommand(params);

  client
    .send(command)
    .then((data) => console.log(data))
    .catch((error) => console.error(error));

  const list = await getCetogories();

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Category created", list }),
  };
});

export const list = ApiHandler(async (_evt) => {
  const list = await getCetogories();

  return {
    statusCode: 200,
    body: JSON.stringify(list),
  };
});
