package main

import (
	"context"
	"fmt"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
	"google.golang.org/grpc"
	"google.golang.org/protobuf/types/known/timestamppb"
	"log"
	"net"
	pb "shopping_list.microservice/generated/shopping_list.microservice/proto_generated"
	props "shopping_list.microservice/main/util"
	"strconv"
	"time"
)

type OpType int64

const (
	Insert OpType = iota
	Remove
	Update
	Select
)

type DBOperation struct {
	opType        OpType
	product       *pb.Product
	productRemove *pb.ProductRemove
	productUpdate *pb.ProductUpdate
}

//func (p Product) ToString() string {
//    return fmt.Sprintf("Product(%d, %s, %d, %s, %s)\n", p.id, p.name, p.prodType, p.expire_date, p.expire_date)
//}
//
//func (s ShoppingList) ToString() string{
//    return fmt.Sprintf("ShoppingList: %s\n%v", s.name, s.products) // %v stampa la struct senza i nomi. %+v stampa anche i nomi
//}

// this struct implements ShoppingListServer interface
type serverShoppingList struct {
	pb.UnimplementedShoppingListServer // generated by protoc. It is an Anonymous Field, with the same name as the type (pb.UnimplementedGreeterServer).
}

// TODO: Remember to add error as second return value

// AddProductToList is the function to be called remotely. It is a method of the server struct (class)
func (s *serverShoppingList) AddProductToList(ctx context.Context, product *pb.Product) (*pb.Response, error) {
	log.Printf("Received: %+v", product)
	operation := new(DBOperation)
	operation.opType = Insert
	operation.product = product
	qResult, err := queryDB(*operation)
	if err != nil {
		log.Fatalln("Error querying DB", err)
	}
	fmt.Println(qResult)
	return &pb.Response{Msg: "Ok - Product added"}, nil
}

func (s *serverShoppingList) RemoveProductFromList(ctx context.Context, productRemove *pb.ProductRemove) (*pb.Response, error) {
	log.Printf("Removing product: %s", productRemove.ProductName)
	operation := new(DBOperation)
	operation.opType = Remove
	operation.productRemove = productRemove
	qResult, err := queryDB(*operation)
	if err != nil {
		log.Fatalln("Error querying DB", err)
	}
	fmt.Println(qResult)
	return &pb.Response{Msg: "OK - Product removed"}, nil
}

func (s *serverShoppingList) UpdateProductInList(ctx context.Context, productUpdate *pb.ProductUpdate) (*pb.Response, error) {
	log.Printf("Updating field %s of product with id %s.", productUpdate.Field, productUpdate.ProductId)
	operation := new(DBOperation)
	operation.opType = Update
	operation.productUpdate = productUpdate
	qResult, err := queryDB(*operation)
	if err != nil {
		log.Fatalln("Error querying DB", err)
	}
	fmt.Println(qResult)
	return &pb.Response{Msg: "ok - product updated"}, nil
}

// TODO: questa funzione dovrebbe checkare un prodotto messo nel carrello oppure comprare tutti i prodotti
//  nel primo caso: i prodotti dovrebbero essere aggiunti e rimossi molto più spesso nel carrello, ma uno alla volta (Questa funzinoe fa questo)
//  nel secondo caso: i prodotti checkati dovrebbero essere inviati direttamente in dispensa, tutti insieme. (questo dovrebbe esser fatto da productStorage, questo microservizio fa da client)

// AddProductToCart sets the product as added to cart
func (s *serverShoppingList) AddProductToCart(ctx context.Context, product *pb.ProductUpdate) (*pb.Response, error) {
	log.Printf("Adding product to cart with id %s.", product.ProductId)
	operation := new(DBOperation)
	operation.opType = Update
	operation.productUpdate = product
	qResult, err := queryDB(*operation)
	if err != nil {
		log.Fatalln("Error querying DB", err)
	}
	fmt.Println(qResult)
	return &pb.Response{Msg: "ok - product added to cart"}, nil
}

// RemoveProductFromCart sets the product as not added to cart yet
func (s *serverShoppingList) RemoveProductFromCart(ctx context.Context, product *pb.ProductUpdate) (*pb.Response, error) {
	log.Printf("Removing product to cart with id %s.", product.ProductId)
	operation := new(DBOperation)
	operation.opType = Update
	operation.productUpdate = product
	qResult, err := queryDB(*operation)
	if err != nil {
		log.Fatalln("Error querying DB", err)
	}
	fmt.Println(qResult)
	return &pb.Response{Msg: "ok - product removed from cart"}, nil
}

