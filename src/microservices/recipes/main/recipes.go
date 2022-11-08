package main

import (
	"fmt"
	"google.golang.org/grpc"
	"log"
	"net"
	pb "recipes.microservice/generated"
	props "recipes.microservice/main/util"
)

type serverRecipes struct {
	pb.UnimplementedShoppingListServer // generated by protoc. It is an Anonymous Field, with the same name as the type (pb.UnimplementedGreeterServer).
}

//protoc --proto_path ../../proto --go_out generated --go-grpc_out generated ../../proto/*.proto
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
	pb.RegisterShoppingListServer(s, &serverRecipes{}) // this is a pointer to a newly created server struct that implements ShoppingListServer
	log.Printf("server listening at %v", lis.Addr())

	// this is like C's
	// int err;
	// if ((err = s.serve(lis) != ERROR_CONSTANT) {}
	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
	fmt.Println("here we give hints. What do you need more?")
}