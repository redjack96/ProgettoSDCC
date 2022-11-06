package util

import (
	"google.golang.org/protobuf/types/known/timestamppb"
	"shopping_list.microservice/generated/shopping_list.microservice/proto_generated"
)

func ToOurTimestamp(theirTimestamp *timestamppb.Timestamp) *proto_generated.Timestamp {
	return &proto_generated.Timestamp{
		Seconds: theirTimestamp.Seconds,
		Nanos:   theirTimestamp.Nanos,
	}
}
