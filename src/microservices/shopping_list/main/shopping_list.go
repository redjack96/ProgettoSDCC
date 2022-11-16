package main

import (
	"context"
	"errors"
	"fmt"
	"github.com/afex/hystrix-go/hystrix"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
	"google.golang.org/protobuf/types/known/timestamppb"
	"log"
	"net"
	pb "shoppinglist.microservice/generated"
	props "shoppinglist.microservice/main/util"
	"strconv"
	"time"
)

type OpType int64

const (
	Insert OpType = iota
	Remove
	Update
	Select
	Buy
	AddToCart
	RemoveFromCart
)

type DBOperation struct {
	opType        OpType
	product       *pb.Product
	productRemove *pb.ProductRemove
	productUpdate *pb.ProductUpdate // Warning here we have optional data (nil pointers)
	productKey    *pb.ProductKey
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

// AddProductToList is the function to be called remotely. It is a method of the server struct (class)
func (s *serverShoppingList) AddProductToList(ctx context.Context, product *pb.Product) (*pb.Response, error) {
	log.Printf("Received: %+v", product)
	// Due prodotti uguali saranno aggiunti alla lista, per ora...
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

func (s *serverShoppingList) RemoveProductFromList(_ context.Context, productKey *pb.ProductKey) (*pb.Response, error) {
	log.Printf("Removing product: %s", productKey.ProductName)
	operation := new(DBOperation)
	operation.opType = Remove
	operation.productKey = productKey
	qResult, err := queryDB(*operation)
	if err != nil {
		log.Fatalln("Error querying DB", err)
	}
	fmt.Println(qResult)
	if qResult.(int64) > 0 {
		return &pb.Response{Msg: "OK - Product " + productKey.ProductName + " removed"}, nil
	} else {
		msg := fmt.Sprintf("no product found with name %s type %s (%d) and unit %s (%d)",
			productKey.ProductName,
			pb.ProductType(productKey.ProductType).String(), pb.ProductType(productKey.ProductType),
			pb.Unit(productKey.ProductUnit).String(), pb.Unit(productKey.ProductUnit))
		return &pb.Response{Msg: msg}, nil
	}
}

func (s *serverShoppingList) UpdateProductInList(ctx context.Context, productUpdate *pb.ProductUpdate) (*pb.Response, error) {
	log.Printf("Updating product %v", productUpdate)
	operation := new(DBOperation)
	operation.opType = Update
	operation.productUpdate = productUpdate
	qResult, err := queryDB(*operation)
	if err != nil {
		log.Fatalln("Error updating DB", err)
	}
	fmt.Println(qResult)
	return &pb.Response{Msg: "ok - product updated"}, nil
}

// AddProductToCart sets the product as added to cart
func (s *serverShoppingList) AddProductToCart(ctx context.Context, productKey *pb.ProductKey) (*pb.Response, error) {
	log.Printf("Adding product %s to cart.", productKey.ProductName)
	operation := new(DBOperation)
	operation.opType = AddToCart
	operation.productKey = productKey
	qResult, err := queryDB(*operation)
	if err != nil {
		log.Fatalln("Error querying DB", err)
	}
	fmt.Println(qResult)

	if qResult.(int64) > 0 {
		msg := fmt.Sprintf("ok - product %s added to cart", productKey.ProductName)
		return &pb.Response{Msg: msg}, nil
	} else {
		msg := fmt.Sprintf("no product found with name %s type %s (%d) and unit %s (%d)",
			productKey.ProductName,
			pb.ProductType(productKey.ProductType).String(), pb.ProductType(productKey.ProductType),
			pb.Unit(productKey.ProductUnit).String(), pb.Unit(productKey.ProductUnit))
		return &pb.Response{Msg: msg}, nil
	}
}

// RemoveProductFromCart sets the product as not added to cart yet
func (s *serverShoppingList) RemoveProductFromCart(ctx context.Context, productKey *pb.ProductKey) (*pb.Response, error) {
	log.Printf("Removing product %s from cart.", productKey.ProductName)
	operation := new(DBOperation)
	operation.opType = RemoveFromCart
	operation.productKey = productKey
	qResult, err := queryDB(*operation)
	if err != nil {
		log.Fatalln("Error querying DB", err)
	}
	fmt.Println(qResult)

	if qResult.(int64) > 0 {
		msg := fmt.Sprintf("ok - product %s removed from cart", productKey.ProductName)
		return &pb.Response{Msg: msg}, nil
	} else {
		msg := fmt.Sprintf("no product found with name %s type %s and unit %s", productKey.ProductName, pb.ProductType(productKey.ProductType).String(), pb.Unit(productKey.ProductUnit).String())
		return &pb.Response{Msg: msg}, nil
	}
}

func (s *serverShoppingList) GetList(_ context.Context, _ *pb.GetListRequest) (*pb.ProductList, error) {
	products := make([]*pb.Product, 0)
	operation := DBOperation{
		opType:        Select,
		product:       nil,
		productRemove: nil,
		productKey:    nil,
	}

	// Get products collection
	res, err := queryDB(operation)
	var cursor *mongo.Cursor
	cursor = res.(*mongo.Cursor)
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
				Expiration:  props.ToOurTimestamp(timestamppb.New(curr.Lookup("expiration").Time())),
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

func (s *serverShoppingList) BuyAllProductsInCart(ctx context.Context, _ *pb.BuyRequest) (*pb.Response, error) {
	log.Printf("\nBuying all products in cart...\n")

	onlyInCart := make([]*pb.Product, 0)
	entireList, _ := s.GetList(ctx, &pb.GetListRequest{})
	for i := 0; i < len(entireList.Products); i++ {
		prod := entireList.Products[i]
		if prod.AddedToCart {
			onlyInCart = append(onlyInCart, prod)
		}
	}

	fmt.Println("\nConnecting with product storage to store items")
	// make a channel to get the output of the hystrix go-routine and implement circuit-breaker pattern
	outputConn := make(chan *grpc.ClientConn)
	errConn := hystrix.Go("connect shopping list to product storage", func() error {
		// establish connection to product storage
		properties, _ := props.GetProperties()
		productStorageAddress := fmt.Sprintf("%s:%d", properties.ProductStorageAddress, properties.ProductStoragePort)
		conn, err := grpc.Dial(productStorageAddress, grpc.WithTransportCredentials(insecure.NewCredentials()))
		if err != nil {
			// send to main thread nothing
			outputConn <- nil
			return err
		}
		// send to main thread the connection
		outputConn <- conn
		return nil
	}, func(err error) error {
		// this is executed when service are down
		log.Println("Product storage down")
		return err
	})
	// waits until connection is established or a failure is detected
	conn := <-outputConn
	if conn == nil {
		// waits until error is sent by hystrix go-routine.
		return nil, <-errConn
	}
	defer func(conn *grpc.ClientConn) {
		err := conn.Close()
		if err != nil {
			log.Fatalf("cannot close connection: %v", err)
		}
	}(conn) // runs immediately this function (like in JavaScript, we have '()'), with conn as parameter at the end of the main function.

	// pb stand for ProtocolBuffer
	c := pb.NewProductStorageClient(conn)
	fmt.Println(c)
	// Contact server and print out its response; cancel is a function

	fmt.Println("Sending products to pantry")
	outputMsg := make(chan *pb.Response)
	hystrix.Go("sending products to product storage", func() error {
		r, err := c.AddBoughtProductsToPantry(context.TODO(), &pb.ProductList{
			Id:       entireList.Id,
			Name:     entireList.Name,
			Products: onlyInCart,
		})
		outputMsg <- r
		return err
	}, func(err error) error {
		fmt.Println("Impossible to send product to pantry. Product storage is down")
		outputMsg <- nil
		return err
	})
	r := <-outputMsg
	if r == nil {
		theErr := errors.New("product storage service is down")
		return &pb.Response{Msg: "could not add bought items to Pantry"}, theErr
	}
	log.Printf("Response received: %s", r.Msg)
	// Remove products from cart in mongodb
	operation := new(DBOperation)
	operation.opType = Buy
	qResult, err := queryDB(*operation)
	if err != nil {
		log.Fatalln("Error querying DB", err)
	}
	fmt.Printf("Removed %d elements from shopping list", qResult)
	return &pb.Response{Msg: "ok - all product bought and sent to pantry"}, nil
}

/* Function to query the MongoDB database */
func queryDB(operation DBOperation) (interface{}, error) {
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
	var res interface{}
	switch operation.opType {
	case Insert: // this inserts one product at a time in the list
		// retrieve information of product from api_gateway
		prod := operation.product
		prodType := prod.Type
		prodUnit := prod.Unit
		prodQuantity := prod.Quantity
		prodName := prod.ProductName
		prodInCart := prod.AddedToCart
		prodCheckedOut := prod.CheckedOut
		tmExpiry := prod.Expiration
		prodExpiry := time.Unix(tmExpiry.Seconds, 0)
		// check if product, unit, type is already in the list.
		filter := bson.D{
			{"productName", bson.D{{"$eq", prodName}}},
			{"unit", bson.D{{"$eq", prodUnit}}},
			{"type", bson.D{{"$eq", prodType}}},
		}
		cursor, err := prodCollection.Find(
			context.TODO(),
			filter,
		)
		if err != nil {
			log.Fatal(err)
		}
		fmt.Println()
		if cursor.RemainingBatchLength() == 0 {
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
			fmt.Println("Added for the first time: ", doc)
			// insert the document in the collection
			results, err := prodCollection.InsertOne(context.TODO(), doc)
			// check for errors in the insertion
			if err == nil {
				res = results.InsertedID
			}
			return res, err
		} else {
			fmt.Println("Updating quantity and nearest expiration of already added product")
			filter := bson.M{"$and": []interface{}{
				bson.M{"productName": prodName},
				bson.M{"type": prodType},
				bson.M{"unit": prodUnit},
			}}
			// if the new expiration is before the saved one, we update also the expiration
			var update bson.D
			cursor.Next(context.TODO())
			if prodExpiry.Unix() < cursor.Current.Lookup("expiration").Time().Unix() {
				update = bson.D{
					{"$set", bson.D{{"expiration", prodExpiry}}},
					{"$set", bson.D{{"quantity", cursor.Current.Lookup("quantity").Int32() + prodQuantity}}},
				}
			} else {
				update = bson.D{
					{"$set", bson.D{{"quantity", cursor.Current.Lookup("quantity").Int32() + prodQuantity}}},
				}
			}

			res, err := prodCollection.UpdateOne(context.TODO(), filter, update)
			return res, err
		}
	case Remove:
		prodName := operation.productKey.ProductName
		prodType := operation.productKey.ProductType
		prodUnit := operation.productKey.ProductUnit
		// remove specified elements from the collection
		filter := bson.M{"$and": []interface{}{
			bson.M{"productName": prodName},
			bson.M{"type": prodType},
			bson.M{"unit": prodUnit},
		}}
		result, err := prodCollection.DeleteMany(context.TODO(), filter)
		if err == nil {
			res = result.DeletedCount
		}
		return res, err
	case Update:
		prod := operation.productUpdate
		prodType := prod.Type
		prodUnit := prod.Unit
		prodQuantity := prod.Quantity
		prodName := prod.Name
		stringExpiry := prod.Expiration

		fmt.Println("Updating quantity and expiration of already added product")
		filter := bson.M{"$and": []interface{}{
			bson.M{"productName": prodName},
			bson.M{"type": prodType},
			bson.M{"unit": prodUnit},
		}}
		var update bson.D
		var timeExpiry time.Time
		var errata error
		layout := "2006-01-02 15:04:05 -0700"
		if stringExpiry != nil {
			timeExpiry, errata = time.Parse(layout, *stringExpiry+" 00:00:00 +0100")
			if errata != nil {
				fmt.Println(errata)
				return nil, errata
			}
		}

		if stringExpiry != nil && prodQuantity != nil {
			update = bson.D{
				{"$set", bson.D{{"expiration", timeExpiry}}},
				{"$set", bson.D{{"quantity", prodQuantity}}},
			}
		} else if stringExpiry != nil {
			update = bson.D{
				{"$set", bson.D{{"expiration", timeExpiry}}},
			}
		} else if prodQuantity != nil {
			update = bson.D{
				{"$set", bson.D{{"quantity", prodQuantity}}},
			}
		} else {
			fmt.Println("The product has not been updated!")
			return nil, nil
		}
		return prodCollection.UpdateOne(context.TODO(), filter, update)
	case Select:
		// apply a filter
		// filter := bson.D{{"inCart", bson.D{{"$eq", "true"}}}}
		cursor, err := prodCollection.Find(
			context.TODO(),
			bson.D{},
		)
		if err != nil {
			log.Fatal(err)
		}
		res = cursor
		return res, err
	case AddToCart:
		// Buy product (delete all in cart)
		var pName = operation.productKey.ProductName
		var pType = operation.productKey.ProductType
		var pUnit = operation.productKey.ProductUnit
		// filter out the product based on its key (productName, type and unit)
		filter := bson.M{"$and": []interface{}{
			bson.M{"productName": pName},
			bson.M{"type": pType},
			bson.M{"unit": pUnit},
		}}
		update := bson.D{{"$set", bson.D{{"addedToCart", true}}}}
		fmt.Println("setting addedToCart = true for the product " + pName)

		result, err := prodCollection.UpdateOne(context.TODO(), filter, update)
		if err != nil {
			fmt.Println("Error in adding to cart the item")
			return nil, err
		}

		res = result.ModifiedCount
		if res == 0 {
			fmt.Println("Product not found or already added to cart")
		} else {
			fmt.Println("Added product to cart: " + pName)
		}
		return res, nil
	case RemoveFromCart:
		// Buy product (delete all in cart)
		var pName = operation.productKey.ProductName
		var pType = operation.productKey.ProductType
		var pUnit = operation.productKey.ProductUnit
		// filter out the product based on its key (productName, type and unit)
		filter := bson.M{"$and": []interface{}{
			bson.M{"productName": pName},
			bson.M{"type": pType},
			bson.M{"unit": pUnit},
		}}
		update := bson.D{{"$set", bson.D{{"addedToCart", false}}}}
		fmt.Println("setting addedToCart = false for the product " + pName)
		result, err := prodCollection.UpdateOne(context.TODO(), filter, update)
		if err != nil {
			fmt.Println("Error in removing from cart the item")
			return nil, err
		}

		res = result.ModifiedCount
		if res == 0 {
			fmt.Println("Product not found or already removed from cart")
		} else {
			fmt.Println("Removed product from cart: " + pName)
		}
		return res, err
	case Buy:
		// Buy product (delete all in cart)
		fmt.Println("Deleting all products in cart...")
		filter := bson.D{{"addedToCart", true}} // removes all products added to cart
		result, err := prodCollection.DeleteMany(context.TODO(), filter)
		if err == nil {
			res = result.DeletedCount
		}
		return res, err
	default:
		return res, nil
	}
}

// Run in the server/ directory
// go run .\server.go
// PREREQUISITE in this folder!!: protoc --proto_path ../../proto --go_out generated --go-grpc_out generated ../../proto/*.proto --experimental_allow_proto3_optional
func main() {
	fmt.Println("Let's go shopping!")
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
