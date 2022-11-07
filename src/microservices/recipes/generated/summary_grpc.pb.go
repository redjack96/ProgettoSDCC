// Code generated by protoc-gen-go-grpc. DO NOT EDIT.
// versions:
// - protoc-gen-go-grpc v1.2.0
// - protoc             v3.6.1
// source: summary.proto

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

// SummaryClient is the client API for Summary service.
//
// For semantics around ctx use and closing/ending streaming RPCs, please refer to https://pkg.go.dev/google.golang.org/grpc/?tab=doc#ClientConn.NewStream.
type SummaryClient interface {
	WeekSummary(ctx context.Context, in *SummaryRequest, opts ...grpc.CallOption) (*SummaryData, error)
	MonthSummary(ctx context.Context, in *SummaryRequest, opts ...grpc.CallOption) (*SummaryData, error)
	TotalSummary(ctx context.Context, in *SummaryRequest, opts ...grpc.CallOption) (*SummaryData, error)
}

type summaryClient struct {
	cc grpc.ClientConnInterface
}

func NewSummaryClient(cc grpc.ClientConnInterface) SummaryClient {
	return &summaryClient{cc}
}

func (c *summaryClient) WeekSummary(ctx context.Context, in *SummaryRequest, opts ...grpc.CallOption) (*SummaryData, error) {
	out := new(SummaryData)
	err := c.cc.Invoke(ctx, "/summary.Summary/WeekSummary", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *summaryClient) MonthSummary(ctx context.Context, in *SummaryRequest, opts ...grpc.CallOption) (*SummaryData, error) {
	out := new(SummaryData)
	err := c.cc.Invoke(ctx, "/summary.Summary/MonthSummary", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *summaryClient) TotalSummary(ctx context.Context, in *SummaryRequest, opts ...grpc.CallOption) (*SummaryData, error) {
	out := new(SummaryData)
	err := c.cc.Invoke(ctx, "/summary.Summary/TotalSummary", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

// SummaryServer is the server API for Summary service.
// All implementations must embed UnimplementedSummaryServer
// for forward compatibility
type SummaryServer interface {
	WeekSummary(context.Context, *SummaryRequest) (*SummaryData, error)
	MonthSummary(context.Context, *SummaryRequest) (*SummaryData, error)
	TotalSummary(context.Context, *SummaryRequest) (*SummaryData, error)
	mustEmbedUnimplementedSummaryServer()
}

// UnimplementedSummaryServer must be embedded to have forward compatible implementations.
type UnimplementedSummaryServer struct {
}

func (UnimplementedSummaryServer) WeekSummary(context.Context, *SummaryRequest) (*SummaryData, error) {
	return nil, status.Errorf(codes.Unimplemented, "method WeekSummary not implemented")
}
func (UnimplementedSummaryServer) MonthSummary(context.Context, *SummaryRequest) (*SummaryData, error) {
	return nil, status.Errorf(codes.Unimplemented, "method MonthSummary not implemented")
}
func (UnimplementedSummaryServer) TotalSummary(context.Context, *SummaryRequest) (*SummaryData, error) {
	return nil, status.Errorf(codes.Unimplemented, "method TotalSummary not implemented")
}
func (UnimplementedSummaryServer) mustEmbedUnimplementedSummaryServer() {}

// UnsafeSummaryServer may be embedded to opt out of forward compatibility for this service.
// Use of this interface is not recommended, as added methods to SummaryServer will
// result in compilation errors.
type UnsafeSummaryServer interface {
	mustEmbedUnimplementedSummaryServer()
}

func RegisterSummaryServer(s grpc.ServiceRegistrar, srv SummaryServer) {
	s.RegisterService(&Summary_ServiceDesc, srv)
}

func _Summary_WeekSummary_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(SummaryRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(SummaryServer).WeekSummary(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/summary.Summary/WeekSummary",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(SummaryServer).WeekSummary(ctx, req.(*SummaryRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _Summary_MonthSummary_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(SummaryRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(SummaryServer).MonthSummary(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/summary.Summary/MonthSummary",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(SummaryServer).MonthSummary(ctx, req.(*SummaryRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _Summary_TotalSummary_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(SummaryRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(SummaryServer).TotalSummary(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/summary.Summary/TotalSummary",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(SummaryServer).TotalSummary(ctx, req.(*SummaryRequest))
	}
	return interceptor(ctx, in, info, handler)
}

// Summary_ServiceDesc is the grpc.ServiceDesc for Summary service.
// It's only intended for direct use with grpc.RegisterService,
// and not to be introspected or modified (even as a copy)
var Summary_ServiceDesc = grpc.ServiceDesc{
	ServiceName: "summary.Summary",
	HandlerType: (*SummaryServer)(nil),
	Methods: []grpc.MethodDesc{
		{
			MethodName: "WeekSummary",
			Handler:    _Summary_WeekSummary_Handler,
		},
		{
			MethodName: "MonthSummary",
			Handler:    _Summary_MonthSummary_Handler,
		},
		{
			MethodName: "TotalSummary",
			Handler:    _Summary_TotalSummary_Handler,
		},
	},
	Streams:  []grpc.StreamDesc{},
	Metadata: "summary.proto",
}
