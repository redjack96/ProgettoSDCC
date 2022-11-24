package main

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/go-redis/redis/v8"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
	"io/ioutil"
	"log"
	"net"
	"net/http"
	pb "recipes.microservice/generated"
	props "recipes.microservice/main/util"
	"strconv"
	"time"
)

var rediCli *redis.Client
var ctx context.Context

// GeneralInfo contains the data of the recipes
type GeneralInfo struct {
	Id                int          `json:"id,omitempty"`
	Title             string       `json:"title,omitempty"`
	MissedIngredients []Ingredient `json:"missedIngredients,omitempty"`
	UsedIngredients   []Ingredient `json:"usedIngredients,omitempty"`
	Likes             int          `json:"likes,omitempty"`
	Image             string       `json:"image,omitempty"`
}

// UrlInfo contains the url of the recipe
type UrlInfo struct {
	Url string `json:"spoonacularSourceUrl,omitempty"`
}

type Ingredient struct {
	Name string `json:"name,omitempty"`
}

// this struct implements RecipesServer interface
type serverRecipes struct {
	pb.UnimplementedRecipesServer // generated by protoc. It is an Anonymous Field, with the same name as the type (pb.UnimplementedGreeterServer).
}

// utility function to retrieve the recipes from spoonacular given the comma separated products
func getRecipesFromSpoonacular(products string) []*pb.Recipe {
	// Query Spoonacular API using the str
	recipeGeneral := getFromAPI("https://api.spoonacular.com/recipes/findByIngredients" +
		"?apiKey=053dc1707c6d4a9aa63b246bb543cc1d" +
		"&ingredients=" + products + "") // minimize missing ingredients
	generalList := unmarshalToListGeneralInfo(recipeGeneral)
	urlList := unmarshalToUrlInfo(generalList)
	recipes := convertToProtobuf(generalList, urlList)
	log.Printf("recipes list: %v", recipes)
	return recipes
}

// GetRecipesFromIngredients first gRPC function, gets the possible recipes from a list of ingredients
func (s *serverRecipes) GetRecipesFromIngredients(_ context.Context, ingredients *pb.IngredientsList) (*pb.RecipeList, error) {
	var joinedProducts = ""
	for _, item := range ingredients.IngredientsList {
		joinedProducts += item.Name + ","
	}

	recipes := getRecipesFromSpoonacular(joinedProducts)

	x := &pb.RecipeList{
		Recipes: recipes,
	}
	return x, nil
}

// GetRecipesFromPantry second gRPC function, gets the recipes for the available item in pantry
func (s *serverRecipes) GetRecipesFromPantry(_ context.Context, _ *pb.RecipesRequest) (*pb.RecipeList, error) {
	// Call GetPantry of StorageService to retrieve available products
	properties, _ := props.GetProperties()
	productStorageAddr := properties.ProductStorageAddress + ":" + strconv.Itoa(properties.ProductStoragePort)
	conn, err := grpc.Dial(productStorageAddr, grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		log.Fatalln("Error connecting to ProductStorageService", err)
		return nil, err
	}
	client := pb.NewProductStorageClient(conn)
	pantry, err := client.GetPantry(context.Background(), &pb.PantryMessage{})
	log.Printf("pantry: %v", pantry)

	// Get only available and not expired products from pantry
	products := pantry.GetProducts()
	available := make([]*pb.Item, 0)
	ts := time.Now()
	for i := range products {
		item := products[i]
		isAvailable := item.Quantity != 0
		notExpired := int(item.Expiration.Seconds) >= ts.Second()
		if isAvailable && notExpired {
			available = append(available, item)
		}
	}
	// Append all available items to single string
	str := appendToSingleString(available)
	// Query Spoonacular API using the str
	recipes := getRecipesFromSpoonacular(str)

	// Return recipes list
	x := &pb.RecipeList{
		Recipes: recipes,
	}
	return x, nil
}

