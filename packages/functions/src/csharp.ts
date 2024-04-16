import { ApiHandler } from "sst/node/api";
import { InvokeCommand, LambdaClient } from "@aws-sdk/client-lambda";

export const categories = ApiHandler(async (_evt) => {
  const lambda = new LambdaClient();
  const cmd = new InvokeCommand({
    FunctionName: "Categories3",
    InvocationType: "RequestResponse",
    Payload: JSON.stringify("payload"),
  });
  const { Payload } = await lambda.send(cmd);
  // console.log("Payload", Payload);

  const all = JSON.parse(Buffer.from(Payload).toString());
  return {
    statusCode: 200,
    body: JSON.stringify(all),
  };
});
