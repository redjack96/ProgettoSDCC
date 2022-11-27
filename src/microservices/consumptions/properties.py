from jproperties import Properties


# loads the config.properties file
class Props:
    ShoppingListPort: int
    ProductStoragePort: int
    RecipesPort: int
    ConsumptionsPort: int
    NotificationsPort: int
    SummaryPort: int
    ApiGatewayPort: int
    FrontendPort: int
    MongoDBPort: int
    CassandraPort: int
    RedisNotificationsPort: int
    RedisRecipesPort: int
    InfluxPort: int
    KafkaPort: int
    ShoppingListAddress: str
    ProductStorageAddress: str
    RecipesAddress: str
    ConsumptionsAddress: str
    NotificationsAddress: str
    SummaryAddress: str
    ApiGatewayAddress: str
    FrontendAddress: str
    MongoDBAddress: str
    CassandraAddress: str
    RedisNotificationsAddress: str
    RedisRecipesAddress: str
    InfluxAddress: str
    KafkaAddress: str

    def __init__(self):
        configs = Properties()
        with open('config.properties', 'rb') as config_file:
            configs.load(config_file, "utf-8")
            self.ShoppingListPort = configs.get("ShoppingListPort")[0]
            self.ProductStoragePort = configs.get("ProductStoragePort")[0]
            self.RecipesPort = configs.get("RecipesPort")[0]
            self.ConsumptionsPort = configs.get("ConsumptionsPort")[0]
            self.NotificationsPort = configs.get("NotificationsPort")[0]
            self.SummaryPort = configs.get("SummaryPort")[0]
            self.ApiGatewayPort = configs.get("ApiGatewayPort")[0]
            self.FrontendPort = configs.get("FrontendPort")[0]
            self.MongoDBPort = configs.get("MongoDBPort")[0]
            self.CassandraPort = configs.get("CassandraPort")[0]
            self.RedisNotificationsPort = configs.get("RedisNotificationsPort")[0]
            self.RedisRecipesPort = configs.get("RedisRecipesPort")[0]
            self.InfluxPort = configs.get("InfluxPort")[0]
            self.KafkaPort = configs.get("KafkaPort")[0]
            self.ShoppingListAddress = configs.get("ShoppingListAddress")[0]
            self.ProductStorageAddress = configs.get("ProductStorageAddress")[0]
            self.RecipesAddress = configs.get("RecipesAddress")[0]
            self.ConsumptionsAddress = configs.get("ConsumptionsAddress")[0]
            self.NotificationsAddress = configs.get("NotificationsAddress")[0]
            self.SummaryAddress = configs.get("SummaryAddress")[0]
            self.ApiGatewayAddress = configs.get("ApiGatewayAddress")[0]
            self.FrontendAddress = configs.get("FrontendAddress")[0]
            self.MongoDBAddress = configs.get("MongoDBAddress")[0]
            self.CassandraAddress = configs.get("CassandraAddress")[0]
            self.RedisNotificationsAddress = configs.get("RedisNotificationsAddress")[0]
            self.RedisRecipesAddress = configs.get("RedisRecipesAddress")[0]
            self.InfluxAddress = configs.get("InfluxAddress")[0]
            self.KafkaAddress = configs.get("KafkaAddress")[0]