// converts the arrays of struct into an array of protobuf.Recipe pointers
func convertToProtobuf(generals []GeneralInfo, urls []UrlInfo) []*pb.Recipe {
	recipes := make([]*pb.Recipe, 0)
	missedRes := make([]*pb.Ingredient, 0)
	usedRes := make([]*pb.Ingredient, 0)
	for i := range generals {
		generalInfo := generals[i]
		url := urls[i].Url
		title := generalInfo.Title
		missed := generalInfo.MissedIngredients
		id := generalInfo.Id
		image := generalInfo.Image
		for missedIndex := range missed {
			m := missed[missedIndex]
			missedRes = append(missedRes, &pb.Ingredient{Name: m.Name})
		}
		used := generalInfo.UsedIngredients
		for usedIndex := range used {
			u := used[usedIndex]
			usedRes = append(usedRes, &pb.Ingredient{Name: u.Name})
		}
		recipe := &pb.Recipe{
			Id:                strconv.Itoa(id),
			Title:             title,
			Url:               url,
			Img:               image,
			UsedIngredients:   usedRes,
			MissedIngredients: missedRes,
		}
		recipes = append(recipes, recipe)
	}
	return recipes
}

// getFromAPI retrieves the recipes from Redis, if are present otherwise loads them
// from spoonacular and saves immediately to Redis. Then returns the recipes as an array of bytes
func getFromAPI(apiURL string) []byte {
	// try to get element from cache, else ask remote API
	cached := getEntryFromRedis(apiURL)
	if cached == "" {
		// ask remote API
		response, err := http.Get(apiURL)
		if err != nil {
			fmt.Print(err.Error())
		}
		responseData, err := ioutil.ReadAll(response.Body)
		if err != nil {
			log.Fatal(err)
		}
		// add element in cache for future requests
		setEntryInRedis(apiURL, responseData)
		return responseData
	}
	return []byte(cached)
}

// unmarshalToListGeneralInfo converts the byte array representing the recieps into an array of GeneralInfo
func unmarshalToListGeneralInfo(responseData []byte) []GeneralInfo {
	var response []GeneralInfo
	err := json.Unmarshal(responseData, &response)
	if err != nil {
		log.Fatal(err)
	}
	return response
}

// unmarshalToUrlInfo converts the GeneralInfo array into an UrlInfo array
func unmarshalToUrlInfo(recipeList []GeneralInfo) []UrlInfo {
	resList := make([]UrlInfo, 0)
	for i := range recipeList {
		var response UrlInfo
		id := recipeList[i].Id
		responseData := getFromAPI("https://api.spoonacular.com/recipes/" + strconv.Itoa(id) + "/information" +
			"?apiKey=053dc1707c6d4a9aa63b246bb543cc1d")
		err := json.Unmarshal(responseData, &response)
		if err != nil {
			log.Fatal(err)
		}
		resList = append(resList, response)
	}
	return resList
}

// appendToSingleString appends all the item names in a single comma separated string
func appendToSingleString(availableItems []*pb.Item) string {
	var finalStr = ""
	for i := range availableItems {
		item := availableItems[i]
		finalStr += item.ItemName + ","
	}
	return finalStr
}

// connects to the redis container
func connectToRedis() (context.Context, *redis.Client) {
	ctx := context.Background()

	rdb := redis.NewClient(&redis.Options{
		Addr:     "redis-cache:6379",
		Password: "", // no password set
		DB:       0,  // use default DB
	})

	pong, err := rdb.Ping(ctx).Result()
	fmt.Println(pong, err)
	return ctx, rdb
}

func setEntryInRedis(key string, value []byte) {
	// we can call set with a `Key` and a `Value`.
	expiration := time.Duration.Hours(48)
	err := rediCli.Set(ctx, key, value, time.Duration(expiration)).Err()
	// if there has been an error setting the value
	// handle the error
	if err != nil {
		fmt.Println(err)
	}
}

func getEntryFromRedis(key string) string {
	val, err := rediCli.Get(ctx, key).Result()
	if err != nil {
		fmt.Println(err)
		return ""
	}
	fmt.Println(val)
	return val
}

//protoc --proto_path ../../proto --go_out generated --go-grpc_out generated ../../proto/*.proto
func main() {
	// Retrieve the properties from the file
	properties, _ := props.GetProperties()
	fmt.Printf("Properties %+v\n", properties)
	var err error

	ctx, rediCli = connectToRedis()

	// Listen for incoming requests
	lis, err := net.Listen("tcp", fmt.Sprintf(":%d", properties.RecipesPort))
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

	// Create server
	s := grpc.NewServer()
	pb.RegisterRecipesServer(s, &serverRecipes{}) // this is a pointer to a newly created server struct that implements ShoppingListServer
	log.Printf("server listening at %v", lis.Addr())

	// this is like C's
	// int err;
	// if ((err = s.serve(lis) != ERROR_CONSTANT) {}
	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
	fmt.Println("here we give hints. What do you need more?")
}
