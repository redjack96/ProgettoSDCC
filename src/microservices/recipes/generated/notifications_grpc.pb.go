// Code generated by protoc-gen-go-grpc. DO NOT EDIT.
// versions:
// - protoc-gen-go-grpc v1.2.0
// - protoc             v3.6.1
// source: notifications.proto

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

// NotificationClient is the client API for Notification service.
//
// For semantics around ctx use and closing/ending streaming RPCs, please refer to https://pkg.go.dev/google.golang.org/grpc/?tab=doc#ClientConn.NewStream.
type NotificationClient interface {
	NotifyDeadline(ctx context.Context, in *Product, opts ...grpc.CallOption) (*Response, error)
	NotifyRunOut(ctx context.Context, in *Product, opts ...grpc.CallOption) (*Response, error)
}

type notificationClient struct {
	cc grpc.ClientConnInterface
}

func NewNotificationClient(cc grpc.ClientConnInterface) NotificationClient {
	return &notificationClient{cc}
}

func (c *notificationClient) NotifyDeadline(ctx context.Context, in *Product, opts ...grpc.CallOption) (*Response, error) {
	out := new(Response)
	err := c.cc.Invoke(ctx, "/notifications.Notification/NotifyDeadline", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *notificationClient) NotifyRunOut(ctx context.Context, in *Product, opts ...grpc.CallOption) (*Response, error) {
	out := new(Response)
	err := c.cc.Invoke(ctx, "/notifications.Notification/NotifyRunOut", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

// NotificationServer is the server API for Notification service.
// All implementations must embed UnimplementedNotificationServer
// for forward compatibility
type NotificationServer interface {
	NotifyDeadline(context.Context, *Product) (*Response, error)
	NotifyRunOut(context.Context, *Product) (*Response, error)
	mustEmbedUnimplementedNotificationServer()
}

// UnimplementedNotificationServer must be embedded to have forward compatible implementations.
type UnimplementedNotificationServer struct {
}

func (UnimplementedNotificationServer) NotifyDeadline(context.Context, *Product) (*Response, error) {
	return nil, status.Errorf(codes.Unimplemented, "method NotifyDeadline not implemented")
}
func (UnimplementedNotificationServer) NotifyRunOut(context.Context, *Product) (*Response, error) {
	return nil, status.Errorf(codes.Unimplemented, "method NotifyRunOut not implemented")
}
func (UnimplementedNotificationServer) mustEmbedUnimplementedNotificationServer() {}

// UnsafeNotificationServer may be embedded to opt out of forward compatibility for this service.
// Use of this interface is not recommended, as added methods to NotificationServer will
// result in compilation errors.
type UnsafeNotificationServer interface {
	mustEmbedUnimplementedNotificationServer()
}

func RegisterNotificationServer(s grpc.ServiceRegistrar, srv NotificationServer) {
	s.RegisterService(&Notification_ServiceDesc, srv)
}

func _Notification_NotifyDeadline_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(Product)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(NotificationServer).NotifyDeadline(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/notifications.Notification/NotifyDeadline",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(NotificationServer).NotifyDeadline(ctx, req.(*Product))
	}
	return interceptor(ctx, in, info, handler)
}

func _Notification_NotifyRunOut_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(Product)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(NotificationServer).NotifyRunOut(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/notifications.Notification/NotifyRunOut",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(NotificationServer).NotifyRunOut(ctx, req.(*Product))
	}
	return interceptor(ctx, in, info, handler)
}

// Notification_ServiceDesc is the grpc.ServiceDesc for Notification service.
// It's only intended for direct use with grpc.RegisterService,
// and not to be introspected or modified (even as a copy)
var Notification_ServiceDesc = grpc.ServiceDesc{
	ServiceName: "notifications.Notification",
	HandlerType: (*NotificationServer)(nil),
	Methods: []grpc.MethodDesc{
		{
			MethodName: "NotifyDeadline",
			Handler:    _Notification_NotifyDeadline_Handler,
		},
		{
			MethodName: "NotifyRunOut",
			Handler:    _Notification_NotifyRunOut_Handler,
		},
	},
	Streams:  []grpc.StreamDesc{},
	Metadata: "notifications.proto",
}
