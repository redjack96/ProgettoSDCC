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

// ProductStorageClient is the client API for ProductStorage service.
//
// For semantics around ctx use and closing/ending streaming RPCs, please refer to https://pkg.go.dev/google.golang.org/grpc/?tab=doc#ClientConn.NewStream.
type ProductStorageClient interface {
	AddBoughtProductToPantry(ctx context.Context, in *ProductList, opts ...grpc.CallOption) (*Response, error)
	AddProductToPantry(ctx context.Context, in *Item, opts ...grpc.CallOption) (*Response, error)
	RemoveProductFromPantry(ctx context.Context, in *ProductId, opts ...grpc.CallOption) (*Item, error)
	UpdateProductInPantry(ctx context.Context, in *ProductId, opts ...grpc.CallOption) (*Response, error)
	GetPantry(ctx context.Context, in *PantryMessage, opts ...grpc.CallOption) (*Pantry, error)
}

type productStorageClient struct {
	cc grpc.ClientConnInterface
}

func NewProductStorageClient(cc grpc.ClientConnInterface) ProductStorageClient {
	return &productStorageClient{cc}
}

func (c *productStorageClient) AddBoughtProductToPantry(ctx context.Context, in *ProductList, opts ...grpc.CallOption) (*Response, error) {
	out := new(Response)
	err := c.cc.Invoke(ctx, "/product_storage.ProductStorage/AddBoughtProductToPantry", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *productStorageClient) AddProductToPantry(ctx context.Context, in *Item, opts ...grpc.CallOption) (*Response, error) {
	out := new(Response)
	err := c.cc.Invoke(ctx, "/product_storage.ProductStorage/AddProductToPantry", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *productStorageClient) RemoveProductFromPantry(ctx context.Context, in *ProductId, opts ...grpc.CallOption) (*Item, error) {
	out := new(Item)
	err := c.cc.Invoke(ctx, "/product_storage.ProductStorage/RemoveProductFromPantry", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *productStorageClient) UpdateProductInPantry(ctx context.Context, in *ProductId, opts ...grpc.CallOption) (*Response, error) {
	out := new(Response)
	err := c.cc.Invoke(ctx, "/product_storage.ProductStorage/UpdateProductInPantry", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *productStorageClient) GetPantry(ctx context.Context, in *PantryMessage, opts ...grpc.CallOption) (*Pantry, error) {
	out := new(Pantry)
	err := c.cc.Invoke(ctx, "/product_storage.ProductStorage/GetPantry", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

// ProductStorageServer is the server API for ProductStorage service.
// All implementations must embed UnimplementedProductStorageServer
// for forward compatibility
type ProductStorageServer interface {
	AddBoughtProductToPantry(context.Context, *ProductList) (*Response, error)
	AddProductToPantry(context.Context, *Item) (*Response, error)
	RemoveProductFromPantry(context.Context, *ProductId) (*Item, error)
	UpdateProductInPantry(context.Context, *ProductId) (*Response, error)
	GetPantry(context.Context, *PantryMessage) (*Pantry, error)
	mustEmbedUnimplementedProductStorageServer()
}

// UnimplementedProductStorageServer must be embedded to have forward compatible implementations.
type UnimplementedProductStorageServer struct {
}

func (UnimplementedProductStorageServer) AddBoughtProductToPantry(context.Context, *ProductList) (*Response, error) {
	return nil, status.Errorf(codes.Unimplemented, "method AddBoughtProductToPantry not implemented")
}
func (UnimplementedProductStorageServer) AddProductToPantry(context.Context, *Item) (*Response, error) {
	return nil, status.Errorf(codes.Unimplemented, "method AddProductToPantry not implemented")
}
func (UnimplementedProductStorageServer) RemoveProductFromPantry(context.Context, *ProductId) (*Item, error) {
	return nil, status.Errorf(codes.Unimplemented, "method RemoveProductFromPantry not implemented")
}
func (UnimplementedProductStorageServer) UpdateProductInPantry(context.Context, *ProductId) (*Response, error) {
	return nil, status.Errorf(codes.Unimplemented, "method UpdateProductInPantry not implemented")
}
func (UnimplementedProductStorageServer) GetPantry(context.Context, *PantryMessage) (*Pantry, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GetPantry not implemented")
}
func (UnimplementedProductStorageServer) mustEmbedUnimplementedProductStorageServer() {}

// UnsafeProductStorageServer may be embedded to opt out of forward compatibility for this service.
// Use of this interface is not recommended, as added methods to ProductStorageServer will
// result in compilation errors.
type UnsafeProductStorageServer interface {
	mustEmbedUnimplementedProductStorageServer()
}

func RegisterProductStorageServer(s grpc.ServiceRegistrar, srv ProductStorageServer) {
	s.RegisterService(&ProductStorage_ServiceDesc, srv)
}

func _ProductStorage_AddBoughtProductToPantry_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(ProductList)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(ProductStorageServer).AddBoughtProductToPantry(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/product_storage.ProductStorage/AddBoughtProductToPantry",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(ProductStorageServer).AddBoughtProductToPantry(ctx, req.(*ProductList))
	}
	return interceptor(ctx, in, info, handler)
}

func _ProductStorage_AddProductToPantry_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(Item)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(ProductStorageServer).AddProductToPantry(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/product_storage.ProductStorage/AddProductToPantry",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(ProductStorageServer).AddProductToPantry(ctx, req.(*Item))
	}
	return interceptor(ctx, in, info, handler)
}

func _ProductStorage_RemoveProductFromPantry_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(ProductId)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(ProductStorageServer).RemoveProductFromPantry(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/product_storage.ProductStorage/RemoveProductFromPantry",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(ProductStorageServer).RemoveProductFromPantry(ctx, req.(*ProductId))
	}
	return interceptor(ctx, in, info, handler)
}

func _ProductStorage_UpdateProductInPantry_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(ProductId)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(ProductStorageServer).UpdateProductInPantry(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/product_storage.ProductStorage/UpdateProductInPantry",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(ProductStorageServer).UpdateProductInPantry(ctx, req.(*ProductId))
	}
	return interceptor(ctx, in, info, handler)
}

func _ProductStorage_GetPantry_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(PantryMessage)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(ProductStorageServer).GetPantry(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/product_storage.ProductStorage/GetPantry",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(ProductStorageServer).GetPantry(ctx, req.(*PantryMessage))
	}
	return interceptor(ctx, in, info, handler)
}

// ProductStorage_ServiceDesc is the grpc.ServiceDesc for ProductStorage service.
// It's only intended for direct use with grpc.RegisterService,
// and not to be introspected or modified (even as a copy)
var ProductStorage_ServiceDesc = grpc.ServiceDesc{
	ServiceName: "product_storage.ProductStorage",
	HandlerType: (*ProductStorageServer)(nil),
	Methods: []grpc.MethodDesc{
		{
			MethodName: "AddBoughtProductToPantry",
			Handler:    _ProductStorage_AddBoughtProductToPantry_Handler,
		},
		{
			MethodName: "AddProductToPantry",
			Handler:    _ProductStorage_AddProductToPantry_Handler,
		},
		{
			MethodName: "RemoveProductFromPantry",
			Handler:    _ProductStorage_RemoveProductFromPantry_Handler,
		},
		{
			MethodName: "UpdateProductInPantry",
			Handler:    _ProductStorage_UpdateProductInPantry_Handler,
		},
		{
			MethodName: "GetPantry",
			Handler:    _ProductStorage_GetPantry_Handler,
		},
	},
	Streams:  []grpc.StreamDesc{},
	Metadata: "product_storage.proto",
}