func (s *serverShoppingList) GetList(_ context.Context, _ *pb.GetListRequest) (*pb.ProductList, error) {
	products := make([]*pb.Product, 0)
	operation := DBOperation{
		opType:        Select,
		product:       nil,
		productRemove: nil,
		productUpdate: nil,
	}

	// Get products collection
	res, err := queryDB(operation)
	var cursor *mongo.Cursor
	cursor = res[0].(*mongo.Cursor)
	if err == nil {
		// indice, prodotto
		for cursor.Next(context.TODO()) {
			curr := cursor.Current
			addedToCart, _ := strconv.ParseBool(curr.Lookup("addedToCart").String())
			checkedOut, _ := strconv.ParseBool(curr.Lookup("checkedOut").String())
			prod := pb.Product{
				ProductName: curr.Lookup("productName").StringValue(),
				Type:        pb.ProductType(curr.Lookup("type").Int32()), // I numeri sono salvati in mongodb come int32
				Unit:        pb.Unit(curr.Lookup("unit").Int32()),
				Quantity:    curr.Lookup("quantity").Int32(),
				AddedToCart: addedToCart,
				CheckedOut:  checkedOut,
				Expiration:  timestamppb.New(curr.Lookup("expiration").Time()),
			}
			products = append(products, &prod)
		}
	}
	x := &pb.ProductList{
		Name:     "Product List",
		Products: products,
	}
	fmt.Printf("Product List: %+v", x)
	return x, nil
}

func (s *serverShoppingList) BuyAllProductsInCart(ctx context.Context, entireList *pb.ProductList) (*pb.Response, error) {
	//log.Printf("Removing product to cart with id %s.", product.ProductId)
	return &pb.Response{Msg: "ok - all product bought and sent to pantry"}, nil
}

/* Function to query the MongoDB database */
func queryDB(operation DBOperation) ([]interface{}, error) {
	// connect mongo database
	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI("mongodb://root:example@mongo:27017"))
	if err != nil {
		panic(err)
	}
	// ping the database to check if there is a connected database
	if err := client.Ping(context.TODO(), readpref.Primary()); err != nil {
		panic(err)
	}
	// Get products collection
	prodCollection := client.Database("appdb").Collection("products")

	// complete operations
	var res []interface{}
	if operation.opType == Insert {
		// add all products to a single interface
		prod := operation.product
		prodType := prod.Type
		prodUnit := prod.Unit
		prodQuantity := prod.Quantity
		prodName := prod.ProductName
		prodInCart := prod.AddedToCart
		prodCheckedOut := prod.CheckedOut
		tmExpiry := prod.Expiration
		prodExpiry := time.Unix(tmExpiry.Seconds, 0)
		// add the elements to an interface of bson elements
		doc := bson.D{
			{"type", prodType},
			{"unit", prodUnit},
			{"expiration", prodExpiry},
			{"quantity", prodQuantity},
			{"productName", prodName},
			{"addedToCart", prodInCart},
			{"checkedOut", prodCheckedOut},
		}
		fmt.Println(doc)
		// insert the document in the collection
		results, err := prodCollection.InsertOne(context.TODO(), doc)
		// check for errors in the insertion
		if err == nil {
			res = append(res, results.InsertedID)
		}
		return res, err
	} else if operation.opType == Remove {
		prodName := operation.productRemove.ProductName
		// remove specified elements from the collection
		doc := bson.D{{"productName", prodName}}
		result, err := prodCollection.DeleteOne(context.TODO(), doc)
		if err == nil {
			res = append(res, result.DeletedCount)
		}
		return res, err
	} else if operation.opType == Update {
		idString := operation.productUpdate.ProductId
		field := operation.productUpdate.Field
		value := operation.productUpdate.Value

		id, _ := primitive.ObjectIDFromHex(idString)
		filter := bson.D{{"_id", id}}
		update := bson.D{{"$set", bson.D{{field, value}}}}
		result, err := prodCollection.UpdateOne(context.TODO(), filter, update)
		if err != nil {
			res = append(res, result.ModifiedCount)
		}
		return res, err
	} else if operation.opType == Select {
		// apply a filter
		// filter := bson.D{{"inCart", bson.D{{"$eq", "true"}}}}
		cursor, err := prodCollection.Find(
			context.TODO(),
			bson.D{},
		)
		if err != nil {
			log.Fatal(err)
		}
		res = append(res, cursor)
		return res, err
	}
	return res, nil
}

// Run in the server/ directory
// go run .\server.go
// PREREQUISITE in this folder!!: protoc --go_out generated --go-grpc_out generated shopping_list.proto
func main() {
	// Retrieve the properties from the file
	properties, _ := props.GetProperties()
	fmt.Printf("Properties %+v\n", properties)

	// Listen for incoming requests
	lis, err := net.Listen("tcp", fmt.Sprintf(":%d", properties.ShoppingListPort))
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

	// Create server
	s := grpc.NewServer()
	pb.RegisterShoppingListServer(s, &serverShoppingList{}) // this is a pointer to a newly created server struct that implements ShoppingListServer
	log.Printf("server listening at %v", lis.Addr())

	// this is like C's
	// int err;
	// if ((err = s.serve(lis) != ERROR_CONSTANT) {}
	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
