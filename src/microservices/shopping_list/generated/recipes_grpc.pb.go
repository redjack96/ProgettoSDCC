// Code generated by protoc-gen-go-grpc. DO NOT EDIT.

package proto_generated

import (
	context "context"
	grpc "google.golang.org/grpc"
	codes "google.golang.org/grpc/codes"
	status "google.golang.org/grpc/status"
)

// This is a compile-time assertion to ensure that this generated file
// is compatible with the grpc package it is being compiled against.
// Requires gRPC-Go v1.32.0 or later.
const _ = grpc.SupportPackageIsVersion7

// RecipesClient is the client API for Recipes service.
//
// For semantics around ctx use and closing/ending streaming RPCs, please refer to https://pkg.go.dev/google.golang.org/grpc/?tab=doc#ClientConn.NewStream.
type RecipesClient interface {
	GetRecipesFromIngredients(ctx context.Context, in *IngredientsList, opts ...grpc.CallOption) (*RecipeList, error)
	GetRecipesFromPantry(ctx context.Context, in *EmptyRequest, opts ...grpc.CallOption) (*RecipeList, error)
}

type recipesClient struct {
	cc grpc.ClientConnInterface
}

func NewRecipesClient(cc grpc.ClientConnInterface) RecipesClient {
	return &recipesClient{cc}
}

func (c *recipesClient) GetRecipesFromIngredients(ctx context.Context, in *IngredientsList, opts ...grpc.CallOption) (*RecipeList, error) {
	out := new(RecipeList)
	err := c.cc.Invoke(ctx, "/recipes.Recipes/GetRecipesFromIngredients", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *recipesClient) GetRecipesFromPantry(ctx context.Context, in *EmptyRequest, opts ...grpc.CallOption) (*RecipeList, error) {
	out := new(RecipeList)
	err := c.cc.Invoke(ctx, "/recipes.Recipes/GetRecipesFromPantry", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

// RecipesServer is the server API for Recipes service.
// All implementations must embed UnimplementedRecipesServer
// for forward compatibility
type RecipesServer interface {
	GetRecipesFromIngredients(context.Context, *IngredientsList) (*RecipeList, error)
	GetRecipesFromPantry(context.Context, *EmptyRequest) (*RecipeList, error)
	mustEmbedUnimplementedRecipesServer()
}

// UnimplementedRecipesServer must be embedded to have forward compatible implementations.
type UnimplementedRecipesServer struct {
}

func (UnimplementedRecipesServer) GetRecipesFromIngredients(context.Context, *IngredientsList) (*RecipeList, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GetRecipesFromIngredients not implemented")
}
func (UnimplementedRecipesServer) GetRecipesFromPantry(context.Context, *EmptyRequest) (*RecipeList, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GetRecipesFromPantry not implemented")
}
func (UnimplementedRecipesServer) mustEmbedUnimplementedRecipesServer() {}

// UnsafeRecipesServer may be embedded to opt out of forward compatibility for this service.
// Use of this interface is not recommended, as added methods to RecipesServer will
// result in compilation errors.
type UnsafeRecipesServer interface {
	mustEmbedUnimplementedRecipesServer()
}

func RegisterRecipesServer(s grpc.ServiceRegistrar, srv RecipesServer) {
	s.RegisterService(&Recipes_ServiceDesc, srv)
}

func _Recipes_GetRecipesFromIngredients_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(IngredientsList)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(RecipesServer).GetRecipesFromIngredients(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/recipes.Recipes/GetRecipesFromIngredients",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(RecipesServer).GetRecipesFromIngredients(ctx, req.(*IngredientsList))
	}
	return interceptor(ctx, in, info, handler)
}

func _Recipes_GetRecipesFromPantry_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(EmptyRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(RecipesServer).GetRecipesFromPantry(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/recipes.Recipes/GetRecipesFromPantry",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(RecipesServer).GetRecipesFromPantry(ctx, req.(*EmptyRequest))
	}
	return interceptor(ctx, in, info, handler)
}

// Recipes_ServiceDesc is the grpc.ServiceDesc for Recipes service.
// It's only intended for direct use with grpc.RegisterService,
// and not to be introspected or modified (even as a copy)
var Recipes_ServiceDesc = grpc.ServiceDesc{
	ServiceName: "recipes.Recipes",
	HandlerType: (*RecipesServer)(nil),
	Methods: []grpc.MethodDesc{
		{
			MethodName: "GetRecipesFromIngredients",
			Handler:    _Recipes_GetRecipesFromIngredients_Handler,
		},
		{
			MethodName: "GetRecipesFromPantry",
			Handler:    _Recipes_GetRecipesFromPantry_Handler,
		},
	},
	Streams:  []grpc.StreamDesc{},
	Metadata: "recipes.proto",
}