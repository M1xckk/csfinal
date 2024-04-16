using Amazon.Lambda.Core;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;

// Assembly attribute to enable the Lambda function's JSON input to be converted into a .NET class.
[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.SystemTextJson.DefaultLambdaJsonSerializer))]

namespace Categories;

public class Function
{

    /// <summary>
    /// A simple function that takes a string and does a ToUpper
    /// </summary>
    /// <param name="input">The event for the Lambda function handler to process.</param>
    /// <param name="context">The ILambdaContext that provides methods for logging and describing the Lambda environment.</param>
    /// <returns></returns>
    public Task<List<Category>> FunctionHandler(string input, ILambdaContext context)
    {
        AmazonDynamoDBConfig clientConfig = new AmazonDynamoDBConfig();
        AmazonDynamoDBClient client = new AmazonDynamoDBClient(clientConfig);
        DynamoDBContext dynamoDbContext = new DynamoDBContext(client);
        return Task.FromResult(dynamoDbContext.FromScanAsync<Category>(new Amazon.DynamoDBv2.DocumentModel.ScanOperationConfig()).GetRemainingAsync().Result);
    }
}

[DynamoDBTable("csfinal-products-240404-Category")]
public class Category
{
    [DynamoDBHashKey]
    public string name { get; set; }
}