from jproperties import Properties


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
    ShoppingListAddress: str
    ProductStorageAddress: str
    RecipesAddress: str
    ConsumptionsAddress: str
    NotificationsAddress: str
    SummaryAddress: str
    ApiGatewayAddress: str
    FrontendAddress: str
    MongoDBAddress: str

    def __init__(self):
        configs = Properties()
        with open('app-config.properties', 'rb') as config_file:
            configs.load(config_file)
            self.ShoppingListPort = configs.get("ShoppingListPort")
            self.ProductStoragePort = configs.get("ProductStoragePort")
            self.RecipesPort = configs.get("RecipesPort")
            self.ConsumptionsPort = configs.get("ConsumptionsPort")
            self.NotificationsPort = configs.get("NotificationsPort")
            self.SummaryPort = configs.get("SummaryPort")
            self.ApiGatewayPort = configs.get("ApiGatewayPort")
            self.FrontendPort = configs.get("FrontendPort")
            self.MongoDBPort = configs.get("MongoDBPort")
            self.ShoppingListAddress = configs.get("ShoppingListAddress")
            self.ProductStorageAddress = configs.get("ProductStorageAddress")
            self.RecipesAddress = configs.get("RecipesAddress")
            self.ConsumptionsAddress = configs.get("ConsumptionsAddress")
            self.NotificationsAddress = configs.get("NotificationsAddress")
            self.SummaryAddress = configs.get("SummaryAddress")
            self.ApiGatewayAddress = configs.get("ApiGatewayAddress")
            self.FrontendAddress = configs.get("FrontendAddress")
            self.MongoDBAddress = configs.get("MongoDBAddress")
